// Function to handle category selection and product filtering
document.addEventListener('DOMContentLoaded', function() {
    // First, assign categories to existing products as data attributes
    // This would normally come from the backend, but we're simulating it for this demo
    setupProductCategories();
    
    // Get all category cards
    const categoryCards = document.querySelectorAll('.category-card');
    
    // Add click event to each card
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove 'active' class from all cards
            categoryCards.forEach(c => c.classList.remove('active'));
            
            // Add 'active' class to the selected card
            this.classList.add('active');
            
            // Get the selected category name
            const category = this.querySelector('span').textContent.trim();
            
            // Filter products by category
            filterProductsByCategory(category);
        });
    });

    // Initialize search functionality
    initializeSearch();
    
    // Initialize SweetAlert2 (add this to your HTML)
    // <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
});

// Function to assign categories to products (simulation)
function setupProductCategories() {
    const productCards = document.querySelectorAll('.bg-white.rounded-xl');
    
    // Assign categories to products based on their titles or characteristics
    // In a real environment, this would come from the backend
    productCards.forEach(card => {
        const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
        
        // Assign categories based on keywords in titles or descriptions
        if (title.includes('ensalada') || title.includes('bowl') || card.querySelector('p')?.textContent.includes('vegetal')) {
            card.dataset.category = 'Vegano';
        } else if (title.includes('pasta') || title.includes('tacos')) {
            card.dataset.category = 'Platos Fuertes';
        } else if (title.includes('pizza')) {
            card.dataset.category = 'Pizzas';
        } else if (title.includes('café') || title.includes('smoothie')) {
            card.dataset.category = 'Bebidas';
        } else if (title.includes('postre') || title.includes('coco')) {
            card.dataset.category = 'Postres';
        }
        
        // All products have the "Todos" category
        card.dataset.categories = 'Todos,' + (card.dataset.category || '');
        
        // Add transition class for animations
        card.classList.add('product-card-transition');
    });
}

// Function to filter products by category
function filterProductsByCategory(category) {
    const productCards = document.querySelectorAll('.bg-white.rounded-xl');
    const sections = ['Más Populares', 'Especiales de la Semana', 'Recién Agregados'];
    const sectionElements = {};
    
    // Get section containers to show/hide if they have no products
    sections.forEach(section => {
        const sectionTitle = Array.from(document.querySelectorAll('h2.text-xl.font-bold')).find(
            el => el.textContent.trim() === section
        );
        if (sectionTitle) {
            sectionElements[section] = sectionTitle.closest('div');
        }
    });
    
    // Counter for products by section
    const productCountBySection = {};
    sections.forEach(section => {
        productCountBySection[section] = 0;
    });
    
    // Filter each product
    productCards.forEach(card => {
        // Get product categories (could be multiple)
        const productCategories = (card.dataset.categories || '').split(',');
        
        // Check if the product should be shown
        const shouldShow = category === 'Todos' || productCategories.includes(category);
        
        // Apply animations when showing/hiding products
        if (shouldShow) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.display = '';
            
            // Stagger animation for a nice effect
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50 + Array.from(productCards).indexOf(card) * 30);
            
            // Find which section this product belongs to
            for (const section of sections) {
                if (card.closest('div')?.previousElementSibling?.querySelector('h2')?.textContent.includes(section)) {
                    productCountBySection[section]++;
                    break;
                }
            }
        } else {
            // Fade out animation
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                card.style.display = 'none';
            }, 300); // Match this with the CSS transition duration
        }
    });
    
    // Show or hide entire sections if they have no visible products
    for (const [section, count] of Object.entries(productCountBySection)) {
        if (sectionElements[section]) {
            if (count > 0) {
                sectionElements[section].style.display = '';
                sectionElements[section].classList.add('section-fade-in');
            } else {
                sectionElements[section].classList.add('section-fade-out');
                setTimeout(() => {
                    sectionElements[section].style.display = 'none';
                    sectionElements[section].classList.remove('section-fade-out');
                }, 300);
            }
        }
    }
    
    // Show feedback message with animated toast instead of basic alert
    showToast(`Mostrando productos de: ${category}`, 'success');
}

// Function to show toast notification
function showToast(message, icon = 'success') {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });
    
    Toast.fire({
        icon: icon,
        title: message
    });
}

// Function to initialize search functionality
function initializeSearch() {
    const searchInputs = document.querySelectorAll('input[type="text"]');
    const allProductCards = document.querySelectorAll('.grid > div.bg-white.rounded-xl');
    
    // Add event listeners to search inputs
    searchInputs.forEach(input => {
        const inputWrapper = input.parentElement;
        
        // Add search icon to input
        if (!inputWrapper.querySelector('.search-icon')) {
            const searchIcon = document.createElement('span');
            searchIcon.className = 'search-icon absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400';
            searchIcon.innerHTML = '<i class="fas fa-search"></i>';
            inputWrapper.appendChild(searchIcon);
            
            // Add padding to input for icon
            input.classList.add('pl-10');
        }
        
        input.addEventListener('input', function() {
            const searchTerm = this.value.trim();
            filterProductsByName(searchTerm);
            
            // Synchronize both search fields
            searchInputs.forEach(otherInput => {
                if (otherInput !== this) {
                    otherInput.value = searchTerm;
                }
            });
        });
        
        // Prevent page reload on Enter key
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
            }
        });
        
        // Add clear button to search input
        addClearButton(input);
    });
}

// Function to filter products by name
function filterProductsByName(searchTerm) {
    // Get all product cards
    const allProductCards = document.querySelectorAll('.grid > div.bg-white.rounded-xl');
    
    // Convert to lowercase for case-insensitive search
    searchTerm = searchTerm.toLowerCase();
    
    // Counter for animations
    let visibleCount = 0;
    
    allProductCards.forEach(card => {
        // Get the product title (name)
        const title = card.querySelector('h3').textContent.toLowerCase();
        
        // Only check if the search term is in the title (product name)
        if (title.includes(searchTerm)) {
            // Show the product with animation
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.display = '';
            
            // Stagger animation for a nice effect
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50 + visibleCount * 30);
            
            visibleCount++;
        } else {
            // Hide with animation
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
    
    // Check if there are no results to show a message
    const visibleProducts = Array.from(allProductCards).filter(card => 
        card.style.display !== 'none'
    );
    
    // Get all product sections
    const productSections = document.querySelectorAll('.container > div.mb-10, .container > div:last-child');
    
    productSections.forEach(section => {
        const sectionProducts = section.querySelectorAll('.grid > div.bg-white.rounded-xl');
        const visibleSectionProducts = Array.from(sectionProducts).filter(card => 
            card.style.display !== 'none'
        );
        
        // If there are no visible products in this section, hide it with animation
        if (visibleSectionProducts.length === 0) {
            // Hide the section header and "View all" links
            const heading = section.querySelector('.flex.justify-between');
            if (heading) {
                heading.classList.add('fade-out');
                setTimeout(() => {
                    heading.style.display = 'none';
                    heading.classList.remove('fade-out');
                }, 300);
            }
            
            // Hide the product grid
            const grid = section.querySelector('.grid');
            if (grid) {
                grid.classList.add('fade-out');
                setTimeout(() => {
                    grid.style.display = 'none';
                    grid.classList.remove('fade-out');
                }, 300);
            }
        } else {
            // Show the section if it has visible products
            const heading = section.querySelector('.flex.justify-between');
            if (heading) {
                heading.style.display = '';
                heading.classList.add('fade-in');
                setTimeout(() => {
                    heading.classList.remove('fade-in');
                }, 300);
            }
            
            const grid = section.querySelector('.grid');
            if (grid) {
                grid.style.display = '';
                grid.classList.add('fade-in');
                setTimeout(() => {
                    grid.classList.remove('fade-in');
                }, 300);
            }
        }
    });
    
    // Show message if no results
    showNoResultsMessage(visibleProducts.length === 0, searchTerm);
}

// Function to show "no results" message
function showNoResultsMessage(noResults, searchTerm) {
    const noResultsMessage = document.getElementById('no-results-message');
    
    if (noResults && searchTerm !== '') {
        if (!noResultsMessage) {
            // Create a "no results" message with animation
            const message = document.createElement('div');
            message.id = 'no-results-message';
            message.className = 'text-center py-8 text-gray-500 fade-in';
            message.innerHTML = `
                <i class="fas fa-search-minus text-4xl mb-3 text-green-800"></i>
                <p class="text-lg mb-2">No encontramos resultados para "${searchTerm}"</p>
                <p class="text-sm">Intenta con otro nombre de producto</p>
                <button id="clear-search" class="mt-4 px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-700 transition-all duration-300 flex items-center mx-auto">
                    <i class="fas fa-times mr-2"></i> Limpiar búsqueda
                </button>
            `;
            document.querySelector('.container').appendChild(message);
            
            // Add eventListener to the button to clear the search
            document.getElementById('clear-search').addEventListener('click', () => {
                const searchInputs = document.querySelectorAll('input[type="text"]');
                searchInputs.forEach(input => {
                    input.value = '';
                });
                filterProductsByName('');
            });
        } else {
            // Update existing message
            const textElement = noResultsMessage.querySelector('p:first-of-type');
            if (textElement) {
                textElement.textContent = `No encontramos resultados para "${searchTerm}"`;
            }
            noResultsMessage.style.display = 'block';
            noResultsMessage.classList.add('fade-in');
            setTimeout(() => {
                noResultsMessage.classList.remove('fade-in');
            }, 300);
        }
    } else if (noResultsMessage) {
        noResultsMessage.classList.add('fade-out');
        setTimeout(() => {
            noResultsMessage.style.display = 'none';
            noResultsMessage.classList.remove('fade-out');
        }, 300);
    }
}

// Function to add clear button to search input
function addClearButton(input) {
    const parent = input.parentElement;
    
    // Check if the button already exists to avoid duplicates
    if (!parent.querySelector('.clear-search-btn')) {
        const clearButton = document.createElement('button');
        clearButton.className = 'clear-search-btn absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 cursor-pointer transition-all duration-300 hover:text-gray-700';
        clearButton.innerHTML = '<i class="fas fa-times"></i>';
        clearButton.style.display = 'none'; // Initially hidden
        
        clearButton.addEventListener('click', () => {
            input.value = '';
            clearButton.style.display = 'none';
            filterProductsByName('');
            input.focus();
        });
        
        parent.appendChild(clearButton);
        
        // Show/hide the button depending on whether there is text
        input.addEventListener('input', function() {
            clearButton.style.display = this.value.length > 0 ? 'flex' : 'none';
        });
    }
}

// Add CSS styles for animations and transitions
if (!document.getElementById('category-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'category-styles';
    styleElement.textContent = `
        /* Category card styles */
        .category-card {
            transition: all 0.3s ease;
            border-color: transparent;
            cursor: pointer;
        }
        .category-card.active {
            background-color: rgba(22, 101, 52, 0.1);
            border-color: rgb(22, 101, 52);
        }
        .category-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        /* Product card animations */
        .product-card-transition {
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
        
        /* Section animations */
        .section-fade-in {
            animation: fadeIn 0.3s ease forwards;
        }
        .section-fade-out {
            animation: fadeOut 0.3s ease forwards;
        }
        
        /* General animations */
        .fade-in {
            animation: fadeIn 0.3s ease forwards;
        }
        .fade-out {
            animation: fadeOut 0.3s ease forwards;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeOut {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(10px);
            }
        }
        
        /* Improved search input styling */
        input[type="text"] {
            transition: all 0.3s ease;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }
        input[type="text"]:focus {
            box-shadow: 0 3px 8px rgba(22, 101, 52, 0.15);
            border-color: rgb(22, 101, 52);
        }
        
        /* Button hover effects */
        button {
            transition: all 0.2s ease;
        }
        button:hover {
            transform: translateY(-2px);
        }
    `;
    document.head.appendChild(styleElement);
}

// Profile dropdown menu functionality with improved animations
document.addEventListener('DOMContentLoaded', function() {
    const profileToggle = document.getElementById('profileToggle');
    const profileMenu = document.getElementById('profileMenu');
    
    if(profileToggle && profileMenu) {
        // Add animation class
        profileMenu.classList.add('profile-menu-transition');
        
        // Show/hide menu when clicking on profile
        profileToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (profileMenu.classList.contains('hidden')) {
                // Show menu with animation
                profileMenu.classList.remove('hidden');
                profileMenu.style.opacity = '0';
                profileMenu.style.transform = 'translateY(-10px)';
                
                setTimeout(() => {
                    profileMenu.style.opacity = '1';
                    profileMenu.style.transform = 'translateY(0)';
                }, 10);
            } else {
                // Hide menu with animation
                profileMenu.style.opacity = '0';
                profileMenu.style.transform = 'translateY(-10px)';
                
                setTimeout(() => {
                    profileMenu.classList.add('hidden');
                }, 300);
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!profileToggle.contains(e.target) && !profileMenu.classList.contains('hidden')) {
                // Hide with animation
                profileMenu.style.opacity = '0';
                profileMenu.style.transform = 'translateY(-10px)';
                
                setTimeout(() => {
                    profileMenu.classList.add('hidden');
                }, 300);
            }
        });
        
        // Logout functionality with SweetAlert2 modal
        const logoutButton = profileMenu.querySelector('a:last-child');
        if(logoutButton) {
            logoutButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Show SweetAlert2 modal instead of confirm()
                Swal.fire({
                    title: '¿Cerrar sesión?',
                    text: '¿Estás seguro que deseas cerrar sesión?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#166534', // Green-800
                    cancelButtonColor: '#6B7280', // Gray-500
                    confirmButtonText: '<i class="fas fa-sign-out-alt mr-2"></i> Sí, cerrar sesión',
                    cancelButtonText: '<i class="fas fa-times mr-2"></i> Cancelar',
                    reverseButtons: true,
                    customClass: {
                        container: 'custom-swal-container',
                        popup: 'custom-swal-popup'
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Success message with animation
                        Swal.fire({
                            title: '¡Sesión cerrada!',
                            text: 'Has cerrado sesión exitosamente',
                            icon: 'success',
                            timer: 2000,
                            timerProgressBar: true,
                            showConfirmButton: false
                        }).then(() => {
                            // Redirect to home or login page
                            window.location.href = '../../index.html';
                        });
                    }
                });
            });
        }
    }
    
    // Add CSS for profile menu transition
    if (!document.getElementById('profile-menu-styles')) {
        const profileStyles = document.createElement('style');
        profileStyles.id = 'profile-menu-styles';
        profileStyles.textContent = `
            .profile-menu-transition {
                transition: opacity 0.3s ease, transform 0.3s ease;
            }
            
            /* SweetAlert2 customizations */
            .custom-swal-popup {
                border-radius: 1rem;
                padding: 1.5rem;
            }
            
            /* Style Swal buttons to match the site theme */
            .swal2-confirm, .swal2-cancel {
                border-radius: 0.5rem !important;
                padding: 0.75rem 1.5rem !important;
                font-weight: 500 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }
            
            .swal2-confirm:focus, .swal2-cancel:focus {
                box-shadow: 0 0 0 3px rgba(22, 101, 52, 0.3) !important;
            }
        `;
        document.head.appendChild(profileStyles);
    }
});

// Initialize: show all products when loading
document.addEventListener('DOMContentLoaded', function() {
    // This will ensure we run after all DOM elements are available
    filterProductsByName('');
    
    // Add FontAwesome if not already included
    if (!document.querySelector('link[href*="fontawesome"]')) {
        const fontAwesome = document.createElement('link');
        fontAwesome.rel = 'stylesheet';
        fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
        document.head.appendChild(fontAwesome);
    }
    
    // Add SweetAlert2 if not already included
    if (typeof Swal === 'undefined') {
        const sweetAlert = document.createElement('script');
        sweetAlert.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
        document.head.appendChild(sweetAlert);
    }
});