// Funciones para la configuración de preferencias - VERSIÓN ARREGLADA

document.addEventListener('DOMContentLoaded', function() {
    // Cargar preferencias guardadas
    loadSavedPreferences();
    
    // Inicializar grid interactivo
    makeGridInteractive();
    
    // Configurar eventos
    setupEventListeners();
    
    // Mostrar actividades externas
    displayExternalActivities();
});

// Cargar preferencias guardadas
function loadSavedPreferences() {
    const preferences = JSON.parse(localStorage.getItem('userPreferences')) || {
        availableDays: ['Lunes', 'Martes', 'Miércoles', 'Jueves'],
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
    
    console.log('Preferencias cargadas:', preferences);
}

// Hacer el grid interactivo
function makeGridInteractive() {
    const timeSlots = document.querySelectorAll('.time-slot:not(.time-label)');
    
    timeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            if (this.classList.contains('blocked')) {
                this.classList.remove('blocked');
                this.textContent = '';
            } else {
                this.classList.add('blocked');
                this.textContent = 'Bloqueado';
            }
            
            console.log('Slot clickeado:', this);
        });
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Botón de guardar preferencias
    const saveBtn = document.querySelector('.save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function(e) {
            e.preventDefault();
            savePreferences();
        });
        console.log('Event listener agregado al botón guardar');
    } else {
        console.error('No se encontró el botón de guardar');
    }
}

// Guardar preferencias
function savePreferences() {
    console.log('🎯 Función savePreferences ejecutada');
    
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
            day: slot.getAttribute('data-day') || 'N/A',
            time: slot.getAttribute('data-time') || 'N/A'
        });
    });
    
    // Obtener actividades externas desde localStorage
    const savedActivities = JSON.parse(localStorage.getItem('externalActivities')) || [];
    preferences.externalActivities = savedActivities;
    
    // Guardar en localStorage
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    
    // Mostrar confirmación detallada
    showAlert('✅ Preferencias guardadas exitosamente', 'success');
    
    // Mostrar detalles en consola
    console.log('✅ Preferencias guardadas:', preferences);
    console.log('📊 Resumen:', {
        diasDisponibles: preferences.availableDays.length,
        horariosBloquados: preferences.blockedTimes.length,
        actividadesExternas: preferences.externalActivities.length
    });
    
    // Mostrar información adicional
    setTimeout(() => {
        showAlert('💡 Ahora ve al Generador de Horarios para usar estas preferencias', 'info');
    }, 2000);
}

// ===== FUNCIONES PARA ACTIVIDADES EXTERNAS =====

// Agregar actividad externa
function addExternalActivity() {
    console.log('🎯 Función addExternalActivity ejecutada');
    
    const activityName = document.getElementById('activityName');
    const activityDay = document.getElementById('activityDay');
    const activityTimeStart = document.getElementById('activityTimeStart');
    const activityTimeEnd = document.getElementById('activityTimeEnd');
    
    // Verificar que los elementos existen
    if (!activityName || !activityDay || !activityTimeStart || !activityTimeEnd) {
        console.error('❌ No se encontraron todos los elementos del formulario');
        showAlert('❌ Error: No se encontraron todos los campos del formulario', 'error');
        return;
    }
    
    const name = activityName.value.trim();
    const day = activityDay.value;
    const timeStart = activityTimeStart.value;
    const timeEnd = activityTimeEnd.value;
    
    console.log('Datos del formulario:', { name, day, timeStart, timeEnd });
    
    // Validaciones
    if (!name) {
        showAlert('❌ Por favor ingresa el nombre de la actividad', 'warning');
        return;
    }
    
    if (!day) {
        showAlert('❌ Por favor selecciona un día', 'warning');
        return;
    }
    
    if (!timeStart || !timeEnd) {
        showAlert('❌ Por favor ingresa la hora de inicio y fin', 'warning');
        return;
    }
    
    if (timeStart >= timeEnd) {
        showAlert('❌ La hora de fin debe ser después de la hora de inicio', 'warning');
        return;
    }
    
    // Crear objeto de actividad
    const activity = {
        id: Date.now(), // ID único
        name: name,
        day: day,
        timeStart: timeStart,
        timeEnd: timeEnd,
        timeRange: `${timeStart} - ${timeEnd}`
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
    activityName.value = '';
    activityDay.value = '';
    activityTimeStart.value = '';
    activityTimeEnd.value = '';
    
    // Actualizar lista visual
    displayExternalActivities();
    
    showAlert(`✅ Actividad "${name}" agregada exitosamente`, 'success');
    
    console.log('🎯 Actividad agregada:', activity);
}

// Mostrar actividades externas
function displayExternalActivities() {
    const activitiesList = document.getElementById('activitiesList');
    if (!activitiesList) {
        console.warn('⚠️ No se encontró el elemento activitiesList');
        return;
    }
    
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

// Función de alerta
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

// Debug: Verificar que el script se carga
console.log('✅ Script preferences-fixed.js cargado correctamente');
