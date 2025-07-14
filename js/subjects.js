// Funciones para la gestión de materias

document.addEventListener('DOMContentLoaded', function() {
    // Cargar materias disponibles
    loadAvailableSubjects();
    
    // Configurar eventos de checkbox
    setupCheckboxEvents();
    
    // Cargar materias ya seleccionadas
    loadSelectedSubjects();
});

// Cargar materias disponibles
function loadAvailableSubjects() {
    const subjects = [
        {
            id: 'algebra',
            name: 'Álgebra',
            code: 'AE010',
            credits: 3,
            prerequisites: ['Álgebra']
        },
        {
            id: 'fisica',
            name: 'Física I',
            code: 'FS101',
            credits: 3,
            prerequisites: []
        },
        {
            id: 'estructuras',
            name: 'Estructuras Discretas',
            code: 'EC501',
            credits: 3,
            prerequisites: ['Álgebra']
        },
        {
            id: 'computacion',
            name: 'Introducción a la Computación',
            code: 'AC001',
            credits: 3,
            prerequisites: []
        },
        {
            id: 'programacion',
            name: 'Programación I',
            code: 'AB101',
            credits: 3,
            prerequisites: []
        }
    ];
    
    // Guardar en localStorage para uso posterior
    localStorage.setItem('availableSubjects', JSON.stringify(subjects));
    
    console.log('Materias disponibles cargadas:', subjects);
}

// Configurar eventos de checkbox
function setupCheckboxEvents() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateSubjectSelection(this);
        });
    });
}

// Actualizar selección de materias
function updateSubjectSelection(checkbox) {
    const row = checkbox.closest('.table-row');
    const subjectData = {
        id: checkbox.id,
        name: row.querySelector('.col-name').textContent,
        code: row.querySelector('.col-code').textContent,
        credits: parseInt(row.querySelector('.col-credits').textContent),
        prerequisites: row.querySelector('.col-prerequisites').textContent
    };
    
    let selectedSubjects = JSON.parse(localStorage.getItem('selectedSubjects')) || [];
    
    if (checkbox.checked) {
        // Verificar prerrequisitos
        if (subjectData.prerequisites && !checkPrerequisites(subjectData.prerequisites)) {
            checkbox.checked = false;
            showAlert(`No cumples con los prerrequisitos para ${subjectData.name}`, 'warning');
            return;
        }
        
        // Verificar límite de créditos
        const totalCredits = selectedSubjects.reduce((sum, subject) => sum + subject.credits, 0);
        if (totalCredits + subjectData.credits > 20) { // Límite ejemplo de 20 créditos
            checkbox.checked = false;
            showAlert('Excederías el límite máximo de créditos (20)', 'warning');
            return;
        }
        
        // Agregar materia
        selectedSubjects.push(subjectData);
        row.classList.add('selected');
        
        showAlert(`${subjectData.name} agregada`, 'success');
    } else {
        // Remover materia
        selectedSubjects = selectedSubjects.filter(subject => subject.id !== subjectData.id);
        row.classList.remove('selected');
        
        showAlert(`${subjectData.name} removida`, 'info');
    }
    
    localStorage.setItem('selectedSubjects', JSON.stringify(selectedSubjects));
    updateCreditsCounter();
}

// Verificar prerrequisitos
function checkPrerequisites(prerequisites) {
    if (!prerequisites || prerequisites.trim() === '') {
        return true;
    }
    
    // Simulación de verificación de prerrequisitos
    // En una aplicación real, esto se verificaría contra el historial académico del estudiante
    const completedSubjects = JSON.parse(localStorage.getItem('completedSubjects')) || [
        'Álgebra Básica',
        'Matemática Elemental'
    ];
    
    const requiredSubjects = prerequisites.split(',').map(s => s.trim());
    
    return requiredSubjects.every(req => 
        completedSubjects.some(completed => 
            completed.toLowerCase().includes(req.toLowerCase())
        )
    );
}

// Cargar materias ya seleccionadas
function loadSelectedSubjects() {
    const selectedSubjects = JSON.parse(localStorage.getItem('selectedSubjects')) || [];
    
    selectedSubjects.forEach(subject => {
        const checkbox = document.getElementById(subject.id);
        if (checkbox) {
            checkbox.checked = true;
            checkbox.closest('.table-row').classList.add('selected');
        }
    });
    
    updateCreditsCounter();
}

// Actualizar contador de créditos
function updateCreditsCounter() {
    const selectedSubjects = JSON.parse(localStorage.getItem('selectedSubjects')) || [];
    const totalCredits = selectedSubjects.reduce((sum, subject) => sum + subject.credits, 0);
    
    // Crear o actualizar contador si no existe
    let counter = document.querySelector('.credits-counter');
    if (!counter) {
        counter = document.createElement('div');
        counter.className = 'credits-counter';
        
        const header = document.querySelector('.subjects-section h2');
        header.parentNode.insertBefore(counter, header.nextSibling);
    }
    
    counter.innerHTML = `
        <div class="credits-info">
            <span class="credits-current">${totalCredits}</span>
            <span class="credits-separator">/</span>
            <span class="credits-max">20</span>
            <span class="credits-label">créditos</span>
        </div>
        <div class="credits-progress">
            <div class="credits-bar" style="width: ${(totalCredits / 20) * 100}%"></div>
        </div>
    `;
    
    // Aplicar estilos
    counter.style.cssText = `
        background: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
        margin: 15px 0;
        border-left: 4px solid #4f75ff;
    `;
    
    const creditsInfo = counter.querySelector('.credits-info');
    creditsInfo.style.cssText = `
        display: flex;
        align-items: center;
        gap: 5px;
        margin-bottom: 10px;
        font-weight: 600;
    `;
    
    const creditsProgress = counter.querySelector('.credits-progress');
    creditsProgress.style.cssText = `
        height: 8px;
        background: #e9ecef;
        border-radius: 4px;
        overflow: hidden;
    `;
    
    const creditsBar = counter.querySelector('.credits-bar');
    creditsBar.style.cssText = `
        height: 100%;
        background: ${totalCredits > 20 ? '#dc3545' : '#4f75ff'};
        transition: width 0.3s ease, background-color 0.3s ease;
    `;
}

// Seleccionar todas las materias
function selectAllSubjects() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:not(:checked)');
    
    checkboxes.forEach(checkbox => {
        // Simular clic para activar validaciones
        checkbox.click();
    });
}

// Deseleccionar todas las materias
function deselectAllSubjects() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    
    checkboxes.forEach(checkbox => {
        checkbox.click();
    });
}

// Filtrar materias por criterio
function filterSubjects(criteria) {
    const rows = document.querySelectorAll('.table-row');
    
    rows.forEach(row => {
        const subjectName = row.querySelector('.col-name').textContent.toLowerCase();
        const subjectCode = row.querySelector('.col-code').textContent.toLowerCase();
        
        if (criteria === '' || 
            subjectName.includes(criteria.toLowerCase()) || 
            subjectCode.includes(criteria.toLowerCase())) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Agregar barra de búsqueda
function addSearchBar() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" id="subjectSearch" placeholder="Buscar materias por nombre o código...">
            <button onclick="clearSearch()" class="clear-search">×</button>
        </div>
        <div class="filter-buttons">
            <button onclick="selectAllSubjects()" class="btn-filter">Seleccionar Todas</button>
            <button onclick="deselectAllSubjects()" class="btn-filter">Deseleccionar Todas</button>
            <button onclick="showRecommendations()" class="btn-filter">Ver Recomendaciones</button>
        </div>
    `;
    
    const subjectsSection = document.querySelector('.subjects-section');
    const table = document.querySelector('.subjects-table');
    subjectsSection.insertBefore(searchContainer, table);
    
    // Configurar evento de búsqueda
    const searchInput = document.getElementById('subjectSearch');
    searchInput.addEventListener('input', function() {
        filterSubjects(this.value);
    });
    
    // Estilos para la barra de búsqueda
    searchContainer.style.cssText = `
        margin-bottom: 20px;
    `;
    
    const searchBox = searchContainer.querySelector('.search-box');
    searchBox.style.cssText = `
        position: relative;
        margin-bottom: 15px;
    `;
    
    const searchIcon = searchContainer.querySelector('.fa-search');
    searchIcon.style.cssText = `
        position: absolute;
        left: 15px;
        top: 50%;
        transform: translateY(-50%);
        color: #6c757d;
        z-index: 1;
    `;
    
    searchInput.style.cssText = `
        width: 100%;
        padding: 12px 15px 12px 45px;
        border: 2px solid #dee2e6;
        border-radius: 8px;
        font-size: 14px;
    `;
    
    const clearBtn = searchContainer.querySelector('.clear-search');
    clearBtn.style.cssText = `
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: #6c757d;
    `;
    
    const filterButtons = searchContainer.querySelector('.filter-buttons');
    filterButtons.style.cssText = `
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
    `;
}

// Limpiar búsqueda
function clearSearch() {
    document.getElementById('subjectSearch').value = '';
    filterSubjects('');
}

// Mostrar recomendaciones
function showRecommendations() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>Recomendaciones Académicas</h3>
                <button onclick="this.closest('.modal-overlay').remove()" class="modal-close">×</button>
            </div>
            <div class="modal-body">
                <h4>Basado en tu perfil académico, te recomendamos:</h4>
                <div class="recommendation-list">
                    <div class="recommendation-item">
                        <i class="fas fa-star"></i>
                        <div>
                            <strong>Álgebra</strong>
                            <p>Materia fundamental para carreras de ingeniería</p>
                        </div>
                    </div>
                    <div class="recommendation-item">
                        <i class="fas fa-star"></i>
                        <div>
                            <strong>Programación I</strong>
                            <p>Ideal para comenzar en ciencias de la computación</p>
                        </div>
                    </div>
                    <div class="recommendation-item">
                        <i class="fas fa-star"></i>
                        <div>
                            <strong>Física I</strong>
                            <p>Excelente base para materias avanzadas</p>
                        </div>
                    </div>
                </div>
                <button onclick="applyRecommendations()" class="btn-primary">Aplicar Recomendaciones</button>
            </div>
        </div>
    `;
    
    styleModal(modal);
    document.body.appendChild(modal);
}

// Aplicar recomendaciones
function applyRecommendations() {
    const recommendedSubjects = ['algebra', 'programacion', 'fisica'];
    
    recommendedSubjects.forEach(subjectId => {
        const checkbox = document.getElementById(subjectId);
        if (checkbox && !checkbox.checked) {
            checkbox.click();
        }
    });
    
    document.querySelector('.modal-overlay').remove();
    showAlert('Recomendaciones aplicadas', 'success');
}

// Exportar lista de materias seleccionadas
function exportSelectedSubjects() {
    const selectedSubjects = JSON.parse(localStorage.getItem('selectedSubjects')) || [];
    
    if (selectedSubjects.length === 0) {
        showAlert('No hay materias seleccionadas para exportar', 'warning');
        return;
    }
    
    const subjectsText = `
MATERIAS SELECCIONADAS - MATRIFLEX UNSA
======================================

Exportado: ${new Date().toLocaleDateString()}

MATERIAS:
${selectedSubjects.map(subject => 
    `• ${subject.name} (${subject.code}) - ${subject.credits} créditos`
).join('\n')}

TOTAL DE CRÉDITOS: ${selectedSubjects.reduce((sum, subject) => sum + subject.credits, 0)}

---
Esta lista fue generada en MatriFlex UNSA
    `.trim();
    
    // Crear y descargar archivo
    const blob = new Blob([subjectsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'materias_seleccionadas.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showAlert('Lista de materias exportada', 'success');
}

// Inicializar funcionalidades adicionales
document.addEventListener('DOMContentLoaded', function() {
    // Agregar barra de búsqueda después de un breve delay
    setTimeout(addSearchBar, 500);
});
