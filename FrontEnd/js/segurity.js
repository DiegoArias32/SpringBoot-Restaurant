document.addEventListener('DOMContentLoaded', function () {
    // ✅ Tab switching (Login & Register)
    document.getElementById('login-tab').addEventListener('click', function () {
        document.getElementById('login-tab').classList.add('active');
        document.getElementById('register-tab').classList.remove('active');
        document.getElementById('register-tab').classList.add('bg-gray-200', 'text-gray-700');
        document.getElementById('login-form').classList.remove('hidden');
        document.getElementById('register-form').classList.add('hidden');
    });

    document.getElementById('register-tab').addEventListener('click', function () {
        document.getElementById('register-tab').classList.add('active');
        document.getElementById('login-tab').classList.remove('active');
        document.getElementById('login-tab').classList.add('bg-gray-200', 'text-gray-700');
        document.getElementById('register-form').classList.remove('hidden');
        document.getElementById('login-form').classList.add('hidden');
    });

    // ✅ Role selection (Client & Staff)
    document.getElementById('role-client').addEventListener('click', function () {
        this.classList.add('active');
        document.getElementById('role-staff').classList.remove('active');
        document.getElementById('staff-fields').classList.add('hidden');
        document.getElementById('register-client-btn').classList.remove('hidden');
        document.getElementById('register-staff-btn').classList.add('hidden');
    });

    document.getElementById('role-staff').addEventListener('click', function () {
        this.classList.add('active');
        document.getElementById('role-client').classList.remove('active');
        document.getElementById('staff-fields').classList.remove('hidden');
        document.getElementById('register-client-btn').classList.add('hidden');
        document.getElementById('register-staff-btn').classList.remove('hidden');
    });

    // ✅ Password visibility toggle
    document.getElementById('toggle-password').addEventListener('click', function () {
        togglePasswordVisibility('password', this);
    });

    document.getElementById('toggle-register-password').addEventListener('click', function () {
        togglePasswordVisibility('register-password', this);
    });

    function togglePasswordVisibility(inputId, toggleButton) {
        const passwordInput = document.getElementById(inputId);
        const icon = toggleButton.querySelector('i');

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }

    // ✅ Login Form Submission
    document.getElementById('login-form').addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const isStaff = email.includes('staff') || email.includes('admin');

        Swal.fire({
            title: 'Iniciando sesión...',
            text: 'Por favor, espera un momento.',
            icon: 'info',
            showConfirmButton: false,
            timer: 2000
        }).then(() => {
            if (isStaff) {
                window.location.href = '../sistema de gestion/welcome.html';
            } else {
                window.location.href = '../menu/menu.html';
            }
        });
    });

    // ✅ Register Form Submission
    document.getElementById('register-form').addEventListener('submit', function (e) {
        e.preventDefault();

        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password !== confirmPassword) {
            Swal.fire({
                title: 'Error',
                text: 'Las contraseñas no coinciden',
                icon: 'error',
                confirmButtonText: 'Intentar de nuevo'
            });
            return;
        }

        const isStaff = document.getElementById('role-staff').classList.contains('active');

        if (isStaff) {
            Swal.fire({
                title: 'Registro Enviado',
                text: 'Su solicitud de cuenta de personal ha sido enviada. Espere la aprobación.',
                icon: 'info',
                confirmButtonText: 'Entendido'
            });
        } else {
            Swal.fire({
                title: 'Registro Exitoso',
                text: 'Redirigiendo a productos...',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000
            }).then(() => {
                window.location.href = 'productos.html';
            });
        }
    });
});
