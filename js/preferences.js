// Funciones para la configuración de preferencias

document.addEventListener('DOMContentLoaded', function() {
    // Cargar preferencias guardadas
    loadSavedPreferences();
    
    // Inicializar grid interactivo
    makeGridInteractive();
    
    // Configurar eventos
    setupEventListeners();
});

// Cargar preferencias guardadas
function loadSavedPreferences() {
    const preferences = JSON.parse(localStorage.getItem('userPreferences')) || {
        availableDays: ['lunes', 'martes', 'miércoles', 'jueves'],
        blockedTimes: [],
        externalActivities: []
    };
    
    // Marcar días disponibles
    preferences.availableDays.forEach(day => {
        const checkbox = document.querySelector(`input[type="checkbox"][value="${day}"]`);
        if (checkbox) {
            checkbox.checked = true;
        }
    });
    
    // Aplicar horarios bloqueados
    preferences.blockedTimes.forEach(blockedTime => {
        const slot = document.querySelector(`[data-day="${blockedTime.day}"][data-time="${blockedTime.time}"]`);
        if (slot) {
            slot.classList.add('blocked');
            slot.textContent = 'bloqueado';
        }
    });
}

// Hacer el grid interactivo
function makeGridInteractive() {
    const timeSlots = document.querySelectorAll('.time-slot:not(.time-label)');
    
    timeSlots.forEach(slot => {
        // Agregar atributos de datos para identificación
        const row = slot.closest('.time-row');
        const timeLabel = row.querySelector('.time-label').textContent;
        const colIndex = Array.from(row.children).indexOf(slot) - 1; // -1 porque el primer hijo es time-label
        const days = ['lunes', 'martes', 'miércoles', 'jueves'];
        const day = days[colIndex];
        
        slot.setAttribute('data-day', day);
        slot.setAttribute('data-time', timeLabel);
        
        // Agregar evento de clic
        slot.addEventListener('click', function() {
            toggleTimeSlot(slot);
        });
        
        // Agregar hover effect
        slot.addEventListener('mouseenter', function() {
            if (!slot.classList.contains('blocked')) {
                slot.style.backgroundColor = '#e8f1ff';
            }
        });
        
        slot.addEventListener('mouseleave', function() {
            if (!slot.classList.contains('blocked')) {
                slot.style.backgroundColor = '';
            }
        });
    });
}

// Alternar estado de bloqueo de horario
function toggleTimeSlot(slot) {
    if (slot.classList.contains('blocked')) {
        // Desbloquear
        slot.classList.remove('blocked');
        slot.textContent = '';
        slot.style.backgroundColor = '';
    } else {
        // Bloquear
        slot.classList.add('blocked');
        slot.textContent = 'bloqueado';
        slot.style.backgroundColor = '';
    }
    
    // Actualizar preferencias
    updatePreferences();
}

// Configurar event listeners
function setupEventListeners() {
    // Checkboxes de días disponibles
    const dayCheckboxes = document.querySelectorAll('.available-days input[type="checkbox"]');
    dayCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updatePreferences);
    });
    
    // Inputs de actividad externa
    const activityInputs = document.querySelectorAll('.external-activity input');
    activityInputs.forEach(input => {
        input.addEventListener('change', updatePreferences);
    });
}

// Actualizar preferencias
function updatePreferences() {
    const preferences = {
        availableDays: [],
        blockedTimes: [],
        externalActivities: []
    };
    
    // Obtener días disponibles
    const dayCheckboxes = document.querySelectorAll('.available-days input[type="checkbox"]:checked');
    dayCheckboxes.forEach(checkbox => {
        const label = checkbox.closest('label').textContent.trim();
        preferences.availableDays.push(label);
    });
    
    // Obtener horarios bloqueados
    const blockedSlots = document.querySelectorAll('.time-slot.blocked');
    blockedSlots.forEach(slot => {
        preferences.blockedTimes.push({
            day: slot.getAttribute('data-day'),
            time: slot.getAttribute('data-time')
        });
    });
    
    // Obtener actividades externas
    const activityName = document.getElementById('activityName').value;
    const activityTime = document.getElementById('activityTime').value;
    
    if (activityName && activityTime) {
        preferences.externalActivities.push({
            name: activityName,
            time: activityTime
        });
    }
    
    console.log('Preferencias actualizadas:', preferences);
}

// Guardar preferencias
function savePreferences() {
    const preferences = {
        availableDays: [],
        blockedTimes: [],
        externalActivities: []
    };
    
    // Obtener días disponibles
    const dayCheckboxes = document.querySelectorAll('.available-days input[type="checkbox"]:checked');
    dayCheckboxes.forEach(checkbox => {
        const label = checkbox.closest('label').textContent.trim();
        preferences.availableDays.push(label);
    });
    
    // Obtener horarios bloqueados
    const blockedSlots = document.querySelectorAll('.time-slot.blocked');
    blockedSlots.forEach(slot => {
        preferences.blockedTimes.push({
            day: slot.getAttribute('data-day'),
            time: slot.getAttribute('data-time')
        });
    });
    
    // Obtener actividades externas
    const activityName = document.getElementById('activityName').value;
    const activityTime = document.getElementById('activityTime').value;
    
    if (activityName && activityTime) {
        preferences.externalActivities.push({
            name: activityName,
            time: activityTime
        });
    }
    
    // Guardar en localStorage
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    
    showAlert('Preferencias guardadas exitosamente', 'success');
    
    console.log('Preferencias guardadas:', preferences);
}

// Agregar actividad externa
function addExternalActivity() {
    const activityName = document.getElementById('activityName').value;
    const activityTime = document.getElementById('activityTime').value;
    
    if (!activityName || !activityTime) {
        showAlert('Por favor completa el nombre y la hora de la actividad', 'warning');
        return;
    }
    
    // Crear elemento visual para la actividad
    const activityList = document.querySelector('.external-activities-list') || createActivityList();
    
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    activityItem.innerHTML = `
        <div class="activity-info">
            <span class="activity-name">${activityName}</span>
            <span class="activity-time">${activityTime}</span>
        </div>
        <button onclick="removeActivity(this)" class="remove-activity">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    activityList.appendChild(activityItem);
    
    // Limpiar inputs
    document.getElementById('activityName').value = '';
    document.getElementById('activityTime').value = '';
    
    showAlert('Actividad externa agregada', 'success');
}

// Crear lista de actividades si no existe
function createActivityList() {
    const sidebar = document.querySelector('.preferences-sidebar');
    const activitySection = document.querySelector('.external-activity');
    
    const listContainer = document.createElement('div');
    listContainer.innerHTML = `
        <h4>Actividades Agregadas:</h4>
        <div class="external-activities-list"></div>
    `;
    
    activitySection.appendChild(listContainer);
    
    return listContainer.querySelector('.external-activities-list');
}

// Remover actividad externa
function removeActivity(button) {
    const activityItem = button.closest('.activity-item');
    activityItem.remove();
    
    showAlert('Actividad removida', 'info');
}

// Resetear preferencias
function resetPreferences() {
    const confirmation = confirm('¿Estás seguro de que quieres resetear todas las preferencias?');
    
    if (confirmation) {
        // Limpiar localStorage
        localStorage.removeItem('userPreferences');
        
        // Resetear interfaz
        const blockedSlots = document.querySelectorAll('.time-slot.blocked');
        blockedSlots.forEach(slot => {
            slot.classList.remove('blocked');
            slot.textContent = '';
        });
        
        // Marcar todos los días como disponibles
        const dayCheckboxes = document.querySelectorAll('.available-days input[type="checkbox"]');
        dayCheckboxes.forEach(checkbox => {
            checkbox.checked = true;
        });
        
        // Limpiar actividades externas
        const activityList = document.querySelector('.external-activities-list');
        if (activityList) {
            activityList.innerHTML = '';
        }
        
        // Limpiar inputs
        document.getElementById('activityName').value = '';
        document.getElementById('activityTime').value = '';
        
        showAlert('Preferencias reseteadas', 'success');
    }
}

// Previsualizar horario con preferencias
function previewScheduleWithPreferences() {
    const preferences = JSON.parse(localStorage.getItem('userPreferences')) || {};
    
    // Crear ventana de previsualización
    const preview = window.open('', '_blank', 'width=800,height=600');
    preview.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Previsualización de Horario</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .preview-grid { display: grid; grid-template-columns: 80px repeat(4, 1fr); gap: 2px; }
                .header { background: #4f75ff; color: white; padding: 10px; text-align: center; }
                .time-cell { background: #f8f9fa; padding: 10px; text-align: center; }
                .day-cell { background: white; padding: 10px; border: 1px solid #ddd; }
                .blocked { background: #dc3545; color: white; }
                .available { background: #28a745; color: white; }
            </style>
        </head>
        <body>
            <h2>Previsualización de Disponibilidad</h2>
            <p>Este es tu horario basado en las preferencias configuradas:</p>
            <div class="preview-grid">
                <!-- Aquí se generaría el grid de previsualización -->
            </div>
            <button onclick="window.close()">Cerrar</button>
        </body>
        </html>
    `);
}

// Exportar preferencias
function exportPreferences() {
    const preferences = JSON.parse(localStorage.getItem('userPreferences')) || {};
    
    const preferencesText = `
PREFERENCIAS DE HORARIO - MATRIFLEX UNSA
=======================================

Exportado: ${new Date().toLocaleDateString()}

DÍAS DISPONIBLES:
${preferences.availableDays ? preferences.availableDays.map(day => `• ${day}`).join('\n') : 'No configurado'}

HORARIOS BLOQUEADOS:
${preferences.blockedTimes ? preferences.blockedTimes.map(time => `• ${time.day} - ${time.time}`).join('\n') : 'Ninguno'}

ACTIVIDADES EXTERNAS:
${preferences.externalActivities ? preferences.externalActivities.map(activity => `• ${activity.name} - ${activity.time}`).join('\n') : 'Ninguna'}

---
Estas preferencias fueron configuradas en MatriFlex UNSA
    `.trim();
    
    // Crear y descargar archivo
    const blob = new Blob([preferencesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'preferencias_matriflex.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showAlert('Preferencias exportadas exitosamente', 'success');
}
