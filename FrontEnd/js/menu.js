        // Category selection
        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach(card => {
            card.addEventListener('click', function() {
                categoryCards.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
            });
        });
        
        // Add to cart functionality would be implemented here
        const addButtons = document.querySelectorAll('.btn-wild');
        addButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Example implementation
                alert('¡Producto añadido al carrito!');
            });
        });

        // Obtener referencias a los elementos del DOM
const searchInputs = document.querySelectorAll('input[type="text"]');
const allProductCards = document.querySelectorAll('.grid > div.bg-white.rounded-xl');

// Función para filtrar productos basados en el término de búsqueda
function filterProducts(searchTerm) {
    // Convertir a minúsculas para hacer la búsqueda insensible a mayúsculas/minúsculas
    searchTerm = searchTerm.toLowerCase();
    
    allProductCards.forEach(card => {
        // Obtener el título y descripción del producto
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        // Verificar si el término de búsqueda está en el título o descripción
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = ''; // Mostrar el producto
        } else {
            card.style.display = 'none'; // Ocultar el producto
        }
    });
    
    // Verificar si no hay resultados para mostrar un mensaje
    const visibleProducts = Array.from(allProductCards).filter(card => 
        card.style.display !== 'none'
    );
    
    // Obtener todas las secciones de productos
    const productSections = document.querySelectorAll('.container > div.mb-10, .container > div:last-child');
    
    productSections.forEach(section => {
        const sectionProducts = section.querySelectorAll('.grid > div.bg-white.rounded-xl');
        const visibleSectionProducts = Array.from(sectionProducts).filter(card => 
            card.style.display !== 'none'
        );
        
        // Si no hay productos visibles en esta sección, ocultarla
        if (visibleSectionProducts.length === 0) {
            // Ocultar el encabezado de la sección y los enlaces "Ver todos"
            const heading = section.querySelector('.flex.justify-between');
            if (heading) {
                heading.style.display = 'none';
            }
            
            // Ocultar el grid de productos
            const grid = section.querySelector('.grid');
            if (grid) {
                grid.style.display = 'none';
            }
        } else {
            // Mostrar la sección si tiene productos visibles
            const heading = section.querySelector('.flex.justify-between');
            if (heading) {
                heading.style.display = '';
            }
            
            const grid = section.querySelector('.grid');
            if (grid) {
                grid.style.display = '';
            }
        }
    });
    
    // Mostrar mensaje si no hay resultados
    const noResultsMessage = document.getElementById('no-results-message');
    if (visibleProducts.length === 0 && searchTerm !== '') {
        if (!noResultsMessage) {
            // Crear un mensaje de "no hay resultados"
            const message = document.createElement('div');
            message.id = 'no-results-message';
            message.className = 'text-center py-8 text-gray-500';
            message.innerHTML = `
                <i class="fas fa-search text-4xl mb-3"></i>
                <p class="text-lg mb-2">No encontramos resultados para "${searchTerm}"</p>
                <p class="text-sm">Intenta con otra búsqueda o categoría</p>
                <button id="clear-search" class="mt-4 px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-700">
                    Limpiar búsqueda
                </button>
            `;
            document.querySelector('.container').appendChild(message);
            
            // Agregar eventListener al botón para limpiar la búsqueda
            document.getElementById('clear-search').addEventListener('click', () => {
                searchInputs.forEach(input => {
                    input.value = '';
                });
                filterProducts('');
            });
        } else {
            // Actualizar el mensaje existente
            const textElement = noResultsMessage.querySelector('p:first-of-type');
            if (textElement) {
                textElement.textContent = `No encontramos resultados para "${searchTerm}"`;
            }
            noResultsMessage.style.display = 'block';
        }
    } else if (noResultsMessage) {
        noResultsMessage.style.display = 'none';
    }
}

// Agregar eventos de escucha a ambos campos de búsqueda (móvil y desktop)
searchInputs.forEach(input => {
    input.addEventListener('input', function() {
        const searchTerm = this.value.trim();
        filterProducts(searchTerm);
        
        // Sincronizar ambos campos de búsqueda
        searchInputs.forEach(otherInput => {
            if (otherInput !== this) {
                otherInput.value = searchTerm;
            }
        });
    });
    
    // Evitar que la página se recargue al presionar Enter en el campo de búsqueda
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    });
});

// Agregar la funcionalidad de borrar el campo de búsqueda
// Crear y agregar el botón de "x" para limpiar la búsqueda
searchInputs.forEach(input => {
    const parent = input.parentElement;
    
    // Verificar si ya existe el botón para evitar duplicados
    if (!parent.querySelector('.clear-search-btn')) {
        const clearButton = document.createElement('button');
        clearButton.className = 'clear-search-btn absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 cursor-pointer';
        clearButton.innerHTML = '<i class="fas fa-times"></i>';
        clearButton.style.display = 'none'; // Inicialmente oculto
        
        clearButton.addEventListener('click', () => {
            input.value = '';
            clearButton.style.display = 'none';
            filterProducts('');
            input.focus();
        });
        
        parent.appendChild(clearButton);
        
        // Mostrar/ocultar el botón según haya texto o no
        input.addEventListener('input', function() {
            clearButton.style.display = this.value.length > 0 ? 'flex' : 'none';
        });
    }
});

// Funcionalidad para el menú desplegable de perfil
document.addEventListener('DOMContentLoaded', function() {
    const profileToggle = document.getElementById('profileToggle');
    const profileMenu = document.getElementById('profileMenu');
    
    if(profileToggle && profileMenu) {
        // Mostrar/ocultar menú al hacer clic en el perfil
        profileToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            profileMenu.classList.toggle('hidden');
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!profileToggle.contains(e.target)) {
                profileMenu.classList.add('hidden');
            }
        });
        
        // Funcionalidad para cerrar sesión
        const logoutButton = profileMenu.querySelector('a:last-child');
        if(logoutButton) {
            logoutButton.addEventListener('click', function(e) {
                e.preventDefault();
                // Aquí irá la lógica de cierre de sesión
                if(confirm('¿Estás seguro que deseas cerrar sesión?')) {
                    alert('Sesión cerrada exitosamente');
                    // Redireccionar a la página de inicio o login
                    window.location.href = '../../index.html';
                }
            });
        }
    }
});

// Inicialización: mostrar todos los productos al cargar
filterProducts('');