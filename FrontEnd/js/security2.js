// security.js - Implementación de reCAPTCHA v3 para el sistema de gestión de restaurantes

// Contador de acciones por tipo
const actionCounter = {
    create: 0,
    update: 0,
    delete: 0,
    lastReset: Date.now()
};

// Configuración de límites para activar reCAPTCHA
const LIMITS = {
    CREATE_THRESHOLD: 10, // 10 creaciones rápidas
    UPDATE_THRESHOLD: 15, // 15 actualizaciones rápidas
    DELETE_THRESHOLD: 5,  // 5 eliminaciones rápidas
    TIME_WINDOW: 5 * 60 * 1000 // 5 minutos en milisegundos
};

// Flag para saber si reCAPTCHA está activo
let recaptchaRequired = false;

// Clave del sitio para reCAPTCHA
const RECAPTCHA_SITE_KEY = '6Lcy8x4rAAAAAF9pwwJcUP6VSYvPkS9z5k-WrZ4y'; // Reemplazar con tu clave real

// Función para incrementar contadores
function trackAction(actionType) {
    // Resetear contadores si ha pasado el tiempo de ventana
    if (Date.now() - actionCounter.lastReset > LIMITS.TIME_WINDOW) {
        resetCounters();
    }
    
    // Incrementar el contador apropiado
    if (actionType in actionCounter) {
        actionCounter[actionType]++;
    }
    
    // Verificar si debemos activar reCAPTCHA
    checkLimits();
}

// Resetear contadores
function resetCounters() {
    actionCounter.create = 0;
    actionCounter.update = 0;
    actionCounter.delete = 0;
    actionCounter.lastReset = Date.now();
    
    // Desactivar reCAPTCHA si estaba requerido
    recaptchaRequired = false;
}

// Verificar si se excedieron los límites
function checkLimits() {
    if (actionCounter.create >= LIMITS.CREATE_THRESHOLD ||
        actionCounter.update >= LIMITS.UPDATE_THRESHOLD ||
        actionCounter.delete >= LIMITS.DELETE_THRESHOLD) {
        
        recaptchaRequired = true;
        showInfo('Se ha detectado actividad inusual. Se requerirá una verificación adicional para continuar.');
    }
}

// Obtener token de reCAPTCHA v3
async function getRecaptchaToken(action) {
    return new Promise((resolve, reject) => {
        if (typeof grecaptcha === 'undefined') {
            reject(new Error('reCAPTCHA no está cargado'));
            return;
        }
        
        grecaptcha.ready(() => {
            try {
                grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: action })
                    .then(token => resolve(token))
                    .catch(error => reject(error));
            } catch (error) {
                reject(error);
            }
        });
    });
}

// Verificar el token de reCAPTCHA en el servidor
async function verifyRecaptchaToken(token) {
    try {
        const response = await fetch(`${API_BASE_URL}/recaptcha/verify`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token })
        });
        
        if (!response.ok) {
            throw new Error('Error al verificar reCAPTCHA');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error al verificar reCAPTCHA:', error);
        return { success: false };
    }
}

// Verificar reCAPTCHA antes de enviar el formulario
async function verifyRecaptchaBeforeAction(actionName) {
    // Si no es requerido, permitir la acción
    if (!recaptchaRequired) {
        return true;
    }
    
    try {
        showLoading();
        
        // Obtener token de reCAPTCHA
        const token = await getRecaptchaToken(actionName);
        
        // Verificar token en el servidor
        const result = await verifyRecaptchaToken(token);
        
        if (result.success) {
            // Si la verificación es exitosa, resetear los contadores
            resetCounters();
            return true;
        } else {
            showError('No se pudo verificar que eres humano. Por favor, intenta de nuevo.');
            return false;
        }
    } catch (error) {
        showError('Error en la verificación de seguridad: ' + error.message);
        return false;
    } finally {
        hideLoading();
    }
}

// Mostrar mensaje informativo
function showInfo(message) {
    // Crear alerta de información si no existe
    let infoAlert = document.getElementById('infoAlert');
    if (!infoAlert) {
        infoAlert = document.createElement('div');
        infoAlert.id = 'infoAlert';
        infoAlert.className = 'alert alert-info';
        
        // Insertar después de las alertas existentes
        const successAlert = document.getElementById('successAlert');
        successAlert.parentNode.insertBefore(infoAlert, successAlert.nextSibling);
    }
    
    infoAlert.textContent = message;
    infoAlert.classList.add('active');
    
    setTimeout(() => {
        infoAlert.classList.remove('active');
    }, 5000);
}

// Aplicar verificación a las acciones principales
async function applyRecaptchaVerification() {
    // Empleados
    const originalHandleEmployeeFormSubmit = handleEmployeeFormSubmit;
    window.handleEmployeeFormSubmit = async function(event) {
        event.preventDefault();
        
        const id = document.getElementById('employeeId').value;
        const action = id ? 'employee_update' : 'employee_create';
        trackAction(id ? 'update' : 'create');
        
        if (await verifyRecaptchaBeforeAction(action)) {
            return await originalHandleEmployeeFormSubmit.call(this, event);
        }
        
        return false;
    };
    
    // Platos
    const originalHandleDishFormSubmit = handleDishFormSubmit;
    window.handleDishFormSubmit = async function(event) {
        event.preventDefault();
        
        const id = document.getElementById('dishId').value;
        const action = id ? 'dish_update' : 'dish_create';
        trackAction(id ? 'update' : 'create');
        
        if (await verifyRecaptchaBeforeAction(action)) {
            return await originalHandleDishFormSubmit.call(this, event);
        }
        
        return false;
    };
    
    // Clientes
    const originalHandleClientFormSubmit = handleClientFormSubmit;
    window.handleClientFormSubmit = async function(event) {
        event.preventDefault();
        
        const id = document.getElementById('clientId').value;
        const action = id ? 'client_update' : 'client_create';
        trackAction(id ? 'update' : 'create');
        
        if (await verifyRecaptchaBeforeAction(action)) {
            return await originalHandleClientFormSubmit.call(this, event);
        }
        
        return false;
    };
    
    // Órdenes
    const originalHandleOrderFormSubmit = handleOrderFormSubmit;
    window.handleOrderFormSubmit = async function(event) {
        event.preventDefault();
        
        const id = document.getElementById('orderId').value;
        const action = id ? 'order_update' : 'order_create';
        trackAction(id ? 'update' : 'create');
        
        if (await verifyRecaptchaBeforeAction(action)) {
            return await originalHandleOrderFormSubmit.call(this, event);
        }
        
        return false;
    };
    
    // Eliminación
    const originalConfirmDelete = confirmDelete;
    window.confirmDelete = async function() {
        trackAction('delete');
        
        if (await verifyRecaptchaBeforeAction('delete')) {
            return await originalConfirmDelete.call(this);
        }
        
        return false;
    };
}

// Cargar reCAPTCHA v3
function loadRecaptchaScript() {
    if (!document.querySelector('script[src*="recaptcha/api.js"]')) {
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
        
        // Verificar si se cargó correctamente
        script.onload = () => {
            console.log('reCAPTCHA cargado correctamente');
            
            // Inicializar reCAPTCHA
            setTimeout(() => {
                if (typeof grecaptcha !== 'undefined') {
                    grecaptcha.ready(() => {
                        console.log('reCAPTCHA está listo');
                    });
                }
            }, 1000);
        };
        
        script.onerror = () => {
            console.error('Error al cargar reCAPTCHA');
        };
    }
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    // Cargar el script de reCAPTCHA
    loadRecaptchaScript();
    
    // Esperar a que los scripts originales estén cargados
    // y luego aplicar verificación
    setTimeout(() => {
        if (typeof handleEmployeeFormSubmit === 'function') {
            applyRecaptchaVerification();
            console.log('Verificación reCAPTCHA aplicada a los formularios');
        } else {
            console.error('No se encontraron los manejadores de formularios');
        }
    }, 1000);
});

// Exportar funciones para uso en otros archivos
window.securityUtils = {
    trackAction,
    resetCounters,
    verifyRecaptchaBeforeAction,
    getRecaptchaToken
};