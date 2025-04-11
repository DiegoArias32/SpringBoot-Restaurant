// API base URL
const API_BASE_URL = 'http://localhost:8080/api';
        
// DOM Elements - Navigation
const sidenavLinks = document.querySelectorAll('.sidenav-link');
const sections = document.querySelectorAll('.section');
const toggleSidenavBtn = document.getElementById('toggleSidenav');
const sidenav = document.getElementById('sidenav');

// DOM Elements - Stats
const clientCount = document.getElementById('clientCount');
const dishCount = document.getElementById('dishCount');
const employeeCount = document.getElementById('employeeCount');
const orderCount = document.getElementById('orderCount');

// DOM Elements - Alerts
const successAlert = document.getElementById('successAlert');
const errorAlert = document.getElementById('errorAlert');
const loadingSpinner = document.getElementById('loadingSpinner');

// DOM Elements - Tables
const recentOrdersTableBody = document.getElementById('recentOrdersTableBody');
const employeeTableBody = document.getElementById('employeeTableBody');
const dishTableBody = document.getElementById('dishTableBody');
const dishGrid = document.getElementById('dishGrid');
const clientTableBody = document.getElementById('clientTableBody');
const orderTableBody = document.getElementById('orderTableBody');

// DOM Elements - Modals
const employeeModal = document.getElementById('employeeModal');
const dishModal = document.getElementById('dishModal');
const clientModal = document.getElementById('clientModal');
const orderModal = document.getElementById('orderModal');
const orderDetailModal = document.getElementById('orderDetailModal');
const confirmationModal = document.getElementById('confirmationModal');

// DOM Elements - Forms
const employeeForm = document.getElementById('employeeForm');
const dishForm = document.getElementById('dishForm');
const clientForm = document.getElementById('clientForm');
const orderForm = document.getElementById('orderForm');

// DOM Elements - Search
const employeeSearchInput = document.getElementById('employeeSearchInput');
const employeeSearchBtn = document.getElementById('employeeSearchBtn');
const dishSearchInput = document.getElementById('dishSearchInput');
const dishSearchBtn = document.getElementById('dishSearchBtn');
const clientSearchInput = document.getElementById('clientSearchInput');
const clientSearchBtn = document.getElementById('clientSearchBtn');
const orderSearchInput = document.getElementById('orderSearchInput');
const orderSearchBtn = document.getElementById('orderSearchBtn');

// DOM Elements - View Toggles
const tableViewBtn = document.getElementById('tableViewBtn');
const gridViewBtn = document.getElementById('gridViewBtn');
const dishTableView = document.getElementById('dishTableView');
const dishGridView = document.getElementById('dishGridView');

// Variables to track current operations
let currentDeleteId = null;
let currentDeleteType = null;
let currentOrderId = null;

// Helper function to create DOM elements
function createElement(tag, properties = {}) {
    const element = document.createElement(tag);
    
    // Set properties
    if (properties.className) {
        element.className = properties.className;
    }
    
    if (properties.id) {
        element.id = properties.id;
    }
    
    if (properties.textContent) {
        element.textContent = properties.textContent;
    }
    
    if (properties.innerText) {
        element.innerText = properties.innerText;
    }
    
    if (properties.innerHTML) {
        element.innerHTML = properties.innerHTML;
    }
    
    if (properties.attributes) {
        for (const [key, value] of Object.entries(properties.attributes)) {
            element.setAttribute(key, value);
        }
    }
    
    if (properties.dataset) {
        for (const [key, value] of Object.entries(properties.dataset)) {
            element.dataset[key] = value;
        }
    }
    
    if (properties.style) {
        for (const [key, value] of Object.entries(properties.style)) {
            element.style[key] = value;
        }
    }
    
    if (properties.events) {
        for (const [event, handler] of Object.entries(properties.events)) {
            element.addEventListener(event, handler);
        }
    }
    
    if (properties.children) {
        properties.children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });
    }
    
    return element;
}

// Helper function to create table cells
function createTableCell(content, className) {
    const cell = document.createElement('td');
    if (className) {
        cell.className = className;
    }
    
    if (typeof content === 'string' || typeof content === 'number') {
        cell.textContent = content;
    } else {
        cell.appendChild(content);
    }
    
    return cell;
}

// Helper function to create buttons
function createButton(icon, className, clickHandler, dataset = {}) {
    const button = createElement('button', {
        className: className,
        dataset: dataset,
        events: {
            click: clickHandler
        }
    });
    
    button.appendChild(createElement('i', { className: icon }));
    
    return button;
}

// Helper function to create a no data row for tables
function createNoDataRow(message, colSpan) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.textContent = message;
    cell.colSpan = colSpan;
    cell.style.textAlign = 'center';
    row.appendChild(cell);
    return row;
}

// Event Listeners - Navigation
document.addEventListener('DOMContentLoaded', () => {
    // Initialize data
    fetchDashboardData();
    
    // Event listeners for navigation
    sidenavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.getAttribute('data-section');
            activateSection(targetSection);
            
            // Load section data if needed
            if (targetSection === 'staff') {
                fetchEmployees();
            } else if (targetSection === 'menu') {
                fetchDishes();
            } else if (targetSection === 'clients') {
                fetchClients();
            } else if (targetSection === 'orders') {
                fetchOrders();
            }
            
            // Close sidenav on mobile
            if (window.innerWidth < 992) {
                sidenav.classList.remove('active');
            }
        });
    });
    
    // Toggle sidenav on mobile
    toggleSidenavBtn.addEventListener('click', () => {
        sidenav.classList.toggle('active');
    });
    
    // Add Employee Button
    document.getElementById('addEmployeeBtn').addEventListener('click', showAddEmployeeModal);
    
    // Add Dish Button
    document.getElementById('addDishBtn').addEventListener('click', showAddDishModal);
    
    // Add Client Button
    document.getElementById('addClientBtn').addEventListener('click', showAddClientModal);
    
    // Add Order Button
    document.getElementById('addOrderBtn').addEventListener('click', showAddOrderModal);
    
    // Close Modals
    document.getElementById('closeEmployeeModal').addEventListener('click', closeEmployeeModal);
    document.getElementById('cancelEmployeeBtn').addEventListener('click', closeEmployeeModal);
    document.getElementById('closeDishModal').addEventListener('click', closeDishModal);
    document.getElementById('cancelDishBtn').addEventListener('click', closeDishModal);
    document.getElementById('closeClientModal').addEventListener('click', closeClientModal);
    document.getElementById('cancelClientBtn').addEventListener('click', closeClientModal);
    document.getElementById('closeOrderModal').addEventListener('click', closeOrderModal);
    document.getElementById('cancelOrderBtn').addEventListener('click', closeOrderModal);
    document.getElementById('closeOrderDetailModal').addEventListener('click', closeOrderDetailModal);
    document.getElementById('closeOrderDetailBtn').addEventListener('click', closeOrderDetailModal);
    document.getElementById('closeConfirmModal').addEventListener('click', closeConfirmModal);
    document.getElementById('cancelDeleteBtn').addEventListener('click', closeConfirmModal);
    
    // Form Submissions
    employeeForm.addEventListener('submit', handleEmployeeFormSubmit);
    dishForm.addEventListener('submit', handleDishFormSubmit);
    clientForm.addEventListener('submit', handleClientFormSubmit);
    orderForm.addEventListener('submit', handleOrderFormSubmit);
    
    // Search Functionality
    employeeSearchBtn.addEventListener('click', handleEmployeeSearch);
    dishSearchBtn.addEventListener('click', handleDishSearch);
    clientSearchBtn.addEventListener('click', handleClientSearch);
    orderSearchBtn.addEventListener('click', handleOrderSearch);
    
    employeeSearchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            handleEmployeeSearch();
        }
    });
    
    dishSearchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            handleDishSearch();
        }
    });
    
    clientSearchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            handleClientSearch();
        }
    });
    
    orderSearchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            handleOrderSearch();
        }
    });
    
    // View Toggles
    tableViewBtn.addEventListener('click', showTableView);
    gridViewBtn.addEventListener('click', showGridView);
    
    // Delete Confirmation
    document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDelete);
    
    // Add Order Item
    document.getElementById('addOrderItemBtn').addEventListener('click', addOrderItemRow);
});

// Functions - Navigation
function activateSection(sectionId) {
    // Update active link
    sidenavLinks.forEach(link => {
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Show active section
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });
}

// Functions - Dashboard
async function fetchDashboardData() {
    showLoading();
    try {
        // Fetch counts for each entity
        const [clientsResponse, dishesResponse, employeesResponse, ordersResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/clients`),
            fetch(`${API_BASE_URL}/menu`),
            fetch(`${API_BASE_URL}/employees`),
            fetch(`${API_BASE_URL}/orders`)
        ]);
        
        const clients = await clientsResponse.json();
        const dishes = await dishesResponse.json();
        const employees = await employeesResponse.json();
        const orders = await ordersResponse.json();
        
        // Update dashboard counts
        clientCount.textContent = Array.isArray(clients) ? clients.length : 0;
        dishCount.textContent = Array.isArray(dishes) ? dishes.length : 0;
        employeeCount.textContent = Array.isArray(employees) ? employees.length : 0;
        orderCount.textContent = Array.isArray(orders) ? orders.length : 0;
        
        // Make sure orders is an array before using slice
        if (!Array.isArray(orders)) {
            console.error('Orders data is not an array:', orders);
            recentOrdersTableBody.innerHTML = '';
            recentOrdersTableBody.appendChild(createNoDataRow('No orders found or invalid data format', 6));
            return;
        }
        
        // Display recent orders (limit to 5)
        const recentOrders = orders.slice(0, 5);
        
        // Get customer names for each order
        const customerIds = recentOrders.map(order => order.idCustomer);
        const clientsById = {};
        
        if (Array.isArray(clients)) {
            clients.forEach(client => {
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
    } finally {
        hideLoading();
    }
}

// Create recent order table row
function createRecentOrderRow(order, clientsById) {
    const row = document.createElement('tr');
    const orderDate = order.date ? new Date(order.date) : new Date();
    
    // Order ID column
    row.appendChild(createTableCell(`#${order.idOrder}`));
    
    // Customer column
    row.appendChild(createTableCell(clientsById[order.idCustomer] || 'Unknown'));
    
    // Date column
    row.appendChild(createTableCell(orderDate.toLocaleDateString()));
    
    // Status column
    const statusCell = createTableCell('', '');
    const statusSpan = createElement('span', {
        className: `status-label status-${(order.status || 'pending').toLowerCase()}`,
        textContent: order.status || 'Pending'
    });
    statusCell.appendChild(statusSpan);
    row.appendChild(statusCell);
    
    // Total column (placeholder value)
    row.appendChild(createTableCell('$120.00'));
    
    // Actions column
    const actionsCell = createTableCell('', 'table-actions');
    const viewButton = createButton('fas fa-eye', 'btn btn-sm btn-primary view-order-btn', 
        () => showOrderDetails(order.idOrder), { id: order.idOrder });
    actionsCell.appendChild(viewButton);
    row.appendChild(actionsCell);
    
    return row;
}

// Functions - Employees
async function fetchEmployees() {
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/employees`);
        if (!response.ok) {
            throw new Error('Failed to fetch employees');
        }
        const employees = await response.json();
        displayEmployees(employees);
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

function displayEmployees(employees) {
    employeeTableBody.innerHTML = '';
    
    if (employees.length === 0) {
        employeeTableBody.appendChild(createNoDataRow('No employees found', 5));
        return;
    }
    
    employees.forEach(employee => {
        const row = createEmployeeRow(employee);
        employeeTableBody.appendChild(row);
    });
}

function createEmployeeRow(employee) {
    const row = document.createElement('tr');
    
    // Employee ID column
    row.appendChild(createTableCell(`#${employee.idEmployee}`));
    
    // Name column
    row.appendChild(createTableCell(`${employee.firstName} ${employee.lastName}`));
    
    // Position column
    row.appendChild(createTableCell(employee.position));
    
    // Salary column
    row.appendChild(createTableCell(employee.salary.toFixed(2)));
    
    // Actions column
    const actionsCell = createTableCell('', 'table-actions');
    
    const editButton = createButton('fas fa-edit', 'btn btn-sm btn-warning edit-employee-btn', 
        () => showEditEmployeeModal(employee.idEmployee), { id: employee.idEmployee });
    
    const deleteButton = createButton('fas fa-trash', 'btn btn-sm btn-danger delete-employee-btn', 
        () => showDeleteConfirmation('employee', employee.idEmployee), { id: employee.idEmployee });
    
    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);
    row.appendChild(actionsCell);
    
    return row;
}

function showAddEmployeeModal() {
    document.getElementById('employeeModalTitle').textContent = 'Add New Employee';
    employeeForm.reset();
    document.getElementById('employeeId').value = '';
    employeeModal.classList.add('active');
}

async function showEditEmployeeModal(id) {
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/employees/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch employee details');
        }
        const employee = await response.json();
        
        document.getElementById('employeeModalTitle').textContent = 'Edit Employee';
        document.getElementById('employeeId').value = employee.idEmployee;
        document.getElementById('firstName').value = employee.firstName;
        document.getElementById('lastName').value = employee.lastName;
        document.getElementById('position').value = employee.position;
        document.getElementById('salary').value = employee.salary;
        
        employeeModal.classList.add('active');
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

function closeEmployeeModal() {
    employeeModal.classList.remove('active');
}

async function handleEmployeeFormSubmit(event) {
    event.preventDefault();
    
    const employeeData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        position: document.getElementById('position').value,
        salary: parseFloat(document.getElementById('salary').value)
    };
    
    const id = document.getElementById('employeeId').value;
    const isEditing = id !== '';
    
    showLoading();
    try {
        let response;
        
        if (isEditing) {
            // Update existing employee
            employeeData.idEmployee = parseInt(id);
            response = await fetch(`${API_BASE_URL}/employees/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(employeeData)
            });
        } else {
            // Create new employee
            response = await fetch(`${API_BASE_URL}/employees`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(employeeData)
            });
        }
        
        if (!response.ok) {
            throw new Error(`Failed to ${isEditing ? 'update' : 'create'} employee`);
        }
        
        const result = await response.text();
        showSuccess(result);
        closeEmployeeModal();
        fetchEmployees();
        fetchDashboardData(); // Update dashboard counts
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

async function handleEmployeeSearch() {
    const searchTerm = employeeSearchInput.value.trim();
    
    if (searchTerm === '') {
        fetchEmployees();
        return;
    }
    
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/employees/search?term=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) {
            throw new Error('Failed to search employees');
        }
        const employees = await response.json();
        displayEmployees(employees);
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

// Functions - Dishes
async function fetchDishes() {
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/menu`);
        if (!response.ok) {
            throw new Error('Failed to fetch dishes');
        }
        const dishes = await response.json();
        displayDishes(dishes);
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

function displayDishes(dishes) {
    // Clear previous data
    dishTableBody.innerHTML = '';
    dishGrid.innerHTML = '';
    
    if (dishes.length === 0) {
        dishTableBody.appendChild(createNoDataRow('No dishes found', 5));
        return;
    }
    
    // Populate table view
    dishes.forEach(dish => {
        const row = createDishTableRow(dish);
        dishTableBody.appendChild(row);
    });
    
    // Populate grid view
    dishes.forEach(dish => {
        const gridItem = createDishGridItem(dish);
        dishGrid.appendChild(gridItem);
    });
}

function createDishTableRow(dish) {
    const row = document.createElement('tr');
    
    // Dish ID column
    row.appendChild(createTableCell(`#${dish.idDish}`));
    
    // Name column
    row.appendChild(createTableCell(dish.name));
    
    // Description column
    row.appendChild(createTableCell(dish.description));
    
    // Price column
    row.appendChild(createTableCell(dish.price.toFixed(2)));
    
    // Actions column
    const actionsCell = createTableCell('', 'table-actions');
    
    const editButton = createButton('fas fa-edit', 'btn btn-sm btn-warning edit-dish-btn', 
        () => showEditDishModal(dish.idDish), { id: dish.idDish });
    
    const deleteButton = createButton('fas fa-trash', 'btn btn-sm btn-danger delete-dish-btn', 
        () => showDeleteConfirmation('dish', dish.idDish), { id: dish.idDish });
    
    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);
    row.appendChild(actionsCell);
    
    return row;
}

function createDishGridItem(dish) {
    const gridItem = createElement('div', {
        className: 'menu-item'
    });
    
    // Header with dish name
    const headerDiv = createElement('div', {
        className: 'menu-item-header'
    });
    
    const nameHeading = createElement('h3', {
        className: 'menu-item-name',
        textContent: dish.name
    });
    
    headerDiv.appendChild(nameHeading);
    gridItem.appendChild(headerDiv);
    
    // Content with description, price, and actions
    const contentDiv = createElement('div', {
        className: 'menu-item-content'
    });
    
    const descriptionPara = createElement('p', {
        className: 'menu-item-description',
        textContent: dish.description
    });
    
    const pricePara = createElement('p', {
        className: 'menu-item-price',
        textContent: dish.price.toFixed(2)
    });
    
    const actionsDiv = createElement('div', {
        className: 'menu-item-actions'
    });
    
    // Edit button with text
    const editButton = createElement('button', {
        className: 'btn btn-sm btn-warning edit-dish-btn',
        dataset: { id: dish.idDish },
        events: {
            click: () => showEditDishModal(dish.idDish)
        }
    });
    
    editButton.innerHTML = '<i class="fas fa-edit"></i> Edit';
    
    // Delete button with text
    const deleteButton = createElement('button', {
        className: 'btn btn-sm btn-danger delete-dish-btn',
        dataset: { id: dish.idDish },
        events: {
            click: () => showDeleteConfirmation('dish', dish.idDish)
        }
    });
    
    deleteButton.innerHTML = '<i class="fas fa-trash"></i> Delete';
    
    actionsDiv.appendChild(editButton);
    actionsDiv.appendChild(deleteButton);
    
    contentDiv.appendChild(descriptionPara);
    contentDiv.appendChild(pricePara);
    contentDiv.appendChild(actionsDiv);
    
    gridItem.appendChild(contentDiv);
    
    return gridItem;
}

function showTableView() {
    tableViewBtn.classList.add('active');
    gridViewBtn.classList.remove('active');
    dishTableView.style.display = 'block';
    dishGridView.style.display = 'none';
}

function showGridView() {
    gridViewBtn.classList.add('active');
    tableViewBtn.classList.remove('active');
    dishGridView.style.display = 'block';
    dishTableView.style.display = 'none';
}

function showAddDishModal() {
    document.getElementById('dishModalTitle').textContent = 'Add New Dish';
    dishForm.reset();
    document.getElementById('dishId').value = '';
    dishModal.classList.add('active');
}

async function showEditDishModal(id) {
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/menu/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch dish details');
        }
        const dish = await response.json();
        
        document.getElementById('dishModalTitle').textContent = 'Edit Dish';
        document.getElementById('dishId').value = dish.idDish;
        document.getElementById('dishName').value = dish.name;
        document.getElementById('dishDescription').value = dish.description;
        document.getElementById('dishPrice').value = dish.price;
        
        dishModal.classList.add('active');
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

function closeDishModal() {
    dishModal.classList.remove('active');
}

async function handleDishFormSubmit(event) {
    event.preventDefault();
    
    const dishData = {
        name: document.getElementById('dishName').value,
        description: document.getElementById('dishDescription').value,
        price: parseFloat(document.getElementById('dishPrice').value)
    };
    
    const id = document.getElementById('dishId').value;
    const isEditing = id !== '';
    
    showLoading();
    try {
        let response;
        
        if (isEditing) {
            // Update existing dish
            dishData.idDish = parseInt(id);
            response = await fetch(`${API_BASE_URL}/menu/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dishData)
            });
        } else {
            // Create new dish
            response = await fetch(`${API_BASE_URL}/menu`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dishData)
            });
        }
        
        if (!response.ok) {
            throw new Error(`Failed to ${isEditing ? 'update' : 'create'} dish`);
        }
        
        const result = await response.text();
        showSuccess(result);
        closeDishModal();
        fetchDishes();
        fetchDashboardData(); // Update dashboard counts
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

async function handleDishSearch() {
    const searchTerm = dishSearchInput.value.trim();
    
    if (searchTerm === '') {
        fetchDishes();
        return;
    }
    
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/menu/search?term=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) {
            throw new Error('Failed to search dishes');
        }
        const dishes = await response.json();
        displayDishes(dishes);
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

// Functions - Clients
async function fetchClients() {
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/clients`);
        if (!response.ok) {
            throw new Error('Failed to fetch clients');
        }
        const clients = await response.json();
        displayClients(clients);
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

function displayClients(clients) {
    clientTableBody.innerHTML = '';
    
    if (clients.length === 0) {
        clientTableBody.appendChild(createNoDataRow('No clients found', 5));
        return;
    }
    
    clients.forEach(client => {
        const row = createClientRow(client);
        clientTableBody.appendChild(row);
    });
}

function createClientRow(client) {
    const row = document.createElement('tr');
    
    // Client ID column
    row.appendChild(createTableCell(`#${client.idClient}`));
    
    // Name column
    row.appendChild(createTableCell(`${client.firstName} ${client.lastName}`));
    
    // Email column
    row.appendChild(createTableCell(client.email || '-'));
    
    // Phone column
    row.appendChild(createTableCell(client.phone || '-'));
    
    // Actions column
    const actionsCell = createTableCell('', 'table-actions');
    
    const editButton = createButton('fas fa-edit', 'btn btn-sm btn-warning edit-client-btn', 
        () => showEditClientModal(client.idClient), { id: client.idClient });
    
    const deleteButton = createButton('fas fa-trash', 'btn btn-sm btn-danger delete-client-btn', 
        () => showDeleteConfirmation('client', client.idClient), { id: client.idClient });
    
    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);
    row.appendChild(actionsCell);
    
    return row;
}

function showAddClientModal() {
    document.getElementById('clientModalTitle').textContent = 'Add New Client';
    clientForm.reset();
    document.getElementById('clientId').value = '';
    clientModal.classList.add('active');
}

async function showEditClientModal(id) {
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/clients/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch client details');
        }
        const client = await response.json();
        
        document.getElementById('clientModalTitle').textContent = 'Edit Client';
        document.getElementById('clientId').value = client.idClient;
        document.getElementById('clientFirstName').value = client.firstName;
        document.getElementById('clientLastName').value = client.lastName;
        document.getElementById('clientEmail').value = client.email || '';
        document.getElementById('clientPhone').value = client.phone || '';
        
        clientModal.classList.add('active');
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

function closeClientModal() {
    clientModal.classList.remove('active');
}

async function handleClientFormSubmit(event) {
    event.preventDefault();
    
    const clientData = {
        firstName: document.getElementById('clientFirstName').value,
        lastName: document.getElementById('clientLastName').value,
        email: document.getElementById('clientEmail').value,
        phone: document.getElementById('clientPhone').value
    };
    
    const id = document.getElementById('clientId').value;
    const isEditing = id !== '';
    
    showLoading();
    try {
        let response;
        
        if (isEditing) {
            // Update existing client
            clientData.idClient = parseInt(id);
            response = await fetch(`${API_BASE_URL}/clients/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(clientData)
            });
        } else {
            // Create new client
            response = await fetch(`${API_BASE_URL}/clients`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(clientData)
            });
        }
        
        if (!response.ok) {
            throw new Error(`Failed to ${isEditing ? 'update' : 'create'} client`);
        }
        
        const result = await response.text();
        showSuccess(result);
        closeClientModal();
        fetchClients();
        fetchDashboardData(); // Update dashboard counts
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

async function handleClientSearch() {
    const searchTerm = clientSearchInput.value.trim();
    
    if (searchTerm === '') {
        fetchClients();
        return;
    }
    
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/clients/search?term=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) {
            throw new Error('Failed to search clients');
        }
        const clients = await response.json();
        displayClients(clients);
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

// Functions - Orders
async function fetchOrders() {
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/orders`);
        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }
        const orders = await response.json();
        
        // Fetch clients to get names
        const clientsResponse = await fetch(`${API_BASE_URL}/clients`);
        const clients = await clientsResponse.json();
        
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
    } finally {
        hideLoading();
    }
}

function displayOrders(orders, clientMap) {
    orderTableBody.innerHTML = '';
    
    if (orders.length === 0) {
        orderTableBody.appendChild(createNoDataRow('No orders found', 5));
        return;
    }
    
    orders.forEach(order => {
        const row = createOrderRow(order, clientMap);
        orderTableBody.appendChild(row);
    });
}

function createOrderRow(order, clientMap) {
    const row = document.createElement('tr');
    const orderDate = new Date(order.date);
    
    // Order ID column
    row.appendChild(createTableCell(`#${order.idOrder}`));
    
    // Customer column
    row.appendChild(createTableCell(clientMap[order.idCustomer] || 'Unknown'));
    
    // Date column
    row.appendChild(createTableCell(orderDate.toLocaleDateString()));
    
    // Status column
    const statusCell = document.createElement('td');
    const statusSpan = createElement('span', {
        className: `status-label status-${order.status.toLowerCase()}`,
        textContent: order.status
    });
    statusCell.appendChild(statusSpan);
    row.appendChild(statusCell);
    
    // Actions column
    const actionsCell = createTableCell('', 'table-actions');
    
    const viewButton = createButton('fas fa-eye', 'btn btn-sm btn-primary view-order-btn', 
        () => showOrderDetails(order.idOrder), { id: order.idOrder });
    
    const editButton = createButton('fas fa-edit', 'btn btn-sm btn-warning edit-order-btn', 
        () => showEditOrderModal(order.idOrder), { id: order.idOrder });
    
    const deleteButton = createButton('fas fa-trash', 'btn btn-sm btn-danger delete-order-btn', 
        () => showDeleteConfirmation('order', order.idOrder), { id: order.idOrder });
    
    actionsCell.appendChild(viewButton);
    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);
    row.appendChild(actionsCell);
    
    return row;
}

function populateCustomerDropdown(clients) {
    const customerSelect = document.getElementById('orderCustomer');
    customerSelect.innerHTML = '';
    
    // Add default option
    const defaultOption = createElement('option', {
        attributes: { value: '' },
        textContent: 'Select a customer'
    });
    customerSelect.appendChild(defaultOption);
    
    clients.forEach(client => {
        const option = createElement('option', {
            attributes: { value: client.idClient },
            textContent: `${client.firstName} ${client.lastName}`
        });
        customerSelect.appendChild(option);
    });
}

function showAddOrderModal() {
    document.getElementById('orderModalTitle').textContent = 'Create New Order';
    orderForm.reset();
    document.getElementById('orderId').value = '';
    
    // Clear previous order items
    document.getElementById('orderItems').innerHTML = '';
    // Add first empty row
    addOrderItemRow();
    
    orderModal.classList.add('active');
}

async function showEditOrderModal(id) {
    showLoading();
    try {
        // Fetch order details
        const orderResponse = await fetch(`${API_BASE_URL}/orders/${id}`);
        if (!orderResponse.ok) {
            throw new Error('Failed to fetch order details');
        }
        const order = await orderResponse.json();
        
        // Fetch order items
        const orderItemsResponse = await fetch(`${API_BASE_URL}/order-details/order/${id}`);
        if (!orderItemsResponse.ok) {
            throw new Error('Failed to fetch order items');
        }
        const orderItems = await orderItemsResponse.json();
        
        // Set form values
        document.getElementById('orderModalTitle').textContent = 'Edit Order';
        document.getElementById('orderId').value = order.idOrder;
        document.getElementById('orderCustomer').value = order.idCustomer;
        document.getElementById('orderStatus').value = order.status;
        
        // Clear and populate order items
        const orderItemsContainer = document.getElementById('orderItems');
        orderItemsContainer.innerHTML = '';
        
        if (orderItems.length === 0) {
            // Add an empty row if no items
            addOrderItemRow();
        } else {
            // Add rows for each item
            orderItems.forEach(item => {
                addOrderItemRow(item);
            });
        }
        
        orderModal.classList.add('active');
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

function closeOrderModal() {
    orderModal.classList.remove('active');
}

function addOrderItemRow(item = null) {
    // Fetch dishes if needed for dropdown
    const dishesPromise = fetch(`${API_BASE_URL}/menu`)
        .then(response => response.json())
        .catch(error => {
            showError('Failed to load dishes: ' + error.message);
            return [];
        });
    
    dishesPromise.then(dishes => {
        const orderItemsContainer = document.getElementById('orderItems');
        
        // Create row container
        const itemRow = createElement('div', {
            className: 'order-item-row',
            style: {
                display: 'grid',
                gridTemplateColumns: '1fr 100px 100px 50px',
                gap: '10px',
                marginBottom: '10px',
                alignItems: 'center'
            }
        });
        
        // Create dish select
        const dishSelect = createElement('select', {
            className: 'form-control',
            attributes: { required: 'true' }
        });
        
        // Add default option
        const defaultOption = createElement('option', {
            attributes: { value: '' },
            textContent: 'Select a dish'
        });
        dishSelect.appendChild(defaultOption);
        
        // Add dish options
        dishes.forEach(dish => {
            const option = createElement('option', {
                attributes: { value: dish.idDish },
                textContent: `${dish.name} - ${dish.price.toFixed(2)}`,
                dataset: { price: dish.price }
            });
            dishSelect.appendChild(option);
        });
        
        // If editing, select the correct dish
        if (item) {
            dishSelect.value = item.idDish;
        }
        
        // Create quantity input
        const quantityInput = createElement('input', {
            attributes: {
                type: 'number',
                min: '1',
                required: 'true'
            },
            className: 'form-control',
            value: item ? item.quantity : '1'
        });
        
        // Create price input (readonly)
        const priceInput = createElement('input', {
            attributes: {
                type: 'number',
                readonly: 'true'
            },
            className: 'form-control',
            value: item ? item.price.toFixed(2) : ''
        });
        
        // Create remove button
        const removeBtn = createElement('button', {
            attributes: { type: 'button' },
            className: 'btn btn-danger btn-sm',
            innerHTML: '<i class="fas fa-times"></i>',
            events: {
                click: () => {
                    itemRow.remove();
                }
            }
        });
        
        // Event listener to update price when dish changes
        dishSelect.addEventListener('change', () => {
            const selectedOption = dishSelect.options[dishSelect.selectedIndex];
            if (selectedOption.dataset.price) {
                priceInput.value = parseFloat(selectedOption.dataset.price).toFixed(2);
            } else {
                priceInput.value = '';
            }
        });
        
        // Add elements to row
        itemRow.appendChild(dishSelect);
        itemRow.appendChild(quantityInput);
        itemRow.appendChild(priceInput);
        itemRow.appendChild(removeBtn);
        
        // Add row to container
        orderItemsContainer.appendChild(itemRow);
    });
}

async function handleOrderFormSubmit(event) {
    event.preventDefault();
    
    const orderId = document.getElementById('orderId').value;
    const customerId = document.getElementById('orderCustomer').value;
    const status = document.getElementById('orderStatus').value;
    
    if (!customerId) {
        showError('Please select a customer');
        return;
    }
    
    // Collect order items
    const orderItemRows = document.querySelectorAll('.order-item-row');
    const orderItems = [];
    
    orderItemRows.forEach(row => {
        const dishSelect = row.querySelector('select');
        const quantityInput = row.querySelectorAll('input')[0];
        const priceInput = row.querySelectorAll('input')[1];
        
        if (dishSelect.value && quantityInput.value) {
            orderItems.push({
                idDish: parseInt(dishSelect.value),
                quantity: parseInt(quantityInput.value),
                price: parseFloat(priceInput.value)
            });
        }
    });
    
    if (orderItems.length === 0) {
        showError('Please add at least one item to the order');
        return;
    }
    
    showLoading();
    try {
        // Create or update order
        const orderData = {
            idCustomer: parseInt(customerId),
            status: status,
            date: new Date().toISOString()
        };
        
        let orderResponse;
        let savedOrderId;
        
        if (orderId) {
            // Update existing order
            orderData.idOrder = parseInt(orderId);
            orderResponse = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });
            
            if (!orderResponse.ok) {
                throw new Error('Failed to update order');
            }
            
            savedOrderId = orderId;
            
            // Delete existing order items
            const orderDetailsResponse = await fetch(`${API_BASE_URL}/order-details/order/${orderId}`);
            const existingItems = await orderDetailsResponse.json();
            
            // Delete each item
            for (const item of existingItems) {
                await fetch(`${API_BASE_URL}/order-details/${item.idDetail}`, {
                    method: 'DELETE'
                });
            }
        } else {
            // Create new order
            orderResponse = await fetch(`${API_BASE_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });
            
            if (!orderResponse.ok) {
                throw new Error('Failed to create order');
            }
            
            const orderResult = await orderResponse.text();
            // Assuming the response contains the new order ID
            savedOrderId = parseInt(orderResult.match(/\d+/)[0]);
        }
        
        // Create order items
        for (const item of orderItems) {
            const orderItemData = {
                idOrder: parseInt(savedOrderId),
                idDish: item.idDish,
                quantity: item.quantity,
                price: item.price
            };
            
            const itemResponse = await fetch(`${API_BASE_URL}/order-details`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderItemData)
            });
            
            if (!itemResponse.ok) {
                throw new Error('Failed to add order item');
            }
        }
        
        showSuccess(`Order ${orderId ? 'updated' : 'created'} successfully`);
        closeOrderModal();
        fetchOrders();
        fetchDashboardData(); // Update dashboard counts
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

async function showOrderDetails(id) {
    showLoading();
    try {
        // Fetch order details
        const orderResponse = await fetch(`${API_BASE_URL}/orders/${id}`);
        if (!orderResponse.ok) {
            throw new Error('Failed to fetch order details');
        }
        const order = await orderResponse.json();
        
        // Fetch order items
        const orderItemsResponse = await fetch(`${API_BASE_URL}/order-details/order/${id}`);
        if (!orderItemsResponse.ok) {
            throw new Error('Failed to fetch order items');
        }
        const orderItems = await orderItemsResponse.json();
        
        // Fetch dish details for each item
        const dishes = await Promise.all(
            orderItems.map(item => 
                fetch(`${API_BASE_URL}/menu/${item.idDish}`)
                .then(response => response.json())
            )
        );
        
        // Fetch customer details
        const customerResponse = await fetch(`${API_BASE_URL}/clients/${order.idCustomer}`);
        const customer = await customerResponse.json();
        
        // Create and populate order items
        createOrderDetailsContent(order, orderItems, dishes, customer);
        
        // Set current order ID for status updates
        currentOrderId = order.idOrder;
        
        // Set the current status in the update button
        const updateOrderStatusBtn = document.getElementById('updateOrderStatusBtn');
        updateOrderStatusBtn.textContent = `Update Status (${order.status})`;
        updateOrderStatusBtn.onclick = showOrderStatusUpdateOptions;
        
        orderDetailModal.classList.add('active');
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

function createOrderDetailsContent(order, orderItems, dishes, customer) {
    // Populate order items
    const orderDetailItems = document.getElementById('orderDetailItems');
    orderDetailItems.innerHTML = '';
    
    let total = 0;
    
    orderItems.forEach((item, index) => {
        const dish = dishes[index];
        const itemTotal = item.quantity * item.price;
        total += itemTotal;
        
        const itemElement = createElement('div', {
            className: 'order-item'
        });
        
        const detailsDiv = createElement('div', {
            className: 'order-item-details'
        });
        
        const nameDiv = createElement('div', {
            className: 'order-item-name',
            textContent: dish.name
        });
        
        const priceDiv = createElement('div', {
            className: 'order-item-price',
            textContent: `${item.price.toFixed(2)} x ${item.quantity}`
        });
        
        const totalDiv = createElement('div', {
            className: 'order-item-total',
            textContent: itemTotal.toFixed(2)
        });
        
        detailsDiv.appendChild(nameDiv);
        detailsDiv.appendChild(priceDiv);
        
        itemElement.appendChild(detailsDiv);
        itemElement.appendChild(totalDiv);
        
        orderDetailItems.appendChild(itemElement);
    });
    
    // Populate order summary
    const orderDetailSummary = document.getElementById('orderDetailSummary');
    const orderDate = new Date(order.date);
    
    // Create summary container
    const summaryContainer = createElement('div', {
        style: { marginBottom: '15px' }
    });
    
    // Create order ID line
    const orderIdLine = createElement('div', {
        style: { marginBottom: '5px' }
    });
    const orderIdStrong = createElement('strong', {
        textContent: `Order #${order.idOrder}`
    });
    orderIdLine.appendChild(orderIdStrong);
    
    // Create date line
    const dateLine = createElement('div', {
        style: { marginBottom: '5px' },
        textContent: `Date: ${orderDate.toLocaleDateString()} ${orderDate.toLocaleTimeString()}`
    });
    
    // Create customer line
    const customerLine = createElement('div', {
        style: { marginBottom: '5px' },
        textContent: `Customer: ${customer.firstName} ${customer.lastName}`
    });
    
    // Create status line
    const statusLine = createElement('div', {
        style: { marginBottom: '5px' }
    });
    statusLine.textContent = 'Status: ';
    const statusSpan = createElement('span', {
        className: `status-label status-${order.status.toLowerCase()}`,
        textContent: order.status
    });
    statusLine.appendChild(statusSpan);
    
    // Create order total
    const totalDiv = createElement('div', {
        className: 'order-total',
        textContent: `Total: ${total.toFixed(2)}`
    });
    
    // Add all elements to summary container
    summaryContainer.appendChild(orderIdLine);
    summaryContainer.appendChild(dateLine);
    summaryContainer.appendChild(customerLine);
    summaryContainer.appendChild(statusLine);
    
    // Clear previous content and add new content
    orderDetailSummary.innerHTML = '';
    orderDetailSummary.appendChild(summaryContainer);
    orderDetailSummary.appendChild(totalDiv);
}

function closeOrderDetailModal() {
    orderDetailModal.classList.remove('active');
    currentOrderId = null;
}

function showOrderStatusUpdateOptions() {
    const statusOptions = ['Pending', 'Processing', 'Completed', 'Cancelled'];
    
    // Create status options container
    const orderStatusContainer = createElement('div', {
        style: {
            position: 'absolute',
            backgroundColor: 'white',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            borderRadius: '4px',
            overflow: 'hidden',
            zIndex: '1100'
        }
    });
    
    // Position relative to the button
    const button = document.getElementById('updateOrderStatusBtn');
    const buttonRect = button.getBoundingClientRect();
    orderStatusContainer.style.top = `${buttonRect.bottom + 5}px`;
    orderStatusContainer.style.right = `${window.innerWidth - buttonRect.right}px`;
    
    // Create option elements
    statusOptions.forEach(status => {
        const statusOption = createElement('div', {
            textContent: status,
            style: {
                padding: '10px 15px',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
            },
            events: {
                mouseover: (e) => {
                    e.target.style.backgroundColor = '#f5f5f5';
                },
                mouseout: (e) => {
                    e.target.style.backgroundColor = 'white';
                },
                click: () => {
                    updateOrderStatus(status);
                    document.body.removeChild(orderStatusContainer);
                }
            }
        });
        
        orderStatusContainer.appendChild(statusOption);
    });
    
    document.body.appendChild(orderStatusContainer);
    
    // Close when clicking outside
    const closeStatusOptions = (event) => {
        if (!orderStatusContainer.contains(event.target) && event.target !== button) {
            document.body.removeChild(orderStatusContainer);
            document.removeEventListener('click', closeStatusOptions);
        }
    };
    
    // Delay adding the event listener to prevent immediate closure
    setTimeout(() => {
        document.addEventListener('click', closeStatusOptions);
    }, 100);
}

async function updateOrderStatus(status) {
    if (!currentOrderId) return;
    
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${currentOrderId}/status?status=${status}`, {
            method: 'PUT'
        });
        
        if (!response.ok) {
            throw new Error('Failed to update order status');
        }
        
        showSuccess(`Order status updated to ${status}`);
        closeOrderDetailModal();
        fetchOrders();
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

async function handleOrderSearch() {
    const searchTerm = orderSearchInput.value.trim();
    
    if (searchTerm === '') {
        fetchOrders();
        return;
    }
    
    showLoading();
    try {
        const clientsResponse = await fetch(`${API_BASE_URL}/clients`);
        const clients = await clientsResponse.json();
        
        // Create a map of client IDs to names
        const clientMap = {};
        clients.forEach(client => {
            clientMap[client.idClient] = `${client.firstName} ${client.lastName}`;
        });
        
        // Fetch all orders and filter in JavaScript
        // This is a workaround if the API doesn't support searching orders
        const response = await fetch(`${API_BASE_URL}/orders`);
        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }
        
        const orders = await response.json();
        const filteredOrders = orders.filter(order => {
            // Check if order ID contains search term
            if (order.idOrder.toString().includes(searchTerm)) {
                return true;
            }
            
            // Check if customer name contains search term
            const customerName = clientMap[order.idCustomer] || '';
            if (customerName.toLowerCase().includes(searchTerm.toLowerCase())) {
                return true;
            }
            
            // Check if status contains search term
            if (order.status.toLowerCase().includes(searchTerm.toLowerCase())) {
                return true;
            }
            
            return false;
        });
        
        displayOrders(filteredOrders, clientMap);
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

// Functions - Delete Confirmation and Actions
function showDeleteConfirmation(type, id) {
    currentDeleteType = type;
    currentDeleteId = id;
    
    let message;
    switch (type) {
        case 'employee':
            message = 'Are you sure you want to delete this employee? This action cannot be undone.';
            break;
        case 'dish':
            message = 'Are you sure you want to delete this dish? This action cannot be undone.';
            break;
        case 'client':
            message = 'Are you sure you want to delete this client? This action cannot be undone.';
            break;
        case 'order':
            message = 'Are you sure you want to delete this order? This action cannot be undone.';
            break;
        default:
            message = 'Are you sure you want to delete this item? This action cannot be undone.';
    }
    
    document.getElementById('confirmationMessage').textContent = message;
    confirmationModal.classList.add('active');
}

function closeConfirmModal() {
    confirmationModal.classList.remove('active');
    currentDeleteType = null;
    currentDeleteId = null;
}

async function confirmDelete() {
    if (!currentDeleteId || !currentDeleteType) return;
    
    showLoading();
    try {
        let url;
        switch (currentDeleteType) {
            case 'employee':
                url = `${API_BASE_URL}/employees/${currentDeleteId}`;
                break;
            case 'dish':
                url = `${API_BASE_URL}/menu/${currentDeleteId}`;
                break;
            case 'client':
                url = `${API_BASE_URL}/clients/${currentDeleteId}`;
                break;
            case 'order':
                url = `${API_BASE_URL}/orders/${currentDeleteId}`;
                break;
            default:
                throw new Error('Invalid delete type');
        }
        
        const response = await fetch(url, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`Failed to delete ${currentDeleteType}`);
        }
        
        const result = await response.text();
        showSuccess(result);
        closeConfirmModal();
        
        // Refresh the appropriate section
        switch (currentDeleteType) {
            case 'employee':
                fetchEmployees();
                break;
            case 'dish':
                fetchDishes();
                break;
            case 'client':
                fetchClients();
                break;
            case 'order':
                fetchOrders();
                break;
        }
        
        fetchDashboardData(); // Update dashboard counts
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

// Utility Functions
function showLoading() {
    loadingSpinner.classList.add('active');
}

function hideLoading() {
    loadingSpinner.classList.remove('active');
}

function showSuccess(message) {
    successAlert.textContent = message;
    successAlert.classList.add('active');
    
    setTimeout(() => {
        successAlert.classList.remove('active');
    }, 3000);
}

function showError(message) {
    errorAlert.textContent = message;
    errorAlert.classList.add('active');
    
    setTimeout(() => {
        errorAlert.classList.remove('active');
    }, 3000);
}