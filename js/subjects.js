// Funciones para la gestión de materias

document.addEventListener('DOMContentLoaded', function() {
    // Cargar materias disponibles
    loadAvailableSubjects();
    
    // Configurar eventos de checkbox
    setupCheckboxEvents();
    
    // Cargar materias ya seleccionadas
    loadSelectedSubjects();
    
    // Configurar botón de guardar
    setupSaveButton();
});

// Configurar botón de guardar
function setupSaveButton() {
    const saveBtn = document.querySelector('.save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveSelectedSubjects);
    }
}

// Guardar materias seleccionadas
function saveSelectedSubjects() {
    const selectedCheckboxes = document.querySelectorAll('.subject-checkbox:checked');
    const selectedSubjects = Array.from(selectedCheckboxes).map(checkbox => {
        const card = checkbox.closest('.subject-card');
        return {
            id: checkbox.value,
            name: card.querySelector('h3').textContent,
            code: card.querySelector('.subject-code').textContent,
            credits: parseInt(card.querySelector('.subject-credits').textContent),
            category: card.dataset.category || 'general'
        };
    });
    
    // Guardar en localStorage
    localStorage.setItem('selectedSubjects', JSON.stringify(selectedSubjects));
    
    // Mostrar mensaje de confirmación
    showAlert(`¡Se guardaron ${selectedSubjects.length} materias seleccionadas!`, 'success');
    
    // Actualizar contador en la interfaz
    updateSelectedCount();
    
    console.log('Materias guardadas:', selectedSubjects);
}

// Actualizar contador de materias seleccionadas
function updateSelectedCount() {
    const selectedCheckboxes = document.querySelectorAll('.subject-checkbox:checked');
    const countElement = document.querySelector('.selected-count');
    
    if (countElement) {
        countElement.textContent = `${selectedCheckboxes.length} materias seleccionadas`;
    }
    
    // Actualizar también en el botón de guardar
    const saveBtn = document.querySelector('.save-btn');
    if (saveBtn) {
        if (selectedCheckboxes.length > 0) {
            saveBtn.textContent = `Guardar ${selectedCheckboxes.length} materias`;
            saveBtn.disabled = false;
        } else {
            saveBtn.textContent = 'Selecciona materias primero';
            saveBtn.disabled = true;
        }
    }
}

// Configurar eventos de checkbox mejorado
function setupCheckboxEvents() {
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('subject-checkbox')) {
            updateSelectedCount();
            
            // Añadir efecto visual al card
            const card = e.target.closest('.subject-card');
            if (e.target.checked) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
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
