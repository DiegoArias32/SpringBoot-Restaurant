// Script de seguridad para el panel administrativo
(function() {
    'use strict';
    
    // Constantes de configuración
    const API_BASE_URL = 'http://172.30.3.44:8080/api';
    
    // Variables globales
    let csrfToken = '';
    let requestCount = 0;
    const MAX_REQUESTS_PER_MINUTE = 100;
    let lastRequestTime = Date.now();
    let requestTimestamps = [];
    
    // Intervalo de limpieza de timestamps de solicitudes (cada minuto)
    setInterval(() => {
        const oneMinuteAgo = Date.now() - 60000;
        requestTimestamps = requestTimestamps.filter(time => time > oneMinuteAgo);
    }, 60000);
    
    // ========================
    // Funciones de seguridad
    // ========================
    
    // Verificar autenticación al cargar la página
    function checkAuth() {
        // Verificar datos de usuario en sessionStorage
        let userData = sessionStorage.getItem('userData');
        
        // Si no está en sessionStorage, verificar cookies
        if (!userData) {
            const userDataCookie = document.cookie
                .split('; ')
                .find(row => row.startsWith('userData='))
                ?.split('=')[1];
                
            if (userDataCookie) {
                userData = decodeURIComponent(userDataCookie);
                // Restaurar en sessionStorage
                sessionStorage.setItem('userData', userData);
                const parsedData = JSON.parse(userData);
                sessionStorage.setItem('userRoles', JSON.stringify(parsedData.roles));
            }
        }
        
        if (!userData) {
            redirectToLogin();
            return false;
        }
        
        try {
            const parsedUserData = JSON.parse(userData);
            const roles = parsedUserData.roles || [];
            
            // Verificar roles (solo admin y staff pueden acceder)
            if (!roles.includes('ROLE_ADMIN') && !roles.includes('ROLE_STAFF')) {
                console.log('Acceso no autorizado - rol incorrecto');
                redirectToLogin();
                return false;
            }
        } catch (e) {
            console.error('Error al analizar datos de usuario', e);
            redirectToLogin();
            return false;
        }
        
        return true;
    }
    
    // Función para redireccionar al login
    function redirectToLogin() {
        sessionStorage.removeItem('userData');
        sessionStorage.removeItem('userRoles');
        window.location.href = '../login y register/loginAndRegister.html';
    }
    
    // Función para obtener el CSRF token
    function getCsrfToken() {
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('XSRF-TOKEN='))
            ?.split('=')[1];
        return cookieValue || '';
    }
    
    // Control de tasa de peticiones
    function checkRateLimit() {
        const now = Date.now();
        requestTimestamps.push(now);
        
        // Limpiar timestamps antiguos (más de 1 minuto)
        const oneMinuteAgo = now - 60000;
        requestTimestamps = requestTimestamps.filter(time => time > oneMinuteAgo);
        
        // Verificar si se excede el límite
        if (requestTimestamps.length > MAX_REQUESTS_PER_MINUTE) {
            console.error('Límite de tasa excedido. Espere un momento.');
            showError('Demasiadas peticiones. Por favor, espere un momento antes de intentar nuevamente.');
            return false;
        }
        
        return true;
    }
    
    // Verificar datos de entrada para evitar inyección
    function sanitizeInput(input) {
        if (typeof input === 'string') {
            // Eliminar tags HTML y caracteres especiales
            return input
                .replace(/[<>]/g, '') // Eliminar < y >
                .replace(/javascript:/gi, '') // Eliminar javascript:
                .replace(/on\w+\s*=/gi, '') // Eliminar manejadores de eventos on*
                .replace(/(\b)(alert|confirm|prompt|console|window|document|eval|setTimeout|setInterval)(\s*\()/gi, '$1x$2$3'); // Funciones peligrosas
        } else if (typeof input === 'object' && input !== null) {
            // Recursivamente sanitizar objetos
            if (Array.isArray(input)) {
                return input.map(item => sanitizeInput(item));
            } else {
                const result = {};
                for (const key in input) {
                    if (Object.prototype.hasOwnProperty.call(input, key)) {
                        result[key] = sanitizeInput(input[key]);
                    }
                }
                return result;
            }
        }
        
        return input; // Devolver otros tipos sin cambios
    }
    
    // ========================
    // Funciones de API mejoradas
    // ========================
    
    // Función base para peticiones API con seguridad adicional
    async function apiRequest(url, method, data = null) {
        // Verificar autenticación
        if (!checkAuth()) {
            return;
        }
        
        // Verificar límite de tasa
        if (!checkRateLimit()) {
            throw new Error('Demasiadas peticiones. Por favor, espere un momento.');
        }
        
        try {
            // Sanitizar datos de entrada
            if (data) {
                data = sanitizeInput(data);
            }
            
            // Obtenemos el token CSRF actual
            csrfToken = getCsrfToken();
            
            const headers = {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            };
            
            const fetchOptions = {
                method: method,
                headers: headers,
                credentials: 'include' // Incluir cookies
            };
            
            if (data && (method === 'POST' || method === 'PUT')) {
                fetchOptions.body = JSON.stringify(data);
            }
            
            // Mostrar spinner de carga
            showLoading();
            
            const response = await fetch(`${API_BASE_URL}${url}`, fetchOptions);
            
            // Ocultar spinner de carga
            hideLoading();
            
            // Si la respuesta no es exitosa, lanzamos un error
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    // Error de autenticación o autorización
                    redirectToLogin();
                    throw new Error('Sesión expirada o no autorizada. Por favor, inicie sesión nuevamente.');
                }
                
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`);
            }
            
            // Para respuestas sin contenido (204)
            if (response.status === 204) {
                return null;
            }
            
            return await response.json();
        } catch (error) {
            // Ocultar spinner en caso de error
            hideLoading();
            
            console.error('Error en la petición API:', error);
            showError(error.message || 'Error en la comunicación con el servidor');
            throw error;
        }
    }
    
    // Reemplazar las funciones fetch originales por las versiones seguras
    window.secureFetchDashboardData = async function() {
        try {
            // Fetch counts for each entity
            const [clientsResponse, dishesResponse, employeesResponse, ordersResponse] = await Promise.all([
                apiRequest('/clients', 'GET'),
                apiRequest('/menu', 'GET'),
                apiRequest('/employees', 'GET'),
                apiRequest('/orders', 'GET')
            ]);
            
            // Update dashboard counts
            clientCount.textContent = Array.isArray(clientsResponse) ? clientsResponse.length : 0;
            dishCount.textContent = Array.isArray(dishesResponse) ? dishesResponse.length : 0;
            employeeCount.textContent = Array.isArray(employeesResponse) ? employeesResponse.length : 0;
            orderCount.textContent = Array.isArray(ordersResponse) ? ordersResponse.length : 0;
            
            // Make sure orders is an array before using slice
            if (!Array.isArray(ordersResponse)) {
                console.error('Orders data is not an array:', ordersResponse);
                recentOrdersTableBody.innerHTML = '';
                recentOrdersTableBody.appendChild(createNoDataRow('No orders found or invalid data format', 6));
                return;
            }
            
            // Display recent orders (limit to 5)
            const recentOrders = ordersResponse.slice(0, 5);
            
            // Get customer names for each order
            const customerIds = recentOrders.map(order => order.idCustomer);
            const clientsById = {};
            
            if (Array.isArray(clientsResponse)) {
                clientsResponse.forEach(client => {
                    clientsById[client.idClient] = `${client.firstName} ${client.lastName}`;
                });
            }
            
            // Populate recent orders table
            recentOrdersTableBody.innerHTML = '';
            
            if (recentOrders.length === 0) {
                recentOrdersTableBody.appendChild(createNoDataRow('No orders found', 6));
                return;
            }
            
            recentOrders.forEach(order => {
                const row = createRecentOrderRow(order, clientsById);
                recentOrdersTableBody.appendChild(row);
            });
            
        } catch (error) {
            console.error('Dashboard data error:', error);
            showError('Failed to load dashboard data: ' + error.message);
        }
    };
    
    window.secureFetchEmployees = async function() {
        try {
            const employees = await apiRequest('/employees', 'GET');
            displayEmployees(employees);
        } catch (error) {
            showError(error.message);
        }
    };
    
    window.secureFetchDishes = async function() {
        try {
            const dishes = await apiRequest('/menu', 'GET');
            displayDishes(dishes);
        } catch (error) {
            showError(error.message);
        }
    };
    
    window.secureFetchClients = async function() {
        try {
            const clients = await apiRequest('/clients', 'GET');
            displayClients(clients);
        } catch (error) {
            showError(error.message);
        }
    };
    
    window.secureFetchOrders = async function() {
        try {
            const orders = await apiRequest('/orders', 'GET');
            
            // Fetch clients to get names
            const clients = await apiRequest('/clients', 'GET');
            
            // Create a map of client IDs to names
            const clientMap = {};
            clients.forEach(client => {
                clientMap[client.idClient] = `${client.firstName} ${client.lastName}`;
            });
            
            displayOrders(orders, clientMap);
            
            // Also populate the customer dropdown for new orders
            populateCustomerDropdown(clients);
        } catch (error) {
            showError(error.message);
        }
    };
    
    window.secureUpdateEmployee = async function(id, employeeData) {
        try {
            const result = await apiRequest(`/employees/${id}`, 'PUT', employeeData);
            return result;
        } catch (error) {
            showError(error.message);
            throw error;
        }
    };
    
    window.secureDeleteEmployee = async function(id) {
        try {
            const result = await apiRequest(`/employees/${id}`, 'DELETE');
            return result;
        } catch (error) {
            showError(error.message);
            throw error;
        }
    };
    
    window.secureCreateEmployee = async function(employeeData) {
        try {
            const result = await apiRequest('/employees', 'POST', employeeData);
            return result;
        } catch (error) {
            showError(error.message);
            throw error;
        }
    };
    
    // Implementar el resto de las funciones de la misma manera
    window.secureCreateDish = async function(dishData) {
        try {
            const result = await apiRequest('/menu', 'POST', dishData);
            return result;
        } catch (error) {
            showError(error.message);
            throw error;
        }
    };
    
    window.secureUpdateDish = async function(id, dishData) {
        try {
            const result = await apiRequest(`/menu/${id}`, 'PUT', dishData);
            return result;
        } catch (error) {
            showError(error.message);
            throw error;
        }
    };
    
    window.secureDeleteDish = async function(id) {
        try {
            const result = await apiRequest(`/menu/${id}`, 'DELETE');
            return result;
        } catch (error) {
            showError(error.message);
            throw error;
        }
    };
    
    window.secureCreateClient = async function(clientData) {
        try {
            const result = await apiRequest('/clients', 'POST', clientData);
            return result;
        } catch (error) {
            showError(error.message);
            throw error;
        }
    };
    
    window.secureUpdateClient = async function(id, clientData) {
        try {
            const result = await apiRequest(`/clients/${id}`, 'PUT', clientData);
            return result;
        } catch (error) {
            showError(error.message);
            throw error;
        }
    };
    
    window.secureDeleteClient = async function(id) {
        try {
            const result = await apiRequest(`/clients/${id}`, 'DELETE');
            return result;
        } catch (error) {
            showError(error.message);
            throw error;
        }
    };
    
    window.secureCreateOrder = async function(orderData) {
        try {
            const result = await apiRequest('/orders', 'POST', orderData);
            return result;
        } catch (error) {
            showError(error.message);
            throw error;
        }
    };
    
    window.secureUpdateOrder = async function(id, orderData) {
        try {
            const result = await apiRequest(`/orders/${id}`, 'PUT', orderData);
            return result;
        } catch (error) {
            showError(error.message);
            throw error;
        }
    };
    
    window.secureDeleteOrder = async function(id) {
        try {
            const result = await apiRequest(`/orders/${id}`, 'DELETE');
            return result;
        } catch (error) {
            showError(error.message);
            throw error;
        }
    };
    
    window.secureUpdateOrderStatus = async function(id, status) {
        try {
            const result = await apiRequest(`/orders/${id}/status?status=${status}`, 'PUT');
            return result;
        } catch (error) {
            showError(error.message);
            throw error;
        }
    };
    
    window.secureGetOrderDetails = async function(id) {
        try {
            const orderDetails = await apiRequest(`/order-details/order/${id}`, 'GET');
            return orderDetails;
        } catch (error) {
            showError(error.message);
            throw error;
        }
    };
    
    // Cerrar sesión
    window.logout = async function() {
        try {
            await apiRequest('/auth/signout', 'POST');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        } finally {
            sessionStorage.removeItem('userData');
            sessionStorage.removeItem('userRoles');
            window.location.href = '../login y register/loginAndRegister.html';
        }
    };
    
    // ========================
    // Funciones de ayuda
    // ========================
    
    function showLoading() {
        const loadingSpinner = document.getElementById('loadingSpinner');
        if (loadingSpinner) {
            loadingSpinner.classList.add('active');
        }
    }
    
    function hideLoading() {
        const loadingSpinner = document.getElementById('loadingSpinner');
        if (loadingSpinner) {
            loadingSpinner.classList.remove('active');
        }
    }
    
    function showSuccess(message) {
        const successAlert = document.getElementById('successAlert');
        if (successAlert) {
            successAlert.textContent = message;
            successAlert.classList.add('active');
            
            setTimeout(() => {
                successAlert.classList.remove('active');
            }, 3000);
        }
    }
    
    function showError(message) {
        const errorAlert = document.getElementById('errorAlert');
        if (errorAlert) {
            errorAlert.textContent = message;
            errorAlert.classList.add('active');
            
            setTimeout(() => {
                errorAlert.classList.remove('active');
            }, 3000);
        }
    }
    
    // ========================
    // Inicialización
    // ========================
    
    // Verificar autenticación al cargar la página
    document.addEventListener('DOMContentLoaded', function() {
        // Verificar autenticación
        if (!checkAuth()) {
            return;
        }
        
        // Obtener token CSRF
        csrfToken = getCsrfToken();
        
        // Añadir botón de logout
        const headerContent = document.querySelector('.header-content');
        if (headerContent) {
            const logoutButton = document.createElement('button');
            logoutButton.className = 'btn btn-danger logout-btn';
            logoutButton.innerHTML = '<i class="fas fa-sign-out-alt"></i> Cerrar Sesión';
            logoutButton.addEventListener('click', logout);
            headerContent.appendChild(logoutButton);
        }
        
        // Protección contra XSS en elementos de entrada
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.type !== 'password' && this.type !== 'number') {
                    this.value = sanitizeInput(this.value);
                }
            });
        });
        
        // Cargar datos iniciales
        fetchDashboardData();
        
        // Reemplazar métodos fetch estándar con versiones seguras
        window.fetchDashboardData = window.secureFetchDashboardData;
        window.fetchEmployees = window.secureFetchEmployees;
        window.fetchDishes = window.secureFetchDishes;
        window.fetchClients = window.secureFetchClients;
        window.fetchOrders = window.secureFetchOrders;
    });
    
    // Añadir gestión de errores global
    window.addEventListener('error', function(event) {
        console.error('Error global:', event.message);
        showError('Se ha producido un error en la aplicación. Por favor, recargue la página o contacte al administrador.');
    });
    
    // Prevenir ataques de clickjacking
    if (window.self !== window.top) {
        // La página está en un iframe
        window.top.location = window.self.location;
    }
    
})();