const API_BASE_URL = 'http://localhost:8080/api';
        
// DOM Elements
const clientsListModal = document.getElementById('clients-list-modal');
const clientsModal = document.getElementById('clients-modal');
const viewClientsBtn = document.getElementById('view-clients-btn');
const closeClientsModalBtn = document.getElementById('close-clients-modal');
const clientModal = document.getElementById('client-modal');
const clientModalTitle = document.getElementById('client-modal-title');
const addClientBtn = document.getElementById('add-client');
const mobileAddClientBtn = document.getElementById('mobile-add-client');
const cancelClientBtn = document.getElementById('cancel-client');
const clientForm = document.getElementById('client-form');
const submitClientBtn = document.getElementById('submit-client');
const searchClientsInput = document.getElementById('clients-search-modal');
const recentClientsList = document.getElementById('recent-clients');
const clientDetailsModal = document.getElementById('client-details-modal');
const closeDetailsModalBtn = document.getElementById('close-details-modal');
const clientDetailsContent = document.getElementById('client-details-content');
const editClientBtn = document.getElementById('edit-client');
const deleteClientBtn = document.getElementById('delete-client');
const deleteConfirmModal = document.getElementById('delete-confirm-modal');
const cancelDeleteBtn = document.getElementById('cancel-delete');
const confirmDeleteBtn = document.getElementById('confirm-delete');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const closeMobileMenuBtn = document.getElementById('close-mobile-menu');
const navLinks = document.querySelectorAll('.nav-link');
const applyFiltersBtn = document.getElementById('apply-filters');
const filterInputs = {
    name: document.getElementById('filter-name'),
    phone: document.getElementById('filter-phone'),
    email: document.getElementById('filter-email')
};

let currentClientId = null;
let currentPage = 'clients';

// Navigation handling
function showPage(pageId) {
    document.querySelectorAll('.page-content').forEach(page => {
        page.classList.add('hidden');
    });
    document.getElementById(`page-${pageId}`).classList.remove('hidden');
    
    navLinks.forEach(link => {
        link.classList.remove('active', 'bg-green-700');
        if (link.dataset.page === pageId) {
            link.classList.add('active', 'bg-green-700');
        }
    });
    
    currentPage = pageId;
    
    // Close mobile menu
    mobileMenu.classList.remove('open');
}

navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        showPage(link.dataset.page);
    });
});

// Mobile menu handling
mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.add('open');
});

closeMobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
});

mobileAddClientBtn.addEventListener('click', () => {
    openClientModal();
});

// CRUD Operations

// Fetch all clients
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
            return clients;
        }

        clientsListModal.innerHTML = clients.map(client => {
            const highlightTerm = (text) => {
                if (!searchTerm) return text;
                const regex = new RegExp(`(${searchTerm})`, 'gi');
                return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
            };

            return `
                <div class="client-card p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all animate-fade-in cursor-pointer" 
                    data-client-id="${client.id}" onclick="viewClientDetails('${client.id}')">
                    <div class="flex justify-between items-center">
                        <div>
                            <p class="font-bold text-lg">
                                ${highlightTerm(client.nombre || '')} ${highlightTerm(client.apellido || '')}
                            </p>
                            <p class="text-sm text-gray-600 mt-1">
                                <i class="fas fa-envelope mr-2 text-green-600"></i>${highlightTerm(client.email || '')}
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

// Fetch client by ID
async function fetchClientById(id) {
    try {
        const response = await axios.get(`${API_BASE_URL}/clientes/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching client with ID ${id}:`, error);
        throw error;
    }
}

// Fetch Recent Clients for Dashboard
async function fetchRecentClients() {
    try {
        const clients = await fetchClients();
        // Show just the last 5 clients
        const recentClients = clients.slice(0, 5);
        
        if (recentClients.length === 0) {
            recentClientsList.innerHTML = `
                <div class="text-center text-gray-500 p-4">
                    No hay clientes registrados.
                </div>
            `;
            return;
        }
        
        recentClientsList.innerHTML = recentClients.map(client => `
            <div class="client-card p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
                data-client-id="${client.id}" onclick="viewClientDetails('${client.id}')">
                <div class="flex justify-between items-center">
                    <div>
                        <p class="font-bold text-lg">${client.nombre || ''} ${client.apellido || ''}</p>
                        <p class="text-sm text-gray-600 mt-1">
                            <i class="fas fa-envelope mr-2 text-green-600"></i>${client.email || ''}
                        </p>
                    </div>
                    <span class="text-green-700 flex items-center">
                        <i class="fas fa-phone mr-2"></i>${client.telefono || 'N/A'}
                    </span>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error fetching recent clients:', error);
        recentClientsList.innerHTML = `
            <div class="text-center text-red-500 p-4">
                Error al cargar clientes recientes.
            </div>
        `;
    }
}

// Filter clients
async function filterClients() {
    const filters = {
        nombre: filterInputs.name.value.trim(),
        telefono: filterInputs.phone.value.trim(),
        email: filterInputs.email.value.trim()
    };
    
    try {
        // We could adjust this to use a specific filter endpoint if available
        const url = new URL(`${API_BASE_URL}/clientes/filtrar`);
        
        // Add filter parameters
        for (const [key, value] of Object.entries(filters)) {
            if (value) {
                url.searchParams.append(key, value);
            }
        }
        
        const response = await axios.get(url.toString());
        const clients = response.data;
        
        // Update recent clients list with filtered results
        if (clients.length === 0) {
            recentClientsList.innerHTML = `
                <div class="text-center text-gray-500 p-4 animate-fade-in">
                    No se encontraron clientes con los filtros aplicados.
                </div>
            `;
            return;
        }
        
        recentClientsList.innerHTML = clients.map(client => `
            <div class="client-card p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
                data-client-id="${client.id}" onclick="viewClientDetails('${client.id}')">
                <div class="flex justify-between items-center">
                    <div>
<p class="font-bold text-lg">${client.nombre || ''} ${client.apellido || ''}</p>
                        <p class="text-sm text-gray-600 mt-1">
                            <i class="fas fa-envelope mr-2 text-green-600"></i>${client.email || ''}
                        </p>
                    </div>
                    <span class="text-green-700 flex items-center">
                        <i class="fas fa-phone mr-2"></i>${client.telefono || 'N/A'}
                    </span>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error applying filters:', error);
        recentClientsList.innerHTML = `
            <div class="text-center text-red-500 p-4">
                Error al filtrar clientes: ${error.response ? error.response.data : error.message}
            </div>
        `;
    }
}

// Create client
async function createClient(clientData) {
    try {
        const response = await axios.post(`${API_BASE_URL}/clientes`, clientData);
        return response.data;
    } catch (error) {
        console.error('Error creating client:', error);
        throw error;
    }
}

// Update client
async function updateClient(id, clientData) {
    try {
        const response = await axios.put(`${API_BASE_URL}/clientes/${id}`, clientData);
        return response.data;
    } catch (error) {
        console.error(`Error updating client with ID ${id}:`, error);
        throw error;
    }
}

// Delete client
async function deleteClient(id) {
    try {
        await axios.delete(`${API_BASE_URL}/clientes/${id}`);
        return true;
    } catch (error) {
        console.error(`Error deleting client with ID ${id}:`, error);
        throw error;
    }
}

// UI Interactions

// Open client modal (for create or edit)
function openClientModal(client = null) {
    // Reset form and set mode (create or edit)
    clientForm.reset();
    
    if (client) {
        // Edit mode
        clientModalTitle.textContent = 'Editar Cliente';
        document.getElementById('client-id').value = client.id;
        document.getElementById('client-name').value = client.nombre || '';
        document.getElementById('client-lastname').value = client.apellido || '';
        document.getElementById('client-email').value = client.email || '';
        document.getElementById('client-phone').value = client.telefono || '';
        document.getElementById('client-address').value = client.direccion || '';
        submitClientBtn.textContent = 'Actualizar';
        currentClientId = client.id;
    } else {
        // Create mode
        clientModalTitle.textContent = 'Registrar Nuevo Cliente';
        document.getElementById('client-id').value = '';
        submitClientBtn.textContent = 'Registrar';
        currentClientId = null;
    }
    
    clientModal.classList.remove('hidden');
    clientModal.classList.add('flex');
}

// View client details
async function viewClientDetails(id) {
    try {
        const client = await fetchClientById(id);
        currentClientId = id;
        
        clientDetailsContent.innerHTML = `
            <div class="bg-green-50 p-4 rounded-lg">
                <div class="flex items-center mb-4">
                    <div class="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center">
                        <i class="fas fa-user text-xl"></i>
                    </div>
                    <h4 class="text-xl font-bold ml-3">${client.nombre || ''} ${client.apellido || ''}</h4>
                </div>
                
                <div class="space-y-3">
                    <div class="flex items-start">
                        <div class="w-8 text-green-600"><i class="fas fa-envelope"></i></div>
                        <div>${client.email || 'N/A'}</div>
                    </div>
                    <div class="flex items-start">
                        <div class="w-8 text-green-600"><i class="fas fa-phone"></i></div>
                        <div>${client.telefono || 'N/A'}</div>
                    </div>
                    <div class="flex items-start">
                        <div class="w-8 text-green-600"><i class="fas fa-map-marker-alt"></i></div>
                        <div>${client.direccion || 'N/A'}</div>
                    </div>
                    <div class="flex items-start">
                        <div class="w-8 text-green-600"><i class="fas fa-calendar-alt"></i></div>
                        <div>Cliente desde: ${new Date(client.fechaRegistro || Date.now()).toLocaleDateString('es-ES')}</div>
                    </div>
                </div>
            </div>
        `;
        
        // Show client details modal
        clientDetailsModal.classList.remove('hidden');
        clientDetailsModal.classList.add('flex');
        
        // If the clients modal is open, close it
        clientsModal.classList.add('hidden');
        clientsModal.classList.remove('flex');
    } catch (error) {
        alert(`Error al cargar los detalles del cliente: ${error.message}`);
    }
}

// Show delete confirmation
function showDeleteConfirmation() {
    deleteConfirmModal.classList.remove('hidden');
    deleteConfirmModal.classList.add('flex');
    clientDetailsModal.classList.add('hidden');
    clientDetailsModal.classList.remove('flex');
}

// Debounce function for search
function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

// Event Listeners

// Global function for client details view (needs to be accessible from HTML)
window.viewClientDetails = viewClientDetails;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Show default page
    showPage(currentPage);
    
    // Load recent clients
    fetchRecentClients();
});

// View all clients
viewClientsBtn.addEventListener('click', () => {
    clientsModal.classList.remove('hidden');
    clientsModal.classList.add('flex');
    fetchClients();
});

// Close clients modal
closeClientsModalBtn.addEventListener('click', () => {
    clientsModal.classList.add('hidden');
    clientsModal.classList.remove('flex');
});

// Search clients (debounced)
const debouncedSearch = debounce((event) => {
    const searchTerm = event.target.value.trim();
    fetchClients(searchTerm);
});

searchClientsInput.addEventListener('input', debouncedSearch);

// Apply filters
applyFiltersBtn.addEventListener('click', filterClients);

// Open client modal
addClientBtn.addEventListener('click', () => {
    openClientModal();
});

// Cancel client form
cancelClientBtn.addEventListener('click', () => {
    clientModal.classList.add('hidden');
    clientModal.classList.remove('flex');
});

// Submit client form (create or update)
clientForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const clientData = {
        nombre: document.getElementById('client-name').value,
        apellido: document.getElementById('client-lastname').value,
        email: document.getElementById('client-email').value,
        telefono: document.getElementById('client-phone').value,
        direccion: document.getElementById('client-address').value
    };
    
    try {
        if (currentClientId) {
            // Update existing client
            await updateClient(currentClientId, clientData);
            alert('Cliente actualizado exitosamente');
        } else {
            // Create new client
            await createClient(clientData);
            alert('Cliente registrado exitosamente');
        }
        
        clientModal.classList.add('hidden');
        clientModal.classList.remove('flex');
        
        // Refresh data
        fetchRecentClients();
        if (clientsModal.classList.contains('flex')) {
            fetchClients(searchClientsInput.value.trim());
        }
        
        clientForm.reset();
    } catch (error) {
        alert(`Error: ${error.response ? error.response.data : error.message}`);
    }
});

// Close client details modal
closeDetailsModalBtn.addEventListener('click', () => {
    clientDetailsModal.classList.add('hidden');
    clientDetailsModal.classList.remove('flex');
});

// Edit client button
editClientBtn.addEventListener('click', async () => {
    try {
        const client = await fetchClientById(currentClientId);
        clientDetailsModal.classList.add('hidden');
        clientDetailsModal.classList.remove('flex');
        openClientModal(client);
    } catch (error) {
        alert(`Error al obtener información del cliente: ${error.message}`);
    }
});

// Delete client button
deleteClientBtn.addEventListener('click', () => {
    showDeleteConfirmation();
});

// Cancel delete
cancelDeleteBtn.addEventListener('click', () => {
    deleteConfirmModal.classList.add('hidden');
    deleteConfirmModal.classList.remove('flex');
    clientDetailsModal.classList.remove('hidden');
    clientDetailsModal.classList.add('flex');
});

// Confirm delete
confirmDeleteBtn.addEventListener('click', async () => {
    try {
        await deleteClient(currentClientId);
        deleteConfirmModal.classList.add('hidden');
        deleteConfirmModal.classList.remove('flex');
        
        // Refresh data
        fetchRecentClients();
        if (clientsModal.classList.contains('flex')) {
            fetchClients(searchClientsInput.value.trim());
        }
        
        alert('Cliente eliminado exitosamente');
    } catch (error) {
        alert(`Error al eliminar cliente: ${error.message}`);
        deleteConfirmModal.classList.add('hidden');
        deleteConfirmModal.classList.remove('flex');
    }
});

// DOM Elements - Employees
const employeesListModal = document.getElementById('employees-list-modal');
const employeesModal = document.getElementById('employees-modal');
const viewEmployeesBtn = document.getElementById('view-employees-btn');
const closeEmployeesModalBtn = document.getElementById('close-employees-modal');
const employeeModal = document.getElementById('employee-modal');
const employeeModalTitle = document.getElementById('employee-modal-title');
const addEmployeeBtn = document.getElementById('add-employee');
const mobileAddEmployeeBtn = document.getElementById('mobile-add-employee');
const cancelEmployeeBtn = document.getElementById('cancel-employee');
const employeeForm = document.getElementById('employee-form');
const submitEmployeeBtn = document.getElementById('submit-employee');
const searchEmployeesInput = document.getElementById('employees-search-modal');
const recentEmployeesList = document.getElementById('recent-employees');
const employeeDetailsModal = document.getElementById('employee-details-modal');
const closeEmpDetailsModalBtn = document.getElementById('close-emp-details-modal');
const employeeDetailsContent = document.getElementById('employee-details-content');
const editEmployeeBtn = document.getElementById('edit-employee');
const deleteEmployeeBtn = document.getElementById('delete-employee');
const deleteEmpConfirmModal = document.getElementById('delete-emp-confirm-modal');
const cancelEmpDeleteBtn = document.getElementById('cancel-emp-delete');
const confirmEmpDeleteBtn = document.getElementById('confirm-emp-delete');
const employeeFilterInputs = {
name: document.getElementById('filter-emp-name'),
position: document.getElementById('filter-emp-position')
};

let currentEmployeeId = null;

// CRUD Operations for Employees

// Fetch all employees
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
    return employees;
}

employeesListModal.innerHTML = employees.map(employee => {
    const highlightTerm = (text) => {
        if (!searchTerm) return text;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
    };

    return `
        <div class="employee-card p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all animate-fade-in cursor-pointer" 
            data-employee-id="${employee.id_empleado}" onclick="viewEmployeeDetails(${employee.id_empleado})">
            <div class="flex justify-between items-center">
                <div>
                    <p class="font-bold text-lg">
                        ${highlightTerm(employee.nombre || '')} ${highlightTerm(employee.apellido || '')}
                    </p>
                </div>
                <div class="text-blue-700">
                    <div class="flex items-center mb-1">
                        <i class="fas fa-id-badge mr-2"></i>${highlightTerm(employee.puesto || 'N/A')}
                    </div>
                    <div class="flex items-center text-sm">
                        <i class="fas fa-money-bill-wave mr-2"></i>$${employee.salario || 'N/A'}
                    </div>
                </div>
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

// Fetch employee by ID
async function fetchEmployeeById(id) {
try {
const response = await axios.get(`${API_BASE_URL}/empleados/${id}`);
return response.data;
} catch (error) {
console.error(`Error fetching employee with ID ${id}:`, error);
throw error;
}
}

// Fetch Recent Employees for Dashboard
async function fetchRecentEmployees() {
try {
const response = await axios.get(`${API_BASE_URL}/empleados/recientes`);
const recentEmployees = response.data;

if (recentEmployees.length === 0) {
    recentEmployeesList.innerHTML = `
        <div class="text-center text-gray-500 p-4">
            No hay empleados registrados.
        </div>
    `;
    return;
}

recentEmployeesList.innerHTML = recentEmployees.map(employee => `
    <div class="employee-card p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
        data-employee-id="${employee.id_empleado}" onclick="viewEmployeeDetails(${employee.id_empleado})">
        <div class="flex justify-between items-center">
            <div>
                <p class="font-bold text-lg">${employee.nombre || ''} ${employee.apellido || ''}</p>
            </div>
            <div class="text-blue-700">
                <div class="flex items-center mb-1">
                    <i class="fas fa-id-badge mr-2"></i>${employee.puesto || 'N/A'}
                </div>
                <div class="flex items-center text-sm">
                    <i class="fas fa-money-bill-wave mr-2"></i>$${employee.salario || 'N/A'}
                </div>
            </div>
        </div>
    </div>
`).join('');
} catch (error) {
console.error('Error fetching recent employees:', error);
// Si falla la ruta específica, intentamos con todos los empleados
try {
    const allEmployees = await fetchEmployees();
    const recentEmployees = allEmployees.slice(0, 5);
    
    if (recentEmployees.length === 0) {
        recentEmployeesList.innerHTML = `
            <div class="text-center text-gray-500 p-4">
                No hay empleados registrados.
            </div>
        `;
        return;
    }
    
    recentEmployeesList.innerHTML = recentEmployees.map(employee => `
        <div class="employee-card p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
            data-employee-id="${employee.id_empleado}" onclick="viewEmployeeDetails(${employee.id_empleado})">
            <div class="flex justify-between items-center">
                <div>
                    <p class="font-bold text-lg">${employee.nombre || ''} ${employee.apellido || ''}</p>
                </div>
                <div class="text-blue-700">
                    <div class="flex items-center mb-1">
                        <i class="fas fa-id-badge mr-2"></i>${employee.puesto || 'N/A'}
                    </div>
                    <div class="flex items-center text-sm">
                        <i class="fas fa-money-bill-wave mr-2"></i>$${employee.salario || 'N/A'}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
} catch (innerError) {
    recentEmployeesList.innerHTML = `
        <div class="text-center text-red-500 p-4">
            Error al cargar empleados recientes.
        </div>
    `;
}
}
}

// Filter employees
async function filterEmployees() {
const filters = {
nombre: employeeFilterInputs.name.value.trim(),
puesto: employeeFilterInputs.position.value.trim()
};

try {
const url = new URL(`${API_BASE_URL}/empleados/filtrar`);

// Add filter parameters
for (const [key, value] of Object.entries(filters)) {
    if (value) {
        url.searchParams.append(key, value);
    }
}

const response = await axios.get(url.toString());
const employees = response.data;

if (employees.length === 0) {
    recentEmployeesList.innerHTML = `
        <div class="text-center text-gray-500 p-4 animate-fade-in">
            No se encontraron empleados con los filtros aplicados.
        </div>
    `;
    return;
}

recentEmployeesList.innerHTML = employees.map(employee => `
    <div class="employee-card p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
        data-employee-id="${employee.id_empleado}" onclick="viewEmployeeDetails(${employee.id_empleado})">
        <div class="flex justify-between items-center">
            <div>
                <p class="font-bold text-lg">${employee.nombre || ''} ${employee.apellido || ''}</p>
            </div>
            <div class="text-blue-700">
                <div class="flex items-center mb-1">
                    <i class="fas fa-id-badge mr-2"></i>${employee.puesto || 'N/A'}
                </div>
                <div class="flex items-center text-sm">
                    <i class="fas fa-money-bill-wave mr-2"></i>$${employee.salario || 'N/A'}
                </div>
            </div>
        </div>
    </div>
`).join('');

} catch (error) {
console.error('Error applying filters:', error);
recentEmployeesList.innerHTML = `
    <div class="text-center text-red-500 p-4">
        Error al filtrar empleados: ${error.response ? error.response.data : error.message}
    </div>
`;
}
}

// Create employee
async function createEmployee(employeeData) {
try {
const response = await axios.post(`${API_BASE_URL}/empleados`, employeeData);
return response.data;
} catch (error) {
console.error('Error creating employee:', error);
throw error;
}
}

// Update employee
async function updateEmployee(id, employeeData) {
try {
const response = await axios.put(`${API_BASE_URL}/empleados/${id}`, employeeData);
return response.data;
} catch (error) {
console.error(`Error updating employee with ID ${id}:`, error);
throw error;
}
}

// Delete employee
async function deleteEmployee(id) {
try {
await axios.delete(`${API_BASE_URL}/empleados/${id}`);
return true;
} catch (error) {
console.error(`Error deleting employee with ID ${id}:`, error);
throw error;
}
}

// UI Interactions for Employees

// Open employee modal (for create or edit)
function openEmployeeModal(employee = null) {
// Reset form and set mode (create or edit)
employeeForm.reset();

if (employee) {
// Edit mode
employeeModalTitle.textContent = 'Editar Empleado';
document.getElementById('employee-id').value = employee.id_empleado;
document.getElementById('employee-name').value = employee.nombre || '';
document.getElementById('employee-lastname').value = employee.apellido || '';
document.getElementById('employee-position').value = employee.puesto || '';
document.getElementById('employee-salary').value = employee.salario || '';
submitEmployeeBtn.textContent = 'Actualizar';
currentEmployeeId = employee.id_empleado;
} else {
// Create mode
employeeModalTitle.textContent = 'Registrar Nuevo Empleado';
document.getElementById('employee-id').value = '';
submitEmployeeBtn.textContent = 'Registrar';
currentEmployeeId = null;
}

employeeModal.classList.remove('hidden');
employeeModal.classList.add('flex');
}

// View employee details
async function viewEmployeeDetails(id) {
try {
const employee = await fetchEmployeeById(id);
currentEmployeeId = id;

employeeDetailsContent.innerHTML = `
    <div class="bg-blue-50 p-4 rounded-lg">
        <div class="flex items-center mb-4">
            <div class="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center">
                <i class="fas fa-user-tie text-xl"></i>
            </div>
            <h4 class="text-xl font-bold ml-3">${employee.nombre || ''} ${employee.apellido || ''}</h4>
        </div>
        
        <div class="space-y-3">
            <div class="flex items-start">
                <div class="w-8 text-blue-600"><i class="fas fa-id-badge"></i></div>
                <div>${employee.puesto || 'N/A'}</div>
            </div>
            <div class="flex items-start">
                <div class="w-8 text-blue-600"><i class="fas fa-money-bill-wave"></i></div>
                <div>$${employee.salario || 'N/A'}</div>
            </div>
        </div>
    </div>
`;

// Show employee details modal
employeeDetailsModal.classList.remove('hidden');
employeeDetailsModal.classList.add('flex');

// If the employees modal is open, close it
employeesModal.classList.add('hidden');
employeesModal.classList.remove('flex');
} catch (error) {
alert(`Error al cargar los detalles del empleado: ${error.message}`);
}
}

// Show delete confirmation for employee
function showEmployeeDeleteConfirmation() {
deleteEmpConfirmModal.classList.remove('hidden');
deleteEmpConfirmModal.classList.add('flex');
employeeDetailsModal.classList.add('hidden');
employeeDetailsModal.classList.remove('flex');
}

// Event Listeners for Employee Management

// Global function for employee details view
window.viewEmployeeDetails = viewEmployeeDetails;

// Load recent employees on page load
document.addEventListener('DOMContentLoaded', () => {
fetchRecentEmployees();
});

// View all employees
viewEmployeesBtn.addEventListener('click', () => {
employeesModal.classList.remove('hidden');
employeesModal.classList.add('flex');
fetchEmployees();
});

// Close employees modal
closeEmployeesModalBtn.addEventListener('click', () => {
employeesModal.classList.add('hidden');
employeesModal.classList.remove('flex');
});

// Search employees (debounced)
const debouncedEmpSearch = debounce((event) => {
const searchTerm = event.target.value.trim();
fetchEmployees(searchTerm);
});

searchEmployeesInput.addEventListener('input', debouncedEmpSearch);

// Open employee modal
addEmployeeBtn.addEventListener('click', () => {
openEmployeeModal();
});

mobileAddEmployeeBtn.addEventListener('click', () => {
openEmployeeModal();
});

// Cancel employee form
cancelEmployeeBtn.addEventListener('click', () => {
employeeModal.classList.add('hidden');
employeeModal.classList.remove('flex');
});

// Submit employee form (create or update)
employeeForm.addEventListener('submit', async (event) => {
event.preventDefault();

const employeeData = {
nombre: document.getElementById('employee-name').value,
apellido: document.getElementById('employee-lastname').value,
puesto: document.getElementById('employee-position').value,
salario: document.getElementById('employee-salary').value
};

try {
if (currentEmployeeId) {
    // Update existing employee
    await updateEmployee(currentEmployeeId, employeeData);
    alert('Empleado actualizado exitosamente');
} else {
    // Create new employee
    await createEmployee(employeeData);
    alert('Empleado registrado exitosamente');
}

employeeModal.classList.add('hidden');
employeeModal.classList.remove('flex');

// Refresh data
fetchRecentEmployees();
if (employeesModal.classList.contains('flex')) {
    fetchEmployees(searchEmployeesInput.value.trim());
}

employeeForm.reset();
} catch (error) {
alert(`Error: ${error.response ? error.response.data : error.message}`);
}
});

// Close employee details modal
closeEmpDetailsModalBtn.addEventListener('click', () => {
employeeDetailsModal.classList.add('hidden');
employeeDetailsModal.classList.remove('flex');
});

// Edit employee button
editEmployeeBtn.addEventListener('click', async () => {
try {
const employee = await fetchEmployeeById(currentEmployeeId);
employeeDetailsModal.classList.add('hidden');
employeeDetailsModal.classList.remove('flex');
openEmployeeModal(employee);
} catch (error) {
alert(`Error al obtener información del empleado: ${error.message}`);
}
});

// Delete employee button
deleteEmployeeBtn.addEventListener('click', () => {
showEmployeeDeleteConfirmation();
});

// Cancel employee delete
cancelEmpDeleteBtn.addEventListener('click', () => {
deleteEmpConfirmModal.classList.add('hidden');
deleteEmpConfirmModal.classList.remove('flex');
employeeDetailsModal.classList.remove('hidden');
employeeDetailsModal.classList.add('flex');
});

// Confirm employee delete
confirmEmpDeleteBtn.addEventListener('click', async () => {
try {
await deleteEmployee(currentEmployeeId);
deleteEmpConfirmModal.classList.add('hidden');
deleteEmpConfirmModal.classList.remove('flex');

// Refresh data
fetchRecentEmployees();
if (employeesModal.classList.contains('flex')) {
    fetchEmployees(searchEmployeesInput.value.trim());
}

alert('Empleado eliminado exitosamente');
} catch (error) {
alert(`Error al eliminar empleado: ${error.message}`);
deleteEmpConfirmModal.classList.add('hidden');
deleteEmpConfirmModal.classList.remove('flex');
}
});