// Funciones para el dashboard

document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos del usuario
    loadUserData();
    
    // Cargar materias sugeridas
    loadSuggestedSubjects();
    
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
            prerequisites: ['Álgebra Básica']
        },
        {
            id: 'estructuras',
            name: 'Estructuras Discretas',
            credits: 4,
            code: 'CS202',
            prerequisites: ['Matemática Discreta']
        },
        {
            id: 'programacion',
            name: 'Programación Avanzada',
            credits: 4,
            code: 'CS204',
            prerequisites: ['Programación I']
        }
    ];
    
    // Guardar en localStorage para uso posterior
    localStorage.setItem('suggestedSubjects', JSON.stringify(subjects));
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

// Guardar materias seleccionadas
function saveSelectedSubjects() {
    const checkboxes = document.querySelectorAll('#suggested-tab input[type="checkbox"]:checked');
    const selectedSubjects = [];
    
    checkboxes.forEach(checkbox => {
        const subjectItem = checkbox.closest('.subject-item');
        const subjectName = subjectItem.querySelector('.subject-name').textContent;
        const subjectDetails = subjectItem.querySelector('.subject-details').textContent;
        
        selectedSubjects.push({
            id: checkbox.id,
            name: subjectName,
            details: subjectDetails
        });
    });
    
    // Guardar en localStorage
    localStorage.setItem('selectedSubjects', JSON.stringify(selectedSubjects));
    
    // Actualizar tab de materias seleccionadas
    updateSelectedSubjectsTab(selectedSubjects);
    
    // Mostrar mensaje de éxito
    showAlert('Materias guardadas exitosamente', 'success');
    
    // Cambiar a tab de seleccionadas
    showTab('selected');
}

// Actualizar tab de materias seleccionadas
function updateSelectedSubjectsTab(subjects) {
    const selectedList = document.getElementById('selectedSubjectsList');
    
    if (subjects.length === 0) {
        selectedList.innerHTML = '<p class="no-subjects">No has seleccionado ninguna materia aún.</p>';
        return;
    }
    
    selectedList.innerHTML = subjects.map(subject => `
        <div class="subject-item selected">
            <div class="subject-info">
                <span class="subject-name">${subject.name}</span>
                <span class="subject-details">${subject.details}</span>
            </div>
            <button onclick="removeSubject('${subject.id}')" class="remove-btn">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

// Remover materia seleccionada
function removeSubject(subjectId) {
    let selectedSubjects = JSON.parse(localStorage.getItem('selectedSubjects')) || [];
    selectedSubjects = selectedSubjects.filter(subject => subject.id !== subjectId);
    
    localStorage.setItem('selectedSubjects', JSON.stringify(selectedSubjects));
    updateSelectedSubjectsTab(selectedSubjects);
    
    // Desmarcar checkbox en el tab de sugeridas
    const checkbox = document.getElementById(subjectId);
    if (checkbox) {
        checkbox.checked = false;
    }
    
    showAlert('Materia removida', 'info');
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

// Cargar materias seleccionadas al inicializar
document.addEventListener('DOMContentLoaded', function() {
    const selectedSubjects = JSON.parse(localStorage.getItem('selectedSubjects')) || [];
    updateSelectedSubjectsTab(selectedSubjects);
    
    // Marcar checkboxes de materias ya seleccionadas
    selectedSubjects.forEach(subject => {
        const checkbox = document.getElementById(subject.id);
        if (checkbox) {
            checkbox.checked = true;
        }
    });
});
