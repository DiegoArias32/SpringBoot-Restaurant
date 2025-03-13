const API_BASE_URL = 'http://localhost:8080/api';

// DOM Elements - Navigation
const tabButtons = document.querySelectorAll('.tab-btn');
const sectionContents = document.querySelectorAll('.section-content');

// DOM Elements - Clientes
const clientsListModal = document.getElementById('clients-list-modal');
const clientsModal = document.getElementById('clients-modal');
const viewClientsBtn = document.getElementById('view-clients-btn');
const closeClientsModalBtn = document.getElementById('close-clients-modal');
const clientModal = document.getElementById('client-modal');
const addClientBtn = document.getElementById('add-client');
const cancelClientBtn = document.getElementById('cancel-client');
const clientForm = document.getElementById('client-form');
const searchClientsInput = document.getElementById('clients-search-modal');

// DOM Elements - Empleados
const employeesListModal = document.getElementById('employees-list-modal');
const employeesModal = document.getElementById('employees-modal');
const viewEmployeesBtn = document.getElementById('view-employees-btn');
const closeEmployeesModalBtn = document.getElementById('close-employees-modal');
const employeeModal = document.getElementById('employee-modal');
const addEmployeeBtn = document.getElementById('add-employee');
const cancelEmployeeBtn = document.getElementById('cancel-employee');
const employeeForm = document.getElementById('employee-form');
const searchEmployeesInput = document.getElementById('employees-search-modal');

// DOM Elements - Menu
const menuListModal = document.getElementById('menu-list-modal');
const menuModal = document.getElementById('menu-modal');
const viewMenuBtn = document.getElementById('view-menu-btn');
const closeMenuModalBtn = document.getElementById('close-menu-modal');
const dishModal = document.getElementById('dish-modal');
const addDishBtn = document.getElementById('add-dish');
const cancelDishBtn = document.getElementById('cancel-dish');
const dishForm = document.getElementById('dish-form');
const searchMenuInput = document.getElementById('menu-search-modal');

// DOM Elements - Pedidos
const ordersListModal = document.getElementById('orders-list-modal');
const ordersModal = document.getElementById('orders-modal');
const viewOrdersBtn = document.getElementById('view-orders-btn');
const closeOrdersModalBtn = document.getElementById('close-orders-modal');
const orderModal = document.getElementById('order-modal');
const addOrderBtn = document.getElementById('add-order');
const cancelOrderBtn = document.getElementById('cancel-order');
const orderForm = document.getElementById('order-form');
const orderClientSelect = document.getElementById('order-client');
const addDishToOrderBtn = document.getElementById('add-dish-to-order');
const orderItemsContainer = document.getElementById('order-items');
const orderTotal = document.getElementById('order-total');
const searchOrdersInput = document.getElementById('orders-search-modal');

// Navigation Tab Switching
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and hide all sections
        tabButtons.forEach(btn => btn.classList.remove('active'));
        sectionContents.forEach(section => section.classList.add('hidden'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Show corresponding section
        const sectionId = button.id.replace('btn-', 'section-');
        document.getElementById(sectionId).classList.remove('hidden');
    });
});

// ============================
// CLIENTS FUNCTIONALITY
// ============================

// Fetch Clients with optional search term
async function fetchClients(searchTerm = '') {
    try {
        const url = searchTerm 
            ? `${API_BASE_URL}/clientes/buscar?termino=${encodeURIComponent(searchTerm)}`
            : `${API_BASE_URL}/clientes`;

        const response = await axios.get(url);
        const clients = response.data;

        if (clients.length === 0) {
            clientsListModal.innerHTML = `
                <div class="text-center text-gray-500 p-4 animate-fade-in">
                    No se encontraron clientes${searchTerm ? ` para "${searchTerm}"` : ''}.
                </div>
            `;
            return [];
        }

        clientsListModal.innerHTML = clients.map(client => {
            const highlightTerm = (text) => {
                if (!searchTerm) return text;
                const regex = new RegExp(`(${searchTerm})`, 'gi');
                return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
            };

            return `
                <div class="client-card p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all animate-fade-in">
                    <div class="flex justify-between items-center">
                        <div>
                            <p class="font-bold text-lg">
                                ${highlightTerm(client.nombre)} ${highlightTerm(client.apellido)}
                            </p>
                            <p class="text-sm text-gray-600 mt-1">
                                <i class="fas fa-envelope mr-2 text-green-600"></i>${highlightTerm(client.email)}
                            </p>
                        </div>
                        <span class="text-green-700 flex items-center">
                            <i class="fas fa-phone mr-2"></i>${client.telefono || 'N/A'}
                        </span>
                    </div>
                </div>
            `;
        }).join('');

        return clients;
    } catch (error) {
        console.error('Error fetching clients:', error);
        clientsListModal.innerHTML = `
            <div class="text-center text-red-500 animate-fade-in">
                Error al cargar clientes. 
                ${error.response ? error.response.data : error.message}
            </div>
        `;
        return [];
    }
}

// ============================
// EMPLOYEES FUNCTIONALITY
// ============================

// Fetch Employees with optional search term
async function fetchEmployees(searchTerm = '') {
    try {
        const url = searchTerm 
            ? `${API_BASE_URL}/empleados/buscar?termino=${encodeURIComponent(searchTerm)}`
            : `${API_BASE_URL}/empleados`;

        const response = await axios.get(url);
        const employees = response.data;

        if (employees.length === 0) {
            employeesListModal.innerHTML = `
                <div class="text-center text-gray-500 p-4 animate-fade-in">
                    No se encontraron empleados${searchTerm ? ` para "${searchTerm}"` : ''}.
                </div>
            `;
            return [];
        }

        employeesListModal.innerHTML = employees.map(employee => {
            const highlightTerm = (text) => {
                if (!searchTerm) return text;
                const regex = new RegExp(`(${searchTerm})`, 'gi');
                return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
            };

            return `
                <div class="employee-card p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all animate-fade-in">
                    <div class="flex justify-between items-center">
                        <div>
                            <div>
                            <p class="font-bold text-lg">
                                ${highlightTerm(employee.nombre)} ${highlightTerm(employee.apellido)}
                            </p>
                            <p class="text-sm text-gray-600 mt-1">
                                <i class="fas fa-briefcase mr-2 text-green-600"></i>${highlightTerm(employee.puesto)}
                            </p>
                        </div>
                        <span class="text-green-700 flex items-center">
                            $${parseFloat(employee.salario).toFixed(2)}
                        </span>
                    </div>
                </div>
            `;
        }).join('');

        return employees;
    } catch (error) {
        console.error('Error fetching employees:', error);
        employeesListModal.innerHTML = `
            <div class="text-center text-red-500 animate-fade-in">
                Error al cargar empleados. 
                ${error.response ? error.response.data : error.message}
            </div>
        `;
        return [];
    }
}

// ============================
// MENU FUNCTIONALITY
// ============================

// Fetch Menu with optional search term
async function fetchMenu(searchTerm = '') {
    try {
        const url = searchTerm 
            ? `${API_BASE_URL}/menu/buscar?termino=${encodeURIComponent(searchTerm)}`
            : `${API_BASE_URL}/menu`;

        const response = await axios.get(url);
        const menuItems = response.data;

        if (menuItems.length === 0) {
            menuListModal.innerHTML = `
                <div class="text-center text-gray-500 p-4 animate-fade-in">
                    No se encontraron platos${searchTerm ? ` para "${searchTerm}"` : ''}.
                </div>
            `;
            return [];
        }

        menuListModal.innerHTML = menuItems.map(item => {
            const highlightTerm = (text) => {
                if (!searchTerm || !text) return text || '';
                const regex = new RegExp(`(${searchTerm})`, 'gi');
                return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
            };

            return `
                <div class="menu-card p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all animate-fade-in">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="font-bold text-lg">
                                ${highlightTerm(item.nombre)}
                            </p>
                            <p class="text-sm text-gray-600 mt-1">
                                ${highlightTerm(item.descripcion || 'Sin descripción')}
                            </p>
                        </div>
                        <span class="text-green-700 font-bold">
                            $${parseFloat(item.precio).toFixed(2)}
                        </span>
                    </div>
                </div>
            `;
        }).join('');

        return menuItems;
    } catch (error) {
        console.error('Error fetching menu:', error);
        menuListModal.innerHTML = `
            <div class="text-center text-red-500 animate-fade-in">
                Error al cargar el menú. 
                ${error.response ? error.response.data : error.message}
            </div>
        `;
        return [];
    }
}

// ============================
// ORDERS FUNCTIONALITY
// ============================

// Fetch Orders with optional search term
async function fetchOrders(searchTerm = '') {
    try {
        const url = searchTerm 
            ? `${API_BASE_URL}/pedidos/buscar?termino=${encodeURIComponent(searchTerm)}`
            : `${API_BASE_URL}/pedidos`;

        const response = await axios.get(url);
        const orders = response.data;

        if (orders.length === 0) {
            ordersListModal.innerHTML = `
                <div class="text-center text-gray-500 p-4 animate-fade-in">
                    No se encontraron pedidos${searchTerm ? ` para "${searchTerm}"` : ''}.
                </div>
            `;
            return;
        }

        // For each order, fetch the client and order details
        const ordersWithDetails = await Promise.all(orders.map(async (order) => {
            const clientResponse = await axios.get(`${API_BASE_URL}/clientes/${order.id_cliente}`);
            const detailsResponse = await axios.get(`${API_BASE_URL}/pedidos/${order.id_pedido}/detalles`);
            
            return {
                ...order,
                cliente: clientResponse.data,
                detalles: detailsResponse.data,
                total: detailsResponse.data.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
            };
        }));

        ordersListModal.innerHTML = ordersWithDetails.map(order => {
            const fecha = new Date(order.fecha).toLocaleString();
            const highlightTerm = (text) => {
                if (!searchTerm || !text) return text || '';
                const regex = new RegExp(`(${searchTerm})`, 'gi');
                return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
            };

            // Get status badge color
            let statusClass = '';
            switch(order.estado) {
                case 'Pendiente':
                    statusClass = 'bg-yellow-100 text-yellow-800';
                    break;
                case 'En Proceso':
                    statusClass = 'bg-blue-100 text-blue-800';
                    break;
                case 'Completado':
                    statusClass = 'bg-green-100 text-green-800';
                    break;
                case 'Cancelado':
                    statusClass = 'bg-red-100 text-red-800';
                    break;
                default:
                    statusClass = 'bg-gray-100 text-gray-800';
            }

            return `
                <div class="order-card p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all animate-fade-in">
                    <div class="flex justify-between items-start">
                        <div>
                            <div class="flex items-center gap-2">
                                <p class="font-bold text-lg">
                                    Pedido #${order.id_pedido}
                                </p>
                                <span class="px-2 py-1 rounded-full text-xs ${statusClass}">
                                    ${order.estado}
                                </span>
                            </div>
                            <p class="text-sm text-gray-600 mt-1">
                                <i class="fas fa-user mr-2 text-green-600"></i>
                                ${highlightTerm(order.cliente.nombre)} ${highlightTerm(order.cliente.apellido)}
                            </p>
                            <p class="text-sm text-gray-600">
                                <i class="fas fa-calendar-alt mr-2 text-green-600"></i>${fecha}
                            </p>
                            <div class="mt-2 pt-2 border-t">
                                <p class="text-sm font-semibold">Platos (${order.detalles.length}):</p>
                                <ul class="text-sm pl-5 list-disc">
                                    ${order.detalles.slice(0, 3).map(item => 
                                        `<li>${item.cantidad} x ${item.nombre_plato}</li>`
                                    ).join('')}
                                    ${order.detalles.length > 3 ? `<li>... y ${order.detalles.length - 3} más</li>` : ''}
                                </ul>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-green-700 font-bold">
                                $${parseFloat(order.total).toFixed(2)}
                            </p>
                            <button class="view-order-details mt-2 px-3 py-1 bg-green-600 text-white text-sm rounded-full" 
                                    data-order-id="${order.id_pedido}">
                                Ver Detalles
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Add event listeners to "View Details" buttons
        document.querySelectorAll('.view-order-details').forEach(button => {
            button.addEventListener('click', async () => {
                const orderId = button.getAttribute('data-order-id');
                // Here you would implement the view order details functionality
                alert(`Ver detalles del pedido #${orderId}`);
            });
        });

    } catch (error) {
        console.error('Error fetching orders:', error);
        ordersListModal.innerHTML = `
            <div class="text-center text-red-500 animate-fade-in">
                Error al cargar pedidos. 
                ${error.response ? error.response.data : error.message}
            </div>
        `;
    }
}

// ============================
// LOAD CLIENT SELECT FOR ORDERS
// ============================

async function loadClientSelect() {
    try {
        const clients = await fetchClients();
        
        // Clear previous options except the placeholder
        orderClientSelect.innerHTML = '<option value="" disabled selected>Seleccionar cliente</option>';
        
        // Add client options
        clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.id_cliente;
            option.textContent = `${client.nombre} ${client.apellido}`;
            orderClientSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading client select:', error);
    }
}

// ============================
// LOAD DISH SELECTS FOR ORDER
// ============================

async function loadDishSelects() {
    try {
        const menuItems = await fetchMenu();
        
        // Find all dish selects and populate them
        document.querySelectorAll('.dish-select').forEach(select => {
            // Keep the first option (placeholder)
            select.innerHTML = '<option value="" disabled selected>Seleccionar plato</option>';
            
            // Add dish options
            menuItems.forEach(dish => {
                const option = document.createElement('option');
                option.value = dish.id_plato;
                option.textContent = dish.nombre;
                option.dataset.price = dish.precio;
                select.appendChild(option);
            });
        });
    } catch (error) {
        console.error('Error loading dish selects:', error);
    }
}

// ============================
// ORDER ITEM HANDLERS
// ============================

function handleDishSelection(select) {
    const orderItem = select.closest('.order-item');
    const priceElement = orderItem.querySelector('.dish-price');
    const quantityInput = orderItem.querySelector('.dish-quantity');
    
    const selectedOption = select.options[select.selectedIndex];
    
    if (selectedOption && selectedOption.dataset.price) {
        const price = parseFloat(selectedOption.dataset.price);
        const quantity = parseInt(quantityInput.value) || 1;
        priceElement.textContent = `$${(price * quantity).toFixed(2)}`;
    } else {
        priceElement.textContent = '$0.00';
    }
    
    updateOrderTotal();
}

function handleQuantityChange(input) {
    const orderItem = input.closest('.order-item');
    const select = orderItem.querySelector('.dish-select');
    const priceElement = orderItem.querySelector('.dish-price');
    
    const selectedOption = select.options[select.selectedIndex];
    
    if (selectedOption && selectedOption.dataset.price) {
        const price = parseFloat(selectedOption.dataset.price);
        const quantity = parseInt(input.value) || 1;
        priceElement.textContent = `$${(price * quantity).toFixed(2)}`;
    }
    
    updateOrderTotal();
}

function addOrderItemListeners(orderItem) {
    const select = orderItem.querySelector('.dish-select');
    const quantityInput = orderItem.querySelector('.dish-quantity');
    const removeButton = orderItem.querySelector('.remove-dish');
    
    select.addEventListener('change', () => handleDishSelection(select));
    quantityInput.addEventListener('change', () => handleQuantityChange(quantityInput));
    quantityInput.addEventListener('input', () => handleQuantityChange(quantityInput));
    
    removeButton.addEventListener('click', () => {
        if (document.querySelectorAll('.order-item').length > 1) {
            orderItem.remove();
            updateOrderTotal();
        } else {
            alert('Debe haber al menos un plato en el pedido');
        }
    });
}

function addNewOrderItem() {
    const orderItem = document.createElement('div');
    orderItem.className = 'order-item bg-white p-3 rounded border flex justify-between items-center animate-fade-in';
    orderItem.innerHTML = `
        <div class="flex-grow">
            <select class="dish-select w-full p-2 border rounded mb-2 bg-white">
                <option value="" disabled selected>Seleccionar plato</option>
                <!-- Menu items will be loaded dynamically -->
            </select>
            <div class="flex items-center">
                <label class="mr-2 text-sm">Cantidad:</label>
                <input type="number" class="dish-quantity p-2 border rounded w-20" min="1" value="1">
            </div>
        </div>
        <div class="ml-4 text-right">
            <div class="dish-price text-lg font-bold">$0.00</div>
            <button type="button" class="remove-dish text-red-500 hover:text-red-700">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    orderItemsContainer.appendChild(orderItem);
    addOrderItemListeners(orderItem);
    
    // Load dish options for the new select
    loadDishSelects();
}

function updateOrderTotal() {
    let total = 0;
    
    document.querySelectorAll('.order-item').forEach(item => {
        const priceText = item.querySelector('.dish-price').textContent;
        const price = parseFloat(priceText.replace('$', '')) || 0;
        total += price;
    });
    
    orderTotal.textContent = `$${total.toFixed(2)}`;
}

// ============================
// EVENT LISTENERS
// ============================

// Debounce function
function debounce(func, timeout = 300){
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

// CLIENTS
viewClientsBtn.addEventListener('click', () => {
    clientsModal.classList.remove('hidden');
    clientsModal.classList.add('flex');
    fetchClients();
});

closeClientsModalBtn.addEventListener('click', () => {
    clientsModal.classList.add('hidden');
    clientsModal.classList.remove('flex');
});

addClientBtn.addEventListener('click', () => {
    clientModal.classList.remove('hidden');
    clientModal.classList.add('flex');
});

cancelClientBtn.addEventListener('click', () => {
    clientModal.classList.add('hidden');
    clientModal.classList.remove('flex');
});

clientForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const clientData = {
        nombre: document.getElementById('client-name').value,
        apellido: document.getElementById('client-lastname').value,
        email: document.getElementById('client-email').value,
        telefono: document.getElementById('client-phone').value
    };

    try {
        const response = await axios.post(`${API_BASE_URL}/clientes`, clientData);
        console.log(response.data);
        clientModal.classList.add('hidden');
        clientModal.classList.remove('flex');
        fetchClients(); // Refresh the list if the clients modal is open
        clientForm.reset();
        alert('Cliente registrado exitosamente');
    } catch (error) {
        console.error('Error adding client:', error);
        alert(`Error al registrar cliente: ${error.response ? error.response.data : error.message}`);
    }
});

const debouncedClientSearch = debounce((event) => {
    const searchTerm = event.target.value.trim();
    fetchClients(searchTerm);
});

searchClientsInput.addEventListener('input', debouncedClientSearch);

// EMPLOYEES
viewEmployeesBtn.addEventListener('click', () => {
    employeesModal.classList.remove('hidden');
    employeesModal.classList.add('flex');
    fetchEmployees();
});

closeEmployeesModalBtn.addEventListener('click', () => {
    employeesModal.classList.add('hidden');
    employeesModal.classList.remove('flex');
});

addEmployeeBtn.addEventListener('click', () => {
    employeeModal.classList.remove('hidden');
    employeeModal.classList.add('flex');
});

cancelEmployeeBtn.addEventListener('click', () => {
    employeeModal.classList.add('hidden');
    employeeModal.classList.remove('flex');
});

employeeForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const employeeData = {
        nombre: document.getElementById('employee-name').value,
        apellido: document.getElementById('employee-lastname').value,
        puesto: document.getElementById('employee-position').value,
        salario: document.getElementById('employee-salary').value
    };

    try {
        const response = await axios.post(`${API_BASE_URL}/empleados`, employeeData);
        console.log(response.data);
        employeeModal.classList.add('hidden');
        employeeModal.classList.remove('flex');
        fetchEmployees(); // Refresh the list if the employees modal is open
        employeeForm.reset();
        alert('Empleado registrado exitosamente');
    } catch (error) {
        console.error('Error adding employee:', error);
        alert(`Error al registrar empleado: ${error.response ? error.response.data : error.message}`);
    }
});

const debouncedEmployeeSearch = debounce((event) => {
    const searchTerm = event.target.value.trim();
    fetchEmployees(searchTerm);
});

searchEmployeesInput.addEventListener('input', debouncedEmployeeSearch);

// MENU
viewMenuBtn.addEventListener('click', () => {
    menuModal.classList.remove('hidden');
    menuModal.classList.add('flex');
    fetchMenu();
});

closeMenuModalBtn.addEventListener('click', () => {
    menuModal.classList.add('hidden');
    menuModal.classList.remove('flex');
});

addDishBtn.addEventListener('click', () => {
    dishModal.classList.remove('hidden');
    dishModal.classList.add('flex');
});

cancelDishBtn.addEventListener('click', () => {
    dishModal.classList.add('hidden');
    dishModal.classList.remove('flex');
});

dishForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const dishData = {
        nombre: document.getElementById('dish-name').value,
        descripcion: document.getElementById('dish-description').value,
        precio: document.getElementById('dish-price').value
    };

    try {
        const response = await axios.post(`${API_BASE_URL}/menu`, dishData);
        console.log(response.data);
        dishModal.classList.add('hidden');
        dishModal.classList.remove('flex');
        fetchMenu(); // Refresh the list if the menu modal is open
        dishForm.reset();
        alert('Plato añadido exitosamente');
    } catch (error) {
        console.error('Error adding dish:', error);
        alert(`Error al añadir plato: ${error.response ? error.response.data : error.message}`);
    }
});

const debouncedMenuSearch = debounce((event) => {
    const searchTerm = event.target.value.trim();
    fetchMenu(searchTerm);
});

searchMenuInput.addEventListener('input', debouncedMenuSearch);

// ORDERS
viewOrdersBtn.addEventListener('click', () => {
    ordersModal.classList.remove('hidden');
    ordersModal.classList.add('flex');
    fetchOrders();
});

closeOrdersModalBtn.addEventListener('click', () => {
    ordersModal.classList.add('hidden');
    ordersModal.classList.remove('flex');
});

addOrderBtn.addEventListener('click', async () => {
    orderModal.classList.remove('hidden');
    orderModal.classList.add('flex');
    
    // Reset form
    orderForm.reset();
    
    // Reset order items to just one empty item
    orderItemsContainer.innerHTML = '';
    addNewOrderItem();
    
    // Initialize client select
    await loadClientSelect();
});

cancelOrderBtn.addEventListener('click', () => {
    orderModal.classList.add('hidden');
    orderModal.classList.remove('flex');
});

addDishToOrderBtn.addEventListener('click', () => {
    addNewOrderItem();
});

// Initialize first order item listeners
document.querySelectorAll('.order-item').forEach(item => {
    addOrderItemListeners(item);
});

orderForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const clientId = orderClientSelect.value;
    if (!clientId) {
        alert('Por favor seleccione un cliente');
        return;
    }
    
    const orderItems = [];
    let isValid = true;
    
    document.querySelectorAll('.order-item').forEach(item => {
        const select = item.querySelector('.dish-select');
        const quantityInput = item.querySelector('.dish-quantity');
        
        const dishId = select.value;
        const quantity = parseInt(quantityInput.value) || 0;
        
        if (!dishId) {
            alert('Por favor seleccione un plato para cada ítem');
            isValid = false;
            return;
        }
        
        if (quantity <= 0) {
            alert('La cantidad debe ser mayor a 0');
            isValid = false;
            return;
        }
        
        const selectedOption = select.options[select.selectedIndex];
        const price = parseFloat(selectedOption.dataset.price) || 0;
        
        orderItems.push({
            id_plato: dishId,
            cantidad: quantity,
            precio: price
        });
    });
    
    if (!isValid) return;
    
    // Create order
    try {
        // First create the order
        const orderResponse = await axios.post(`${API_BASE_URL}/pedidos`, {
            id_cliente: clientId
        });
        
        const orderId = orderResponse.data.id_pedido;
        
        // Then add each order item
        for (const item of orderItems) {
            await axios.post(`${API_BASE_URL}/pedidos/${orderId}/detalles`, {
                id_plato: item.id_plato,
                cantidad: item.cantidad,
                precio: item.precio
            });
        }
        
        orderModal.classList.add('hidden');
        orderModal.classList.remove('flex');
        fetchOrders(); // Refresh the orders list
        alert('Pedido registrado exitosamente');
    } catch (error) {
        console.error('Error creating order:', error);
        alert(`Error al registrar pedido: ${error.response ? error.response.data : error.message}`);
    }
});

const debouncedOrderSearch = debounce((event) => {
    const searchTerm = event.target.value.trim();
    fetchOrders(searchTerm);
});

searchOrdersInput.addEventListener('input', debouncedOrderSearch);

// Initialize with clients section active
document.getElementById('btn-clientes').click();