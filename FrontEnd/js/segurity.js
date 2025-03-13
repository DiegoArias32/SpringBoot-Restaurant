        // Tab switching
        document.getElementById('login-tab').addEventListener('click', function() {
            document.getElementById('login-tab').classList.add('active');
            document.getElementById('register-tab').classList.remove('active');
            document.getElementById('register-tab').classList.add('bg-gray-200', 'text-gray-700');
            document.getElementById('login-form').classList.remove('hidden');
            document.getElementById('register-form').classList.add('hidden');
        });

        document.getElementById('register-tab').addEventListener('click', function() {
            document.getElementById('register-tab').classList.add('active');
            document.getElementById('login-tab').classList.remove('active');
            document.getElementById('login-tab').classList.add('bg-gray-200', 'text-gray-700');
            document.getElementById('register-form').classList.remove('hidden');
            document.getElementById('login-form').classList.add('hidden');
        });

        // Role selection
        document.getElementById('role-client').addEventListener('click', function() {
            this.classList.add('active');
            document.getElementById('role-staff').classList.remove('active');
            document.getElementById('staff-fields').classList.add('hidden');
            document.getElementById('register-client-btn').classList.remove('hidden');
            document.getElementById('register-staff-btn').classList.add('hidden');
        });

        document.getElementById('role-staff').addEventListener('click', function() {
            this.classList.add('active');
            document.getElementById('role-client').classList.remove('active');
            document.getElementById('staff-fields').classList.remove('hidden');
            document.getElementById('register-client-btn').classList.add('hidden');
            document.getElementById('register-staff-btn').classList.remove('hidden');
        });

        // Password visibility toggle
        document.getElementById('toggle-password').addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });

        document.getElementById('toggle-register-password').addEventListener('click', function() {
            const passwordInput = document.getElementById('register-password');
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });

// Modifica la función de manejo del formulario de inicio de sesión
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // En un caso real, enviarías estos datos al servidor y el servidor te indicaría
    // qué tipo de usuario es. Para esta demostración, usaremos una verificación simple.
    const email = document.getElementById('email').value;
    
    // Suponemos que los correos que contienen "staff" o "admin" son personal
    // y el resto son clientes. En producción, esto se verificaría en el servidor.
    const isStaff = email.includes('staff') || email.includes('admin');
    
    if (isStaff) {
        // Redirigir al sistema de gestión para personal
        window.location.href = '../sistema de gestion/welcome.html';
    } else {
        // Redirigir a la página de productos para clientes
        window.location.href = '../menu/menu.html';
    }
    
    // Puedes mostrar un mensaje de carga mientras se procesa
    alert('Iniciando sesión...');
});

document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Simple password validation
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }
    
    // Get role
    const isStaff = document.getElementById('role-staff').classList.contains('active');
    
    // Después de un registro exitoso, redirige según el rol
    if (isStaff) {
        // En un caso real, probablemente el personal necesitaría aprobación
        // antes de acceder, así que podrías mostrar un mensaje diferente
        alert('Su solicitud de cuenta de personal ha sido enviada. Por favor, espere la aprobación.');
        // Opcionalmente, redirigir a una página de confirmación
        // window.location.href = 'confirmacion-personal.html';
    } else {
        // Redirigir directamente a la página de productos para clientes
        alert('Registro exitoso. Redirigiendo a productos...');
        window.location.href = 'productos.html';
    }
});