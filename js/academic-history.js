// Funciones para el historial académico

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar filtros
    setupFilters();
    
    // Cargar datos del historial
    loadAcademicHistory();
    
    // Calcular estadísticas
    calculateStatistics();
});

// Configurar filtros
function setupFilters() {
    const searchInput = document.getElementById('searchSubject');
    const statusFilter = document.getElementById('statusFilter');
    
    // Filtro de búsqueda
    searchInput.addEventListener('input', function() {
        filterHistory();
    });
    
    // Filtro de estado
    statusFilter.addEventListener('change', function() {
        filterHistory();
    });
}

// Filtrar historial
function filterHistory() {
    const searchTerm = document.getElementById('searchSubject').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const rows = document.querySelectorAll('.table-row');
    
    rows.forEach(row => {
        const subjectName = row.querySelector('.col-subject').textContent.toLowerCase();
        const subjectCode = row.querySelector('.col-code').textContent.toLowerCase();
        const status = row.getAttribute('data-status');
        
        const matchesSearch = searchTerm === '' || 
                            subjectName.includes(searchTerm) || 
                            subjectCode.includes(searchTerm);
        
        const matchesStatus = statusFilter === 'all' || status === statusFilter;
        
        if (matchesSearch && matchesStatus) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
    
    // Mostrar/ocultar headers de semestre si no hay filas visibles
    updateSemesterHeaders();
}

// Actualizar headers de semestre
function updateSemesterHeaders() {
    const semesterGroups = document.querySelectorAll('.semester-group');
    
    semesterGroups.forEach(group => {
        const visibleRows = group.querySelectorAll('.table-row:not([style*="display: none"])');
        const header = group.querySelector('.semester-header');
        
        if (visibleRows.length === 0) {
            header.style.display = 'none';
        } else {
            header.style.display = '';
        }
    });
}

// Mostrar semestre específico
function showSemester(semester) {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const semesterGroups = document.querySelectorAll('.semester-group');
    
    // Actualizar botones activos
    tabButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    if (semester === 'all') {
        // Mostrar todos los semestres
        semesterGroups.forEach(group => {
            group.style.display = 'block';
        });
    } else {
        // Mostrar solo el semestre seleccionado
        semesterGroups.forEach(group => {
            if (group.getAttribute('data-semester') === semester) {
                group.style.display = 'block';
            } else {
                group.style.display = 'none';
            }
        });
    }
    
    // Aplicar filtros actuales
    filterHistory();
}

// Cargar datos del historial académico
function loadAcademicHistory() {
    const historyData = {
        semesters: [
            {
                id: '2024-1',
                name: '2024-I',
                subjects: [
                    { name: 'Cálculo Diferencial', code: 'MAT201', credits: 4, grade: 4.0, status: 'approved' },
                    { name: 'Programación Orientada a Objetos', code: 'CS205', credits: 4, grade: 3.7, status: 'approved' },
                    { name: 'Base de Datos I', code: 'CS210', credits: 3, grade: 3.9, status: 'approved' },
                    { name: 'Inglés Técnico II', code: 'ENG102', credits: 2, grade: 3.5, status: 'approved' }
                ]
            },
            {
                id: '2023-2',
                name: '2023-II',
                subjects: [
                    { name: 'Estructuras de Datos', code: 'CS203', credits: 4, grade: 3.8, status: 'approved' },
                    { name: 'Análisis de Algoritmos', code: 'CS204', credits: 3, grade: 2.8, status: 'failed' },
                    { name: 'Sistemas Operativos', code: 'CS206', credits: 4, grade: 3.9, status: 'approved' },
                    { name: 'Inglés Técnico I', code: 'ENG101', credits: 2, grade: 3.2, status: 'approved' }
                ]
            }
        ]
    };
    
    // Guardar en localStorage
    localStorage.setItem('academicHistory', JSON.stringify(historyData));
    
    console.log('Historial académico cargado:', historyData);
}

// Calcular estadísticas
function calculateStatistics() {
    const rows = document.querySelectorAll('.table-row');
    let totalSubjects = 0;
    let approvedSubjects = 0;
    let failedSubjects = 0;
    let totalGradePoints = 0;
    let totalCredits = 0;
    let bestGrade = 0;
    
    rows.forEach(row => {
        const grade = parseFloat(row.querySelector('.col-grade').textContent);
        const credits = parseInt(row.querySelector('.col-credits').textContent);
        const status = row.getAttribute('data-status');
        
        totalSubjects++;
        totalGradePoints += grade * credits;
        totalCredits += credits;
        
        if (grade > bestGrade) {
            bestGrade = grade;
        }
        
        if (status === 'approved') {
            approvedSubjects++;
        } else if (status === 'failed') {
            failedSubjects++;
        }
    });
    
    const gpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 0;
    
    // Actualizar estadísticas en la interfaz
    updateStatisticsDisplay({
        gpa: gpa,
        approvedSubjects: approvedSubjects,
        failedSubjects: failedSubjects,
        bestGrade: bestGrade,
        totalCredits: totalCredits
    });
}

// Actualizar display de estadísticas
function updateStatisticsDisplay(stats) {
    // Actualizar resumen principal
    const summaryItems = document.querySelectorAll('.summary-item');
    summaryItems[0].querySelector('.summary-value').textContent = stats.gpa;
    summaryItems[1].querySelector('.summary-value').textContent = stats.totalCredits;
    
    // Actualizar tarjetas de estadísticas
    const statCards = document.querySelectorAll('.stat-card .stat-value');
    statCards[0].textContent = stats.approvedSubjects;
    statCards[1].textContent = stats.failedSubjects;
    statCards[2].textContent = stats.bestGrade.toFixed(1);
}

// Exportar historial académico
function exportHistory() {
    const rows = document.querySelectorAll('.table-row');
    let historyText = `
HISTORIAL ACADÉMICO - MATRIFLEX UNSA
===================================

Estudiante: Julian Perez
Exportado: ${new Date().toLocaleDateString()}

RESUMEN:
--------
Promedio General: ${document.querySelector('.summary-value').textContent}
Créditos Aprobados: ${document.querySelectorAll('.summary-value')[1].textContent}
Materias Aprobadas: ${document.querySelectorAll('.stat-value')[0].textContent}
Materias Reprobadas: ${document.querySelectorAll('.stat-value')[1].textContent}

HISTORIAL DETALLADO:
-------------------
`;
    
    const semesterGroups = document.querySelectorAll('.semester-group');
    
    semesterGroups.forEach(group => {
        const semesterName = group.querySelector('.semester-header h3').textContent;
        const semesterStats = group.querySelector('.semester-stats').textContent;
        
        historyText += `\n${semesterName}\n`;
        historyText += `${semesterStats}\n`;
        historyText += '-'.repeat(50) + '\n';
        
        const rows = group.querySelectorAll('.table-row');
        rows.forEach(row => {
            const subject = row.querySelector('.col-subject').textContent;
            const code = row.querySelector('.col-code').textContent;
            const credits = row.querySelector('.col-credits').textContent;
            const grade = row.querySelector('.col-grade').textContent;
            const status = row.querySelector('.status-badge').textContent;
            
            historyText += `${subject} (${code}) - ${credits} créditos - Nota: ${grade} - ${status}\n`;
        });
    });
    
    historyText += `\n---\nEste historial fue generado automáticamente por MatriFlex UNSA`;
    
    // Crear y descargar archivo
    const blob = new Blob([historyText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'historial_academico_matriflex.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showAlert('Historial académico exportado exitosamente', 'success');
}

// Ver detalles de una materia
function showSubjectDetails(row) {
    const subject = row.querySelector('.col-subject').textContent;
    const code = row.querySelector('.col-code').textContent;
    const credits = row.querySelector('.col-credits').textContent;
    const grade = row.querySelector('.col-grade').textContent;
    const semester = row.querySelector('.col-semester').textContent;
    const status = row.querySelector('.status-badge').textContent;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>Detalles de la Materia</h3>
                <button onclick="this.closest('.modal-overlay').remove()" class="modal-close">×</button>
            </div>
            <div class="modal-body">
                <div class="subject-details">
                    <div class="detail-item">
                        <strong>Materia:</strong> ${subject}
                    </div>
                    <div class="detail-item">
                        <strong>Código:</strong> ${code}
                    </div>
                    <div class="detail-item">
                        <strong>Semestre:</strong> ${semester}
                    </div>
                    <div class="detail-item">
                        <strong>Créditos:</strong> ${credits}
                    </div>
                    <div class="detail-item">
                        <strong>Nota Final:</strong> ${grade}
                    </div>
                    <div class="detail-item">
                        <strong>Estado:</strong> <span class="status-badge ${status.toLowerCase()}">${status}</span>
                    </div>
                </div>
                
                <div class="grade-breakdown">
                    <h4>Desglose de Notas</h4>
                    <div class="grade-item">
                        <span>Parcial 1:</span>
                        <span>3.5</span>
                    </div>
                    <div class="grade-item">
                        <span>Parcial 2:</span>
                        <span>3.8</span>
                    </div>
                    <div class="grade-item">
                        <span>Final:</span>
                        <span>4.0</span>
                    </div>
                    <div class="grade-item">
                        <span>Trabajos:</span>
                        <span>3.9</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    styleModal(modal);
    document.body.appendChild(modal);
}

// Generar reporte de progreso
function generateProgressReport() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>Reporte de Progreso Académico</h3>
                <button onclick="this.closest('.modal-overlay').remove()" class="modal-close">×</button>
            </div>
            <div class="modal-body">
                <div class="progress-report">
                    <div class="progress-section">
                        <h4>Progreso General</h4>
                        <div class="progress-bar-container">
                            <div class="progress-bar" style="width: 85%;">85%</div>
                        </div>
                        <p>Has completado el 85% de tu carrera</p>
                    </div>
                    
                    <div class="progress-section">
                        <h4>Tendencia de Notas</h4>
                        <div class="trend-info">
                            <div class="trend-item positive">
                                <i class="fas fa-arrow-up"></i>
                                <span>Mejorando (+0.3 en el último semestre)</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="progress-section">
                        <h4>Recomendaciones</h4>
                        <ul class="recommendations">
                            <li>Considera retomar "Análisis de Algoritmos" el próximo semestre</li>
                            <li>Tu rendimiento en matemáticas es excelente, considera materias avanzadas</li>
                            <li>Mantén el buen trabajo en programación</li>
                        </ul>
                    </div>
                </div>
                <button onclick="exportProgressReport()" class="btn-primary">Exportar Reporte</button>
            </div>
        </div>
    `;
    
    styleModal(modal);
    document.body.appendChild(modal);
}

// Aplicar estilos al modal
function styleModal(modal) {
    modal.style.cssText = `
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
    
    const modalContent = modal.querySelector('.modal');
    modalContent.style.cssText = `
        background: white;
        border-radius: 8px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    `;
    
    const modalHeader = modal.querySelector('.modal-header');
    modalHeader.style.cssText = `
        padding: 20px;
        border-bottom: 1px solid #dee2e6;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
    
    const modalBody = modal.querySelector('.modal-body');
    modalBody.style.cssText = `
        padding: 20px;
    `;
    
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #6c757d;
    `;
    
    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Agregar eventos de clic a las filas para mostrar detalles
document.addEventListener('DOMContentLoaded', function() {
    const rows = document.querySelectorAll('.table-row');
    rows.forEach(row => {
        row.style.cursor = 'pointer';
        row.addEventListener('click', function() {
            showSubjectDetails(this);
        });
    });
});

// Generar gráfico de progreso (simulado)
function generateProgressChart() {
    // Esta función podría integrar una librería de gráficos como Chart.js
    console.log('Generando gráfico de progreso...');
    showAlert('Funcionalidad de gráficos próximamente disponible', 'info');
}
