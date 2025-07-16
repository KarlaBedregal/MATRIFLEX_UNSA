// Funciones para el dashboard

document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos del usuario
    loadUserData();
    
    // Cargar materias sugeridas
    loadSuggestedSubjects();
    
    // Cargar materias seleccionadas
    loadSelectedSubjects();
    
    // Inicializar tabs
    initializeTabs();
});

// Cargar datos del usuario
function loadUserData() {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
        // Aquí podrías hacer una llamada a la API para obtener los datos del usuario
        console.log('Usuario logueado:', userEmail);
    }
}

// Cargar materias sugeridas
function loadSuggestedSubjects() {
    const subjects = [
        {
            id: 'algebra',
            name: 'Álgebra Lineal',
            credits: 3,
            code: 'MAT200',
            category: 'matematicas',
            prerequisites: ['Álgebra Básica']
        },
        {
            id: 'estructuras',
            name: 'Estructuras Discretas',
            credits: 4,
            code: 'CS202',
            category: 'programacion',
            prerequisites: ['Matemática Discreta']
        },
        {
            id: 'programacion',
            name: 'Programación Avanzada',
            credits: 4,
            code: 'CS204',
            category: 'programacion',
            prerequisites: ['Programación I']
        },
        {
            id: 'calculo',
            name: 'Cálculo Diferencial',
            credits: 4,
            code: 'MAT201',
            category: 'matematicas',
            prerequisites: ['Álgebra']
        },
        {
            id: 'basedatos',
            name: 'Base de Datos',
            credits: 3,
            code: 'CS301',
            category: 'programacion',
            prerequisites: ['Programación II']
        },
        {
            id: 'ingles',
            name: 'Inglés Técnico',
            credits: 2,
            code: 'LAN101',
            category: 'idiomas',
            prerequisites: []
        }
    ];
    
    // Guardar en localStorage para uso posterior
    localStorage.setItem('suggestedSubjects', JSON.stringify(subjects));
    
    // Renderizar materias sugeridas
    renderSuggestedSubjects(subjects);
}

// Renderizar materias sugeridas
function renderSuggestedSubjects(subjects) {
    const container = document.querySelector('#suggested-tab .subjects-table');
    if (!container) return;
    
    const selectedSubjects = JSON.parse(localStorage.getItem('selectedSubjects')) || [];
    const selectedIds = selectedSubjects.map(s => s.id || s.name);
    
    container.innerHTML = subjects.map(subject => `
        <div class="subject-item">
            <input type="checkbox" 
                   id="${subject.id}" 
                   value="${subject.id}"
                   ${selectedIds.includes(subject.id) ? 'checked' : ''}>
            <div class="subject-info">
                <span class="subject-name">${subject.name}</span>
                <span class="subject-details">${subject.credits} créditos / ${subject.code}</span>
                <span class="subject-category">${getCategoryLabel(subject.category)}</span>
            </div>
        </div>
    `).join('');
}

// Obtener etiqueta de categoría
function getCategoryLabel(category) {
    const labels = {
        'matematicas': '📊 Matemáticas',
        'programacion': '💻 Programación',
        'idiomas': '🌍 Idiomas',
        'ciencias': '🔬 Ciencias',
        'general': '📚 General'
    };
    return labels[category] || '📚 General';
}

// Cargar materias seleccionadas
function loadSelectedSubjects() {
    const selectedSubjects = JSON.parse(localStorage.getItem('selectedSubjects')) || [];
    renderSelectedSubjects(selectedSubjects);
}

// Renderizar materias seleccionadas
function renderSelectedSubjects(subjects) {
    const container = document.getElementById('selectedSubjectsList');
    if (!container) return;
    
    if (subjects.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-book-open"></i>
                <p>No hay materias seleccionadas</p>
                <p>Ve a la pestaña "Sugeridas" para seleccionar materias</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="selected-subjects-header">
            <h3>Materias Seleccionadas (${subjects.length})</h3>
            <p>Total de créditos: ${subjects.reduce((sum, s) => sum + (s.credits || 3), 0)}</p>
        </div>
        <div class="selected-subjects-list">
            ${subjects.map(subject => `
                <div class="selected-subject-item">
                    <div class="subject-info">
                        <span class="subject-name">${subject.name || subject}</span>
                        <span class="subject-details">${subject.credits || 3} créditos / ${subject.code || 'N/A'}</span>
                        ${subject.category ? `<span class="subject-category">${getCategoryLabel(subject.category)}</span>` : ''}
                    </div>
                    <button onclick="removeSubject('${subject.id || subject.name}')" class="remove-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('')}
        </div>
        <div class="selected-actions">
            <button onclick="clearAllSubjects()" class="btn-secondary">
                <i class="fas fa-trash"></i> Limpiar Todo
            </button>
            <button onclick="goToScheduleGenerator()" class="btn-primary">
                <i class="fas fa-magic"></i> Generar Horarios
            </button>
        </div>
    `;
}

// Guardar materias seleccionadas
function saveSelectedSubjects() {
    const checkboxes = document.querySelectorAll('#suggested-tab input[type="checkbox"]:checked');
    const suggestedSubjects = JSON.parse(localStorage.getItem('suggestedSubjects')) || [];
    
    const selectedSubjects = [];
    checkboxes.forEach(checkbox => {
        const subject = suggestedSubjects.find(s => s.id === checkbox.value);
        if (subject) {
            selectedSubjects.push(subject);
        }
    });
    
    localStorage.setItem('selectedSubjects', JSON.stringify(selectedSubjects));
    
    // Actualizar vista de materias seleccionadas
    renderSelectedSubjects(selectedSubjects);
    
    // Mostrar mensaje de éxito
    showAlert(`✅ ${selectedSubjects.length} materias seleccionadas guardadas`, 'success');
    
    // Cambiar a la pestaña de seleccionadas
    showTab('selected');
}

// Eliminar materia seleccionada
function removeSubject(subjectId) {
    let selectedSubjects = JSON.parse(localStorage.getItem('selectedSubjects')) || [];
    selectedSubjects = selectedSubjects.filter(s => (s.id || s.name) !== subjectId);
    
    localStorage.setItem('selectedSubjects', JSON.stringify(selectedSubjects));
    renderSelectedSubjects(selectedSubjects);
    
    // Actualizar checkboxes en la pestaña sugeridas
    const checkbox = document.getElementById(subjectId);
    if (checkbox) {
        checkbox.checked = false;
    }
    
    showAlert('Materia eliminada', 'info');
}

// Limpiar todas las materias
function clearAllSubjects() {
    if (confirm('¿Estás seguro de que quieres eliminar todas las materias seleccionadas?')) {
        localStorage.removeItem('selectedSubjects');
        renderSelectedSubjects([]);
        
        // Desmarcar todos los checkboxes
        const checkboxes = document.querySelectorAll('#suggested-tab input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = false);
        
        showAlert('Todas las materias eliminadas', 'info');
    }
}

// Ir al generador de horarios
function goToScheduleGenerator() {
    const selectedSubjects = JSON.parse(localStorage.getItem('selectedSubjects')) || [];
    
    if (selectedSubjects.length === 0) {
        showAlert('Selecciona al menos una materia antes de generar horarios', 'warning');
        return;
    }
    
    window.location.href = 'schedule-generator.html';
}

// Inicializar tabs
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('onclick').match(/'(.+)'/)[1];
            showTab(tabName);
        });
    });
}

// Mostrar tab específico
function showTab(tabName) {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Remover clase active de todos los botones y contenidos
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Activar botón y contenido correspondiente
    const activeButton = document.querySelector(`[onclick="showTab('${tabName}')"]`);
    const activeContent = document.getElementById(`${tabName}-tab`);
    
    if (activeButton) activeButton.classList.add('active');
    if (activeContent) activeContent.classList.add('active');
}

// Mostrar ayuda
function showHelp() {
    const helpModal = document.createElement('div');
    helpModal.className = 'modal-overlay';
    helpModal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>Ayuda - MatriFlex UNSA</h3>
                <button onclick="this.closest('.modal-overlay').remove()" class="modal-close">×</button>
            </div>
            <div class="modal-body">
                <h4>¿Cómo usar MatriFlex?</h4>
                <ol>
                    <li><strong>Selecciona tus materias:</strong> Ve a la sección de gestión de materias y selecciona las que quieres cursar.</li>
                    <li><strong>Configura tus preferencias:</strong> Establece tus horarios disponibles y actividades externas.</li>
                    <li><strong>Genera tu horario:</strong> Usa el generador de horarios para crear opciones optimizadas.</li>
                    <li><strong>Revisa tu historial:</strong> Consulta tu progreso académico cuando lo necesites.</li>
                </ol>
                <h4>Funciones principales:</h4>
                <ul>
                    <li><i class="fas fa-calendar-alt"></i> <strong>Generar Horario:</strong> Crea horarios optimizados automáticamente</li>
                    <li><i class="fas fa-cog"></i> <strong>Preferencias:</strong> Configura tu disponibilidad y restricciones</li>
                    <li><i class="fas fa-history"></i> <strong>Historial:</strong> Revisa tu progreso académico</li>
                </ul>
            </div>
        </div>
    `;
    
    // Estilos para el modal
    helpModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    const modal = helpModal.querySelector('.modal');
    modal.style.cssText = `
        background: white;
        border-radius: 8px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    `;
    
    const modalHeader = helpModal.querySelector('.modal-header');
    modalHeader.style.cssText = `
        padding: 20px;
        border-bottom: 1px solid #dee2e6;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
    
    const modalBody = helpModal.querySelector('.modal-body');
    modalBody.style.cssText = `
        padding: 20px;
    `;
    
    const closeBtn = helpModal.querySelector('.modal-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #6c757d;
    `;
    
    document.body.appendChild(helpModal);
    
    // Cerrar modal al hacer clic fuera
    helpModal.addEventListener('click', function(e) {
        if (e.target === helpModal) {
            helpModal.remove();
        }
    });
}

// Función de alerta mejorada
function showAlert(message, type = 'info') {
    // Crear o encontrar el contenedor de alertas
    let alertContainer = document.querySelector('.alert-container');
    if (!alertContainer) {
        alertContainer = document.createElement('div');
        alertContainer.className = 'alert-container';
        alertContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(alertContainer);
    }
    
    // Crear la alerta
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    
    const colors = {
        success: { bg: '#d4edda', border: '#c3e6cb', text: '#155724' },
        warning: { bg: '#fff3cd', border: '#ffeaa7', text: '#856404' },
        error: { bg: '#f8d7da', border: '#f5c6cb', text: '#721c24' },
        info: { bg: '#d1ecf1', border: '#bee5eb', text: '#0c5460' }
    };
    
    const color = colors[type] || colors.info;
    
    alert.style.cssText = `
        background-color: ${color.bg};
        border: 1px solid ${color.border};
        color: ${color.text};
        padding: 12px 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        min-width: 250px;
        max-width: 400px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 10px;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    const icons = {
        success: '✓',
        warning: '⚠',
        error: '✗',
        info: 'ℹ'
    };
    
    alert.innerHTML = `
        <span style="font-size: 16px; font-weight: bold;">${icons[type] || icons.info}</span>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="
            background: none; 
            border: none; 
            font-size: 18px; 
            cursor: pointer; 
            margin-left: auto;
            color: ${color.text};
            opacity: 0.7;
        ">×</button>
    `;
    
    alertContainer.appendChild(alert);
    
    // Animar entrada
    setTimeout(() => {
        alert.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
        if (alert.parentElement) {
            alert.style.transform = 'translateX(100%)';
            setTimeout(() => alert.remove(), 300);
        }
    }, 5000);
}
