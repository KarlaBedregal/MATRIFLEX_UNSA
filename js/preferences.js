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
    
    // Botón de guardar preferencias
    const saveBtn = document.querySelector('.save-preferences-btn, .btn-primary');
    if (saveBtn) {
        saveBtn.addEventListener('click', savePreferences);
    }
    
    // Botón de agregar actividad externa
    const addActivityBtn = document.querySelector('.add-activity-btn');
    if (addActivityBtn) {
        addActivityBtn.addEventListener('click', addExternalActivity);
    }
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
    
    // Obtener actividades externas desde localStorage
    const savedActivities = JSON.parse(localStorage.getItem('externalActivities')) || [];
    preferences.externalActivities = savedActivities;
    
    // Guardar en localStorage
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    
    // Mostrar confirmación detallada
    let message = '✅ Preferencias guardadas:\n';
    message += `📅 Días disponibles: ${preferences.availableDays.length}\n`;
    message += `🚫 Horarios bloqueados: ${preferences.blockedTimes.length}\n`;
    message += `📝 Actividades externas: ${preferences.externalActivities.length}`;
    
    showAlert('Preferencias guardadas exitosamente', 'success');
    
    // Mostrar detalles en consola para debugging
    console.log('✅ Preferencias guardadas:', preferences);
    console.log('📊 Resumen:', {
        diasDisponibles: preferences.availableDays,
        horariosBloquados: preferences.blockedTimes.length,
        actividadesExternas: preferences.externalActivities.length
    });
    
    // Mostrar información adicional
    setTimeout(() => {
        showAlert('💡 Ahora ve al Generador de Horarios para usar estas preferencias', 'info');
    }, 2000);
}

// Agregar actividad externa
// Agregar actividad externa - NUEVA VERSIÓN
function addExternalActivity() {
    const activityName = document.getElementById('activityName').value.trim();
    const activityDay = document.getElementById('activityDay').value;
    const activityTimeStart = document.getElementById('activityTimeStart').value;
    const activityTimeEnd = document.getElementById('activityTimeEnd').value;
    
    // Validaciones
    if (!activityName) {
        showAlert('❌ Por favor ingresa el nombre de la actividad', 'warning');
        return;
    }
    
    if (!activityDay) {
        showAlert('❌ Por favor selecciona un día', 'warning');
        return;
    }
    
    if (!activityTimeStart || !activityTimeEnd) {
        showAlert('❌ Por favor ingresa la hora de inicio y fin', 'warning');
        return;
    }
    
    if (activityTimeStart >= activityTimeEnd) {
        showAlert('❌ La hora de fin debe ser después de la hora de inicio', 'warning');
        return;
    }
    
    // Crear objeto de actividad
    const activity = {
        id: Date.now(), // ID único
        name: activityName,
        day: activityDay,
        timeStart: activityTimeStart,
        timeEnd: activityTimeEnd,
        timeRange: `${activityTimeStart} - ${activityTimeEnd}`
    };
    
    // Obtener actividades existentes
    let savedActivities = JSON.parse(localStorage.getItem('externalActivities')) || [];
    
    // Verificar conflictos de horario
    const hasConflict = savedActivities.some(existing => 
        existing.day === activity.day && 
        ((activity.timeStart >= existing.timeStart && activity.timeStart < existing.timeEnd) ||
         (activity.timeEnd > existing.timeStart && activity.timeEnd <= existing.timeEnd) ||
         (activity.timeStart <= existing.timeStart && activity.timeEnd >= existing.timeEnd))
    );
    
    if (hasConflict) {
        showAlert('⚠️ Ya tienes una actividad en ese horario. Revisa tus actividades existentes.', 'warning');
        return;
    }
    
    // Agregar nueva actividad
    savedActivities.push(activity);
    
    // Guardar en localStorage
    localStorage.setItem('externalActivities', JSON.stringify(savedActivities));
    
    // Limpiar formulario
    document.getElementById('activityName').value = '';
    document.getElementById('activityDay').value = '';
    document.getElementById('activityTimeStart').value = '';
    document.getElementById('activityTimeEnd').value = '';
    
    // Actualizar lista visual
    displayExternalActivities();
    
    showAlert(`✅ Actividad "${activityName}" agregada exitosamente`, 'success');
    
    console.log('🎯 Actividad agregada:', activity);
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
    a.download = 'mis-preferencias-horario.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showAlert('Preferencias exportadas como archivo de texto', 'success');
}

// Función de alerta (igual que en subjects.js)
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

// ===== FUNCIONES PARA ACTIVIDADES EXTERNAS =====

// Mostrar actividades externas al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    displayExternalActivities();
});

// Mostrar actividades externas
function displayExternalActivities() {
    const activitiesList = document.getElementById('activitiesList');
    if (!activitiesList) return;
    
    const savedActivities = JSON.parse(localStorage.getItem('externalActivities')) || [];
    
    if (savedActivities.length === 0) {
        activitiesList.innerHTML = `
            <div class="no-activities">
                <i class="fas fa-calendar-plus"></i>
                <p>No tienes actividades externas agregadas</p>
            </div>
        `;
        return;
    }
    
    activitiesList.innerHTML = `
        <h4>Actividades agregadas (${savedActivities.length})</h4>
        <div class="activities-grid">
            ${savedActivities.map(activity => `
                <div class="activity-card" data-id="${activity.id}">
                    <div class="activity-header">
                        <span class="activity-name">${activity.name}</span>
                        <button onclick="removeExternalActivity(${activity.id})" class="remove-btn" title="Eliminar">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="activity-details">
                        <span class="activity-day">${activity.day}</span>
                        <span class="activity-time">${activity.timeRange}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Eliminar actividad externa
function removeExternalActivity(activityId) {
    let savedActivities = JSON.parse(localStorage.getItem('externalActivities')) || [];
    const activityToRemove = savedActivities.find(a => a.id === activityId);
    
    if (activityToRemove) {
        savedActivities = savedActivities.filter(a => a.id !== activityId);
        localStorage.setItem('externalActivities', JSON.stringify(savedActivities));
        displayExternalActivities();
        showAlert(`✅ Actividad "${activityToRemove.name}" eliminada`, 'success');
    }
}
