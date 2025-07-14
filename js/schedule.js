// Funciones para el generador de horarios

document.addEventListener('DOMContentLoaded', function() {
    // Cargar preferencias del usuario
    loadUserPreferences();
    
    // Cargar materias seleccionadas
    loadSelectedSubjects();
});

// Generar horarios
function generateSchedule() {
    const generateBtn = document.querySelector('.generate-btn');
    generateBtn.textContent = 'Generando...';
    generateBtn.disabled = true;
    
    // Simular procesamiento
    setTimeout(() => {
        // Mostrar el horario generado
        showGeneratedSchedule();
        
        generateBtn.textContent = 'Generate Schedules';
        generateBtn.disabled = false;
        
        showAlert('Horario generado exitosamente', 'success');
    }, 2000);
}

// Mostrar horario generado
function showGeneratedSchedule() {
    const scheduleSection = document.querySelector('.schedule-section');
    scheduleSection.style.display = 'block';
    
    // Animar la aparición
    scheduleSection.style.opacity = '0';
    scheduleSection.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        scheduleSection.style.transition = 'all 0.5s ease';
        scheduleSection.style.opacity = '1';
        scheduleSection.style.transform = 'translateY(0)';
    }, 100);
}

// Cargar materias seleccionadas
function loadSelectedSubjects() {
    const selectedSubjects = JSON.parse(localStorage.getItem('selectedSubjects')) || [];
    
    if (selectedSubjects.length === 0) {
        showAlert('No has seleccionado materias. Ve al dashboard para seleccionar materias.', 'warning');
        return;
    }
    
    console.log('Materias seleccionadas:', selectedSubjects);
}

// Cargar preferencias del usuario
function loadUserPreferences() {
    const preferences = JSON.parse(localStorage.getItem('userPreferences')) || {
        availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        blockedTimes: [],
        externalActivities: []
    };
    
    console.log('Preferencias del usuario:', preferences);
}

// Elegir horario
function chooseSchedule() {
    const confirmation = confirm('¿Estás seguro de que quieres seleccionar este horario?');
    
    if (confirmation) {
        // Guardar horario seleccionado
        const selectedSchedule = {
            id: Date.now(),
            courses: [
                {
                    name: 'Math 201',
                    time: '6:00 AM - 9:50 AM',
                    day: 'Monday',
                    color: 'math'
                },
                {
                    name: 'History 101',
                    time: '10:00 A - 11:15 AM',
                    day: 'Thursday',
                    color: 'history'
                },
                {
                    name: 'Chemistry 202',
                    time: '11:00 A - 11:50 AM',
                    day: 'Tuesday',
                    color: 'chemistry'
                },
                {
                    name: 'Comp Sess 150',
                    time: '1:00 P - 2:15 PM',
                    day: 'Friday',
                    color: 'comp-sci'
                }
            ],
            createdAt: new Date().toISOString()
        };
        
        localStorage.setItem('currentSchedule', JSON.stringify(selectedSchedule));
        
        showAlert('Horario seleccionado exitosamente', 'success');
        
        // Redirigir al dashboard después de 2 segundos
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
    }
}

// Editar manualmente
function editManually() {
    showAlert('Función de edición manual próximamente disponible', 'info');
    
    // Aquí se implementaría la funcionalidad de edición manual
    // Por ahora solo mostramos un mensaje informativo
}

// Función para agregar interactividad a las celdas del horario
function makeScheduleInteractive() {
    const slots = document.querySelectorAll('.slot');
    
    slots.forEach(slot => {
        slot.addEventListener('click', function() {
            if (!slot.querySelector('.class-block')) {
                // Celda vacía - permitir agregar clase
                showAddClassModal(slot);
            } else {
                // Celda con clase - mostrar detalles
                showClassDetails(slot);
            }
        });
    });
}

// Mostrar modal para agregar clase
function showAddClassModal(slot) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>Agregar Clase</h3>
                <button onclick="this.closest('.modal-overlay').remove()" class="modal-close">×</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>Materia:</label>
                    <select id="subjectSelect">
                        <option value="">Selecciona una materia</option>
                        <option value="math">Matemáticas</option>
                        <option value="history">Historia</option>
                        <option value="chemistry">Química</option>
                        <option value="comp-sci">Ciencias de la Computación</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Hora de inicio:</label>
                    <input type="time" id="startTime">
                </div>
                <div class="form-group">
                    <label>Hora de fin:</label>
                    <input type="time" id="endTime">
                </div>
                <button onclick="addClass()" class="btn-primary">Agregar</button>
            </div>
        </div>
    `;
    
    styleModal(modal);
    document.body.appendChild(modal);
}

// Mostrar detalles de clase
function showClassDetails(slot) {
    const classBlock = slot.querySelector('.class-block');
    const className = classBlock.querySelector('.class-name').textContent;
    const classTime = classBlock.querySelector('.class-time').textContent;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>Detalles de la Clase</h3>
                <button onclick="this.closest('.modal-overlay').remove()" class="modal-close">×</button>
            </div>
            <div class="modal-body">
                <p><strong>Materia:</strong> ${className}</p>
                <p><strong>Horario:</strong> ${classTime}</p>
                <div class="modal-actions">
                    <button onclick="editClass()" class="btn-secondary">Editar</button>
                    <button onclick="removeClass()" class="btn-danger">Eliminar</button>
                </div>
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
        max-width: 400px;
        width: 90%;
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

// Generar horarios alternativos
function generateAlternativeSchedules() {
    const alternatives = [
        {
            id: 1,
            name: 'Horario Matutino',
            description: 'Clases concentradas en la mañana'
        },
        {
            id: 2,
            name: 'Horario Vespertino',
            description: 'Clases en la tarde'
        },
        {
            id: 3,
            name: 'Horario Mixto',
            description: 'Clases distribuidas en el día'
        }
    ];
    
    return alternatives;
}

// Exportar horario
function exportSchedule() {
    const schedule = JSON.parse(localStorage.getItem('currentSchedule'));
    
    if (!schedule) {
        showAlert('No hay horario seleccionado para exportar', 'warning');
        return;
    }
    
    // Crear archivo de texto con el horario
    const scheduleText = `
HORARIO ACADÉMICO - MATRIFLEX UNSA
=================================

Generado: ${new Date().toLocaleDateString()}

CLASES:
${schedule.courses.map(course => 
    `• ${course.name} - ${course.day} ${course.time}`
).join('\n')}

---
Este horario fue generado automáticamente por MatriFlex UNSA
    `.trim();
    
    // Crear y descargar archivo
    const blob = new Blob([scheduleText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'horario_matriflex.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showAlert('Horario exportado exitosamente', 'success');
}

// Inicializar funcionalidades cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Hacer el horario interactivo después de un breve delay
    setTimeout(makeScheduleInteractive, 1000);
});
