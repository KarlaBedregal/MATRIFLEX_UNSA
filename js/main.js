// Funciones principales para login y registro

// Función para alternar visibilidad de contraseña
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
}

// Manejo del formulario de login
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Validación básica
            if (!email || !password) {
                showAlert('Por favor completa todos los campos', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showAlert('Por favor ingresa un email válido', 'error');
                return;
            }
            
            // Simular login
            showAlert('Iniciando sesión...', 'info');
            
            setTimeout(() => {
                // Guardar datos de sesión
                localStorage.setItem('userLoggedIn', 'true');
                localStorage.setItem('userEmail', email);
                
                // Redirigir al dashboard
                window.location.href = 'dashboard.html';
            }, 1500);
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const cui = document.getElementById('cui').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validaciones
            if (!firstName || !lastName || !email || !cui || !password || !confirmPassword) {
                showAlert('Por favor completa todos los campos', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showAlert('Por favor ingresa un email válido', 'error');
                return;
            }
            
            if (password.length < 6) {
                showAlert('La contraseña debe tener al menos 6 caracteres', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showAlert('Las contraseñas no coinciden', 'error');
                return;
            }
            
            // Simular registro
            showAlert('Registrando usuario...', 'info');
            
            setTimeout(() => {
                showAlert('Registro exitoso. Redirigiendo al login...', 'success');
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            }, 1500);
        });
    }
});

// Función para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para mostrar alertas
function showAlert(message, type) {
    // Remover alertas existentes
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" class="alert-close">×</button>
    `;
    
    // Estilos para la alerta
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#17a2b8'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease-out;
    `;
    
    const closeBtn = alert.querySelector('.alert-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        margin-left: 10px;
    `;
    
    document.body.appendChild(alert);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (alert.parentElement) {
            alert.remove();
        }
    }, 5000);
}

// Agregar estilos CSS para animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Verificar si el usuario está logueado
function checkAuth() {
    const userLoggedIn = localStorage.getItem('userLoggedIn');
    const currentPage = window.location.pathname.split('/').pop();
    
    if (!userLoggedIn && currentPage !== 'index.html' && currentPage !== 'register.html' && currentPage !== '') {
        window.location.href = 'index.html';
    }
}

// Función para cerrar sesión
function logout() {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userEmail');
    window.location.href = 'index.html';
}

// Ejecutar verificación de autenticación al cargar la página
document.addEventListener('DOMContentLoaded', checkAuth);
