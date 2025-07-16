// Funciones para el generador de horarios - Version limpia

// Variables globales para el generador
let generatedSchedules = [];
let currentScheduleIndex = 0;
let selectedSubjects = [];
let userPreferences = {};

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - inicializando generador de horarios');
    
    // 🔄 Cargar datos frescos al inicializar
    console.log('🔄 Cargando datos iniciales...');
    
    // Cargar preferencias del usuario
    loadUserPreferences();
    
    // Cargar materias seleccionadas
    loadSelectedSubjects();
    
    // Mostrar información de preferencias
    showSelectedSubjectsInfo();
    
    // Agregar elementos dinámicos
    addGenerationOptions();
    addScheduleNavigation();
    
    console.log('✅ Inicialización completada');
});

// Añadir opciones de generación
function addGenerationOptions() {
    const scheduleGenerator = document.querySelector('.schedule-generator');
    if (!scheduleGenerator) return;
    
    const optionsPanel = document.createElement('div');
    optionsPanel.className = 'generation-options';
    optionsPanel.innerHTML = `
        <h3><i class="fas fa-cog"></i> Opciones de Generación</h3>
        <div class="options-grid">
            <label>
                <input type="checkbox" id="avoidConflicts" checked>
                Evitar conflictos con actividades externas
            </label>
            <label>
                <input type="checkbox" id="prioritizePreferences" checked>
                Priorizar horarios preferidos
            </label>
            <label>
                <input type="checkbox" id="compactSchedule">
                Horarios compactos (menos días)
            </label>
            <label>
                <input type="checkbox" id="morningPreference">
                Preferir horarios matutinos
            </label>
        </div>
    `;
    
    // Insertar después del content-header
    const contentHeader = scheduleGenerator.querySelector('.content-header');
    if (contentHeader) {
        contentHeader.insertAdjacentElement('afterend', optionsPanel);
    }
}

// Añadir navegación entre horarios
function addScheduleNavigation() {
    const scheduleSection = document.querySelector('.schedule-section');
    if (!scheduleSection) return;
    
    const navigationPanel = document.createElement('div');
    navigationPanel.className = 'schedule-navigation';
    navigationPanel.innerHTML = `
        <div class="nav-controls">
            <button onclick="previousSchedule()" class="nav-btn" id="prevBtn" disabled>
                <i class="fas fa-chevron-left"></i> Anterior
            </button>
            <span class="schedule-counter" id="scheduleCounter">0 / 0</span>
            <button onclick="nextSchedule()" class="nav-btn" id="nextBtn" disabled>
                Siguiente <i class="fas fa-chevron-right"></i>
            </button>
        </div>
        <div class="schedule-info" id="currentScheduleInfo">
            <p>Genera horarios para comenzar</p>
        </div>
    `;
    
    // Insertar al inicio de schedule-section
    scheduleSection.insertBefore(navigationPanel, scheduleSection.firstChild);
}

// Función principal para generar horarios
function generateSchedule() {
    console.log('=== INICIANDO GENERACION DE HORARIOS ===');
    
    // 🔄 RECARGAR DATOS FRESCOS DEL LOCALSTORAGE
    console.log('🔄 Recargando datos frescos del localStorage...');
    
    // Recargar materias seleccionadas
    const freshSelectedSubjects = JSON.parse(localStorage.getItem('selectedSubjects')) || [];
    selectedSubjects = freshSelectedSubjects; // Actualizar variable global
    
    // Recargar preferencias
    const freshUserPreferences = JSON.parse(localStorage.getItem('userPreferences')) || {};
    userPreferences = freshUserPreferences; // Actualizar variable global
    
    // Recargar actividades externas
    const freshExternalActivities = JSON.parse(localStorage.getItem('externalActivities')) || [];
    
    console.log('📊 Datos frescos cargados:');
    console.log('- Materias seleccionadas:', freshSelectedSubjects);
    console.log('- Preferencias usuario:', freshUserPreferences);
    console.log('- Actividades externas:', freshExternalActivities);
    
    // Validar que hay materias seleccionadas
    if (!freshSelectedSubjects || freshSelectedSubjects.length === 0) {
        console.warn('❌ No hay materias seleccionadas');
        const userChoice = confirm(
            '❌ No hay materias seleccionadas.\n\n' +
            '¿Quieres ir a la página de Dashboard para seleccionar materias?\n\n' +
            'Opciones:\n' +
            '• OK = Ir a Dashboard\n' +
            '• Cancelar = Cargar datos de prueba'
        );
        
        if (userChoice) {
            window.location.href = 'dashboard.html';
        } else {
            loadTestData();
        }
        return;
    }
    
    // Validar que hay preferencias configuradas
    if (!freshUserPreferences || Object.keys(freshUserPreferences).length === 0) {
        showAlert('❌ No has configurado tus preferencias. Ve a "Preferencias" primero.', 'warning');
        // Continuar con preferencias por defecto
        userPreferences = {
            availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            preferredTime: 'morning'
        };
    }
    
    const generateBtn = document.querySelector('.generate-btn');
    generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...';
    generateBtn.disabled = true;
    
    console.log('✅ Validación completada. Procediendo con la generación...');
    
    // Simular procesamiento
    setTimeout(() => {
        generateMultipleSchedules();
        showGeneratedSchedule();
        
        generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generar Nuevos Horarios';
        generateBtn.disabled = false;
        
        showAlert('✅ Horarios generados exitosamente', 'success');
    }, 2000);
}

// Generar múltiples horarios
function generateMultipleSchedules() {
    console.log('=== GENERANDO MÚLTIPLES HORARIOS ===');
    
    generatedSchedules = [];
    
    const userPrefs = JSON.parse(localStorage.getItem('userPreferences')) || {};
    const externalActivities = JSON.parse(localStorage.getItem('externalActivities')) || [];
    
    console.log('📊 Datos cargados para generación:');
    console.log('- Materias seleccionadas:', selectedSubjects);
    console.log('- Preferencias usuario:', userPrefs);
    console.log('- Actividades externas:', externalActivities);
    console.log('- Total materias:', selectedSubjects.length);
    console.log('- Total actividades externas:', externalActivities.length);
    
    const availableDays = userPrefs.availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    let timeSlots = [];
    if (userPrefs.preferredTime === 'morning' || !userPrefs.preferredTime) {
        timeSlots = ['7:00 AM - 8:30 AM', '8:00 AM - 9:30 AM', '9:00 AM - 10:30 AM', '10:00 AM - 11:30 AM', '11:00 AM - 12:30 PM'];
    } else if (userPrefs.preferredTime === 'afternoon') {
        timeSlots = ['12:00 PM - 1:30 PM', '1:00 PM - 2:30 PM', '2:00 PM - 3:30 PM', '3:00 PM - 4:30 PM', '4:00 PM - 5:30 PM'];
    } else {
        timeSlots = [
            '7:00 AM - 8:30 AM', '8:00 AM - 9:30 AM', '9:00 AM - 10:30 AM', 
            '10:00 AM - 11:30 AM', '11:00 AM - 12:30 PM', '12:00 PM - 1:30 PM',
            '1:00 PM - 2:30 PM', '2:00 PM - 3:30 PM', '3:00 PM - 4:30 PM'
        ];
    }
    
    const rooms = ['A101', 'A205', 'Lab B', 'Lab C', 'C101', 'C205', 'D101'];
    const colors = ['math', 'programming', 'science', 'languages', 'general'];
    
    // Generar 3 horarios diferentes
    for (let i = 0; i < 3; i++) {
        console.log(`\n🔄 Creando horario ${i + 1}:`);
        
        const schedule = {
            name: `Horario ${i + 1}`,
            description: `Opción ${i + 1} optimizada`,
            quality: Math.floor(Math.random() * 15) + 85,
            courses: [],
            conflictsWithActivities: 0
        };
        
        // 1. Agregar materias seleccionadas
        console.log(`📚 Agregando ${selectedSubjects.length} materias:`);
        selectedSubjects.forEach((subject, index) => {
            const dayIndex = (index + i) % availableDays.length;
            const timeIndex = (index + i) % timeSlots.length;
            const roomIndex = (index + i) % rooms.length;
            const colorIndex = index % colors.length;
            
            const course = {
                name: subject.name || subject,
                time: timeSlots[timeIndex],
                day: availableDays[dayIndex],
                room: rooms[roomIndex],
                color: colors[colorIndex],
                credits: subject.credits || 3,
                type: 'subject'
            };
            
            schedule.courses.push(course);
            console.log(`  ✅ Materia agregada: ${course.name} (${course.day} ${course.time})`);
        });
        
        // 2. Agregar actividades externas
        if (externalActivities && externalActivities.length > 0) {
            console.log(`🎯 Agregando ${externalActivities.length} actividades externas:`);
            
            externalActivities.forEach(activity => {
                // Mapear días al formato en inglés si es necesario
                const dayMap = {
                    'lunes': 'Monday',
                    'martes': 'Tuesday', 
                    'miércoles': 'Wednesday',
                    'jueves': 'Thursday',
                    'viernes': 'Friday'
                };
                
                const mappedDay = dayMap[activity.day] || activity.day;
                
                const externalCourse = {
                    name: activity.name,
                    time: activity.timeRange || `${activity.timeStart} - ${activity.timeEnd}`,
                    day: mappedDay,
                    room: 'Actividad Externa',
                    color: 'external',
                    type: 'external',
                    isExternal: true
                };
                
                schedule.courses.push(externalCourse);
                console.log(`  🎯 Actividad externa agregada: ${externalCourse.name} (${externalCourse.day} ${externalCourse.time})`);
            });
        } else {
            console.log('⚠️ No hay actividades externas para agregar');
        }
        
        console.log(`📋 Horario ${i + 1} completado con ${schedule.courses.length} elementos totales`);
        generatedSchedules.push(schedule);
    }
    
    console.log('\n🎉 RESUMEN DE GENERACIÓN:');
    console.log(`- Total horarios generados: ${generatedSchedules.length}`);
    generatedSchedules.forEach((schedule, index) => {
        const subjects = schedule.courses.filter(c => c.type === 'subject').length;
        const externals = schedule.courses.filter(c => c.type === 'external').length;
        const manuals = schedule.courses.filter(c => c.type === 'manual').length;
        console.log(`  Horario ${index + 1}: ${subjects} materias + ${externals} actividades externas + ${manuals} manuales = ${schedule.courses.length} total`);
    });
    
    currentScheduleIndex = 0;
    updateScheduleNavigation();
}

// Mostrar horario generado
function showGeneratedSchedule() {
    console.log('Mostrando horario generado');
    
    const scheduleSection = document.querySelector('.schedule-section');
    if (scheduleSection) {
        scheduleSection.style.display = 'block';
    }
    
    clearScheduleGrid();
    displayCurrentSchedule();
}

// Limpiar grid de horario
function clearScheduleGrid() {
    const slots = document.querySelectorAll('.slot');
    slots.forEach(slot => {
        slot.innerHTML = '';
        slot.className = 'slot';
    });
}

// Mostrar horario actual
function displayCurrentSchedule() {
    console.log('\n=== MOSTRANDO HORARIO ACTUAL ===');
    
    if (generatedSchedules.length === 0) {
        console.warn('❌ No hay horarios generados');
        showAlert('No hay horarios generados. Primero genera horarios.', 'warning');
        return;
    }
    
    const currentSchedule = generatedSchedules[currentScheduleIndex];
    console.log(`📋 Mostrando horario: ${currentSchedule.name}`);
    console.log('📊 Contenido del horario:', currentSchedule);
    
    // Analizar tipos de cursos
    const subjects = currentSchedule.courses.filter(c => c.type === 'subject');
    const externals = currentSchedule.courses.filter(c => c.type === 'external');
    const manuals = currentSchedule.courses.filter(c => c.type === 'manual');
    
    console.log(`📚 Materias: ${subjects.length}`);
    console.log(`🎯 Actividades externas: ${externals.length}`);
    console.log(`✏️ Cursos manuales: ${manuals.length}`);
    console.log(`📋 Total elementos: ${currentSchedule.courses.length}`);
    
    // Actualizar título con información detallada
    const sectionTitle = document.querySelector('#scheduleTitle');
    if (sectionTitle) {
        sectionTitle.innerHTML = `
            ${currentSchedule.name} - Calidad: ${currentSchedule.quality}% 
            <span style="font-size: 14px; color: #666;">
                (${subjects.length} materias, ${externals.length} actividades externas, ${manuals.length} manuales)
            </span>
        `;
    }
    
    // Limpiar grid
    clearScheduleGrid();
    
    if (!currentSchedule.courses || currentSchedule.courses.length === 0) {
        console.warn('⚠️ No hay cursos en el horario');
        showAlert('El horario actual no tiene cursos. Verifica los datos.', 'warning');
        return;
    }
    
    console.log(`\n🔄 Colocando ${currentSchedule.courses.length} elementos en el grid:`);
    
    let coursesPlaced = 0;
    currentSchedule.courses.forEach((course, index) => {
        console.log(`Colocando curso ${index + 1}:`, course);
        
        const slot = findSlotForCourse(course);
        if (slot) {
            // Determinar el estilo según el tipo de curso
            let blockClass = course.color;
            let extraContent = '';
            
            if (course.type === 'external' || course.isExternal) {
                blockClass = 'external';
                extraContent = '<span class="external-badge">🎯 Actividad Externa</span>';
            } else if (course.type === 'manual') {
                blockClass = 'manual';
                extraContent = `<button onclick="removeManualCourse('${course.id}')" class="remove-btn">×</button>`;
            }
            
            slot.innerHTML = `
                <div class="class-block ${blockClass}">
                    <div class="class-name">${course.name}</div>
                    <div class="class-time">${course.time}</div>
                    <div class="class-room">${course.room}</div>
                    ${extraContent}
                </div>
            `;
            slot.classList.add('occupied');
            coursesPlaced++;
            
            const courseType = course.type === 'external' ? '🎯 Actividad Externa' : 
                              course.type === 'manual' ? '✏️ Curso Manual' : '📚 Materia';
            console.log(`✅ ${courseType} colocado: ${course.name}`);
        } else {
            console.error(`❌ No se pudo colocar: ${course.name}`);
        }
    });
    
    console.log(`Resumen: ${coursesPlaced}/${currentSchedule.courses.length} cursos colocados`);
    
    if (coursesPlaced === 0) {
        showAlert('No se pudieron colocar cursos en el horario. Revisa la consola.', 'error');
    }
}

// Función para encontrar slot en el grid - VERSION SIMPLIFICADA
function findSlotForCourse(course) {
    console.log('Buscando slot para:', course.name, course.day, course.time);
    
    // Mapear días a columnas
    const dayMap = {
        'Monday': 1,
        'Tuesday': 2,
        'Wednesday': 3,
        'Thursday': 4,
        'Friday': 5
    };
    
    // Mapear horas a filas
    const timeMap = {
        '7:00 AM': 0, '8:00 AM': 1, '9:00 AM': 2, '10:00 AM': 3, '11:00 AM': 4,
        '12:00 PM': 5, '1:00 PM': 6, '2:00 PM': 7, '3:00 PM': 8, '4:00 PM': 9, '5:00 PM': 10, '6:00 PM': 11
    };
    
    const hour = course.time.split(' - ')[0];
    const dayColumn = dayMap[course.day];
    const timeRow = timeMap[hour];
    
    console.log(`Mapeo: ${course.day} -> columna ${dayColumn}, ${hour} -> fila ${timeRow}`);
    
    if (dayColumn && timeRow !== undefined) {
        const scheduleGrid = document.querySelector('.schedule-grid');
        if (!scheduleGrid) {
            console.error('No se encontró el grid');
            return null;
        }
        
        const allItems = scheduleGrid.children;
        
        // Estructura: 6 headers + (13 filas * 6 elementos) = 6 + 78 = 84 elementos
        // Cada fila: time-header + 5 slots
        const headerRow = 6;
        const elementsPerRow = 6;
        const rowStart = headerRow + (timeRow * elementsPerRow);
        const slotIndex = rowStart + dayColumn;
        
        console.log(`Calculando: fila ${timeRow}, inicio ${rowStart}, slot ${slotIndex}`);
        
        if (slotIndex < allItems.length) {
            const element = allItems[slotIndex];
            if (element && element.classList.contains('slot')) {
                console.log('✅ Slot encontrado');
                return element;
            } else {
                console.warn('Elemento no es slot:', element ? element.className : 'null');
            }
        } else {
            console.warn(`Índice fuera de rango: ${slotIndex}/${allItems.length}`);
        }
    }
    
    return null;
}

// Navegación entre horarios
function nextSchedule() {
    if (currentScheduleIndex < generatedSchedules.length - 1) {
        currentScheduleIndex++;
        displayCurrentSchedule();
        updateScheduleNavigation();
    }
}

function previousSchedule() {
    if (currentScheduleIndex > 0) {
        currentScheduleIndex--;
        displayCurrentSchedule();
        updateScheduleNavigation();
    }
}

function updateScheduleNavigation() {
    const counter = document.getElementById('scheduleCounter');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (counter) {
        counter.textContent = `${currentScheduleIndex + 1} / ${generatedSchedules.length}`;
    }
    
    if (prevBtn) {
        prevBtn.disabled = currentScheduleIndex === 0;
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentScheduleIndex === generatedSchedules.length - 1;
    }
}

// Cargar preferencias del usuario
function loadUserPreferences() {
    console.log('📋 Cargando preferencias del usuario...');
    
    // Cargar preferencias básicas
    userPreferences = JSON.parse(localStorage.getItem('userPreferences')) || {
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        preferredTime: 'morning',
        blockedTimes: []
    };
    
    // Cargar actividades externas
    const externalActivities = JSON.parse(localStorage.getItem('externalActivities')) || [];
    
    console.log('🔍 Preferencias encontradas:', userPreferences);
    console.log('🎯 Actividades externas encontradas:', externalActivities);
    
    // Convertir actividades externas al formato correcto
    userPreferences.externalActivities = externalActivities.map(activity => {
        // Mapear días al formato en inglés
        const dayMap = {
            'lunes': 'Monday',
            'martes': 'Tuesday', 
            'miércoles': 'Wednesday',
            'jueves': 'Thursday',
            'viernes': 'Friday'
        };
        
        return {
            id: activity.id || Math.random().toString(36).substr(2, 9),
            name: activity.name,
            day: dayMap[activity.day] || activity.day,
            startTime: activity.timeStart || activity.start || '08:00',
            endTime: activity.timeEnd || activity.end || '09:00',
            timeRange: activity.timeRange,
            type: 'external',
            color: '#9b59b6' // Color púrpura para actividades externas
        };
    });
    
    console.log('✅ Preferencias procesadas:', userPreferences);
    console.log('🔄 Actividades externas formateadas:', userPreferences.externalActivities);
}

// Cargar materias seleccionadas
// Cargar materias seleccionadas
function loadSelectedSubjects() {
    console.log('📚 Cargando materias seleccionadas...');
    
    const storedSubjects = localStorage.getItem('selectedSubjects');
    console.log('📄 Datos raw en localStorage:', storedSubjects);
    
    selectedSubjects = JSON.parse(storedSubjects) || [];
    console.log('📊 Materias parseadas:', selectedSubjects);
    console.log(`📋 Total materias encontradas: ${selectedSubjects.length}`);
    
    if (selectedSubjects.length === 0) {
        console.warn('⚠️ No hay materias seleccionadas en localStorage');
        
        const generateBtn = document.querySelector('.generate-btn');
        if (generateBtn) {
            generateBtn.disabled = true;
            generateBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Primero selecciona materias';
            generateBtn.onclick = () => {
                if (confirm('¿Ir a Dashboard para seleccionar materias?')) {
                    window.location.href = 'dashboard.html';
                }
            };
        }
        return;
    }
    
    console.log('✅ Materias cargadas exitosamente');
    selectedSubjects.forEach((subject, index) => {
        console.log(`  ${index + 1}. ${subject.name || subject} (${subject.code || 'N/A'})`);
    });
    
    // Activar botón de generar
    const generateBtn = document.querySelector('.generate-btn');
    if (generateBtn) {
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generar Horarios Inteligentes';
        generateBtn.onclick = generateSchedule;
    }
    
    showSelectedSubjectsInfo();
}

// Mostrar información de materias seleccionadas
// Mostrar información de materias seleccionadas
function showSelectedSubjectsInfo() {
    console.log('📋 Mostrando información de materias y preferencias...');
    
    const preferencesPanel = document.getElementById('preferencesInfo');
    if (!preferencesPanel) return;
    
    // Mostrar el panel
    preferencesPanel.style.display = 'block';
    
    // Obtener datos actuales
    const subjects = JSON.parse(localStorage.getItem('selectedSubjects')) || [];
    const preferences = JSON.parse(localStorage.getItem('userPreferences')) || {};
    const externalActivities = JSON.parse(localStorage.getItem('externalActivities')) || [];
    
    // Actualizar contadores
    const selectedSubjectsCount = document.getElementById('selectedSubjectsCount');
    if (selectedSubjectsCount) {
        selectedSubjectsCount.textContent = subjects.length;
    }
    
    const externalActivitiesCount = document.getElementById('externalActivitiesCount');
    if (externalActivitiesCount) {
        externalActivitiesCount.innerHTML = `
            <span class="external-activities-count">${externalActivities.length}</span>
            ${externalActivities.length > 0 ? externalActivities.map(a => a.name).join(', ') : 'Ninguna'}
        `;
    }
    
    const preferredTimeInfo = document.getElementById('preferredTimeInfo');
    if (preferredTimeInfo) {
        const timeText = preferences.preferredTime === 'morning' ? 'Matutino' : 
                        preferences.preferredTime === 'afternoon' ? 'Vespertino' : 'Flexible';
        preferredTimeInfo.textContent = timeText;
    }
    
    const availableDaysInfo = document.getElementById('availableDaysInfo');
    if (availableDaysInfo) {
        const dayMap = {
            'Monday': 'Lun',
            'Tuesday': 'Mar', 
            'Wednesday': 'Mié',
            'Thursday': 'Jue',
            'Friday': 'Vie'
        };
        const availableDays = preferences.availableDays || [];
        const dayNames = availableDays.map(day => dayMap[day] || day).join(', ');
        availableDaysInfo.textContent = dayNames || 'Todos';
    }
    
    console.log('✅ Panel de información actualizado');
}

// Función para verificar qué datos están almacenados
function checkStoredData() {
    console.log('🔍 VERIFICANDO DATOS ALMACENADOS...');
    
    const subjects = JSON.parse(localStorage.getItem('selectedSubjects')) || [];
    const preferences = JSON.parse(localStorage.getItem('userPreferences')) || {};
    const externalActivities = JSON.parse(localStorage.getItem('externalActivities')) || [];
    
    console.log('📊 DATOS ACTUALES EN LOCALSTORAGE:');
    console.log('1. Materias seleccionadas:', subjects);
    console.log('2. Preferencias usuario:', preferences);
    console.log('3. Actividades externas:', externalActivities);
    
    // Crear resumen para mostrar al usuario
    let summary = `📊 RESUMEN DE TUS DATOS ALMACENADOS:\n\n`;
    
    summary += `📚 MATERIAS SELECCIONADAS (${subjects.length}):\n`;
    if (subjects.length > 0) {
        subjects.forEach((subject, index) => {
            summary += `   ${index + 1}. ${subject.name || subject} (${subject.credits || 'N/A'} créditos)\n`;
        });
    } else {
        summary += `   ❌ No hay materias seleccionadas\n`;
    }
    
    summary += `\n🎯 ACTIVIDADES EXTERNAS (${externalActivities.length}):\n`;
    if (externalActivities.length > 0) {
        externalActivities.forEach((activity, index) => {
            summary += `   ${index + 1}. ${activity.name} - ${activity.day} (${activity.timeRange || activity.timeStart + '-' + activity.timeEnd})\n`;
        });
    } else {
        summary += `   ❌ No hay actividades externas\n`;
    }
    
    summary += `\n⚙️ PREFERENCIAS:\n`;
    if (Object.keys(preferences).length > 0) {
        summary += `   - Días disponibles: ${preferences.availableDays?.join(', ') || 'No configurado'}\n`;
        summary += `   - Horario preferido: ${preferences.preferredTime || 'No configurado'}\n`;
        summary += `   - Horarios bloqueados: ${preferences.blockedTimes?.length || 0}\n`;
    } else {
        summary += `   ❌ No hay preferencias configuradas\n`;
    }
    
    // Mostrar en consola y alert
    console.log(summary);
    alert(summary);
    
    // Actualizar panel de información si existe
    showSelectedSubjectsInfo();
    
    return { subjects, preferences, externalActivities };
}

// Funciones de navegación rápida
function goToSubjects() {
    if (confirm('¿Ir a la página de gestión de materias para seleccionar materias?')) {
        window.location.href = 'dashboard.html';
    }
}

function goToPreferences() {
    if (confirm('¿Ir a la página de preferencias para configurar horarios y actividades externas?')) {
        window.location.href = 'preferences.html';
    }
}

// Función para mostrar ayuda contextual
function showScheduleHelp() {
    const helpText = `
🎓 AYUDA - GENERADOR DE HORARIOS

Para usar el generador necesitas:

1️⃣ MATERIAS SELECCIONADAS:
   • Ve a "Dashboard" → selecciona materias de la lista
   • Necesitas al menos 1 materia para generar horarios

2️⃣ CONFIGURAR PREFERENCIAS (Opcional):
   • Ve a "Preferences" → configura días disponibles
   • Configura horarios preferidos
   • Agrega actividades externas

3️⃣ GENERAR HORARIOS:
   • Vuelve aquí y click "Generar Horarios"
   • Navega entre diferentes opciones
   • Agrega cursos manuales si necesitas

🔧 BOTONES ÚTILES:
   • "Ver Datos Actuales" - revisa qué tienes guardado
   • "Cargar Datos de Prueba" - datos de ejemplo para probar
   • "Agregar Curso Manual" - añadir cursos personalizados

❓ ¿Problemas?
   • Revisa la consola del navegador (F12)
   • Usa "Ver Datos Actuales" para diagnóstico
    `;
    
    alert(helpText);
    console.log(helpText);
}

// Mostrar información de preferencias
function showPreferencesInfo() {
    console.log('Mostrando info de preferencias');
    // Función placeholder
}

function showUserPreferencesInfo() {
    console.log('Mostrando info de preferencias de usuario');
    // Función placeholder
}

// Función para cargar datos de prueba
function loadTestData() {
    console.log('🧪 Cargando datos de prueba...');
    
    const testSubjects = [
        { id: 'algebra', name: 'Álgebra Lineal', credits: 3, code: 'MAT200', category: 'matematicas' },
        { id: 'programacion', name: 'Programación Avanzada', credits: 4, code: 'CS204', category: 'programacion' },
        { id: 'basedatos', name: 'Base de Datos', credits: 3, code: 'CS301', category: 'programacion' },
        { id: 'calculo', name: 'Cálculo Diferencial', credits: 4, code: 'MAT201', category: 'matematicas' }
    ];
    
    const testPreferences = {
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        preferredTime: 'morning',
        studyStyle: 'concentrated',
        breakTime: 15
    };
    
    const testActivities = [
        { 
            id: 'gym1',
            name: 'Gimnasio', 
            day: 'lunes', 
            timeStart: '6:00 PM', 
            timeEnd: '8:00 PM',
            timeRange: '6:00 PM - 8:00 PM'
        },
        { 
            id: 'trabajo1',
            name: 'Trabajo Medio Tiempo', 
            day: 'miércoles', 
            timeStart: '2:00 PM', 
            timeEnd: '5:00 PM',
            timeRange: '2:00 PM - 5:00 PM'
        },
        { 
            id: 'idiomas1',
            name: 'Clases de Inglés', 
            day: 'viernes', 
            timeStart: '4:00 PM', 
            timeEnd: '6:00 PM',
            timeRange: '4:00 PM - 6:00 PM'
        }
    ];
    
    localStorage.setItem('selectedSubjects', JSON.stringify(testSubjects));
    localStorage.setItem('userPreferences', JSON.stringify(testPreferences));
    localStorage.setItem('externalActivities', JSON.stringify(testActivities));
    
    console.log('✅ Datos de prueba cargados');
    showAlert('✅ Datos de prueba cargados. Ahora puedes generar horarios.', 'success');
    
    // Recargar datos
    loadUserPreferences();
    loadSelectedSubjects();
    
    // Habilitar botón de generar
    const generateBtn = document.querySelector('.generate-btn');
    if (generateBtn) {
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generar Horarios Inteligentes';
    }
}

// Función de alertas
function showAlert(message, type = 'info') {
    console.log(`ALERT [${type}]: ${message}`);
    
    // Crear alerta visual simple
    const alertDiv = document.createElement('div');
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        max-width: 400px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : type === 'warning' ? '#ffc107' : '#17a2b8'};
    `;
    alertDiv.textContent = message;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 5000);
}

// Funciones placeholder para mantener compatibilidad
function addCustomCourse() {
    console.log('Abriendo modal para agregar curso manual');
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
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
    
    modal.innerHTML = `
        <div class="modal" style="background: white; border-radius: 8px; padding: 20px; max-width: 500px; width: 90%;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3><i class="fas fa-plus"></i> Agregar Curso Manual</h3>
                <button onclick="this.closest('.modal-overlay').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer;">×</button>
            </div>
            <div class="modal-body">
                <form onsubmit="submitCustomCourse(event)">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Nombre del Curso:</label>
                        <input type="text" id="courseName" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Día:</label>
                        <select id="courseDay" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            <option value="">Seleccionar día</option>
                            <option value="Monday">Lunes</option>
                            <option value="Tuesday">Martes</option>
                            <option value="Wednesday">Miércoles</option>
                            <option value="Thursday">Jueves</option>
                            <option value="Friday">Viernes</option>
                        </select>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Hora de Inicio:</label>
                        <select id="courseTime" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            <option value="">Seleccionar hora</option>
                            <option value="7:00 AM - 8:30 AM">7:00 AM - 8:30 AM</option>
                            <option value="8:00 AM - 9:30 AM">8:00 AM - 9:30 AM</option>
                            <option value="9:00 AM - 10:30 AM">9:00 AM - 10:30 AM</option>
                            <option value="10:00 AM - 11:30 AM">10:00 AM - 11:30 AM</option>
                            <option value="11:00 AM - 12:30 PM">11:00 AM - 12:30 PM</option>
                            <option value="12:00 PM - 1:30 PM">12:00 PM - 1:30 PM</option>
                            <option value="1:00 PM - 2:30 PM">1:00 PM - 2:30 PM</option>
                            <option value="2:00 PM - 3:30 PM">2:00 PM - 3:30 PM</option>
                            <option value="3:00 PM - 4:30 PM">3:00 PM - 4:30 PM</option>
                            <option value="4:00 PM - 5:30 PM">4:00 PM - 5:30 PM</option>
                            <option value="5:00 PM - 6:30 PM">5:00 PM - 6:30 PM</option>
                            <option value="6:00 PM - 7:30 PM">6:00 PM - 7:30 PM</option>
                        </select>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Aula:</label>
                        <input type="text" id="courseRoom" placeholder="Ej: A101" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div style="display: flex; gap: 10px; justify-content: flex-end;">
                        <button type="button" onclick="this.closest('.modal-overlay').remove()" style="padding: 10px 20px; border: 1px solid #ddd; background: #f8f9fa; border-radius: 4px; cursor: pointer;">Cancelar</button>
                        <button type="submit" style="padding: 10px 20px; border: none; background: #007bff; color: white; border-radius: 4px; cursor: pointer;">Agregar Curso</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function submitCustomCourse(event) {
    event.preventDefault();
    
    const courseName = document.getElementById('courseName').value;
    const courseDay = document.getElementById('courseDay').value;
    const courseTime = document.getElementById('courseTime').value;
    const courseRoom = document.getElementById('courseRoom').value || 'Aula Asignada';
    
    console.log('Agregando curso manual:', { courseName, courseDay, courseTime, courseRoom });
    
    // Crear curso manual
    const manualCourse = {
        name: courseName,
        day: courseDay,
        time: courseTime,
        room: courseRoom,
        color: 'manual',
        isManual: true
    };
    
    // Buscar slot y colocar el curso
    const slot = findSlotForCourse(manualCourse);
    if (slot) {
        if (slot.innerHTML.trim() !== '') {
            showAlert('⚠️ Ya hay un curso en ese horario. Selecciona otro horario.', 'warning');
            return;
        }
        
        slot.innerHTML = `
            <div class="class-block manual" style="background: #e74c3c; color: white;">
                <div class="class-name">${manualCourse.name}</div>
                <div class="class-time">${manualCourse.time}</div>
                <div class="class-room">${manualCourse.room}</div>
                <button onclick="removeManualCourse(this)" style="position: absolute; top: 2px; right: 2px; background: rgba(255,255,255,0.3); border: none; color: white; border-radius: 50%; width: 16px; height: 16px; font-size: 10px; cursor: pointer;">×</button>
            </div>
        `;
        slot.classList.add('occupied', 'manual');
        
        showAlert(`✅ Curso "${courseName}" agregado exitosamente`, 'success');
        
        // Cerrar modal
        document.querySelector('.modal-overlay').remove();
    } else {
        showAlert('❌ Error: No se pudo encontrar el slot para ese horario', 'error');
    }
}

function removeManualCourse(button) {
    const slot = button.closest('.slot');
    if (slot) {
        slot.innerHTML = '';
        slot.classList.remove('occupied', 'manual');
        showAlert('Curso manual eliminado', 'info');
    }
}

function saveSchedule() {
    if (generatedSchedules.length === 0) {
        showAlert('❌ No hay horario para guardar. Genera un horario primero.', 'warning');
        return;
    }
    
    const currentSchedule = generatedSchedules[currentScheduleIndex];
    const savedSchedules = JSON.parse(localStorage.getItem('savedSchedules')) || [];
    
    // Añadir timestamp
    const scheduleToSave = {
        ...currentSchedule,
        savedAt: new Date().toLocaleString(),
        id: Date.now()
    };
    
    savedSchedules.push(scheduleToSave);
    localStorage.setItem('savedSchedules', JSON.stringify(savedSchedules));
    
    showAlert(`✅ Horario "${currentSchedule.name}" guardado exitosamente`, 'success');
    console.log('Horario guardado:', scheduleToSave);
}

function exportSchedule() {
    if (generatedSchedules.length === 0) {
        showAlert('❌ No hay horario para exportar. Genera un horario primero.', 'warning');
        return;
    }
    
    const currentSchedule = generatedSchedules[currentScheduleIndex];
    
    // Crear contenido HTML para exportar
    const exportContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Horario - ${currentSchedule.name}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .schedule-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                .schedule-table th, .schedule-table td { border: 1px solid #ddd; padding: 10px; text-align: center; }
                .schedule-table th { background-color: #f2f2f2; font-weight: bold; }
                .course { background-color: #e3f2fd; padding: 5px; border-radius: 4px; margin: 2px 0; }
                .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>MatriFlex UNSA</h1>
                <h2>${currentSchedule.name}</h2>
                <p>Calidad: ${currentSchedule.quality}% | Generado: ${new Date().toLocaleString()}</p>
            </div>
            
            <table class="schedule-table">
                <tr>
                    <th>Hora</th>
                    <th>Lunes</th>
                    <th>Martes</th>
                    <th>Miércoles</th>
                    <th>Jueves</th>
                    <th>Viernes</th>
                </tr>
                ${generateScheduleTableRows(currentSchedule)}
            </table>
            
            <div class="footer">
                <p>Generado por MatriFlex UNSA - Sistema de Gestión Académica</p>
            </div>
        </body>
        </html>
    `;
    
    // Crear y descargar archivo
    const blob = new Blob([exportContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `horario_${currentSchedule.name.replace(/\s+/g, '_')}_${new Date().getTime()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showAlert('✅ Horario exportado como archivo HTML', 'success');
}

function generateScheduleTableRows(schedule) {
    const timeSlots = [
        '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
        '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
    ];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    return timeSlots.map(time => {
        const row = [`<td><strong>${time}</strong></td>`];
        
        days.forEach(day => {
            const course = schedule.courses.find(c => 
                c.day === day && c.time.startsWith(time)
            );
            
            if (course) {
                row.push(`<td><div class="course">${course.name}<br><small>${course.room}</small></div></td>`);
            } else {
                row.push('<td></td>');
            }
        });
        
        return `<tr>${row.join('')}</tr>`;
    }).join('');
}

function printSchedule() {
    if (generatedSchedules.length === 0) {
        showAlert('❌ No hay horario para imprimir. Genera un horario primero.', 'warning');
        return;
    }
    
    const currentSchedule = generatedSchedules[currentScheduleIndex];
    
    // Crear ventana de impresión
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Imprimir Horario - ${currentSchedule.name}</title>
            <style>
                @media print {
                    body { margin: 0; }
                    .no-print { display: none; }
                }
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .schedule-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                .schedule-table th, .schedule-table td { border: 1px solid #ddd; padding: 8px; text-align: center; font-size: 12px; }
                .schedule-table th { background-color: #f2f2f2; font-weight: bold; }
                .course { background-color: #e3f2fd; padding: 4px; border-radius: 3px; margin: 1px 0; }
                .footer { margin-top: 20px; text-align: center; color: #666; font-size: 10px; }
                .print-btn { margin: 20px auto; display: block; padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>MatriFlex UNSA</h1>
                <h2>${currentSchedule.name}</h2>
                <p>Calidad: ${currentSchedule.quality}% | Fecha: ${new Date().toLocaleDateString()}</p>
            </div>
            
            <table class="schedule-table">
                <tr>
                    <th>Hora</th>
                    <th>Lunes</th>
                    <th>Martes</th>
                    <th>Miércoles</th>
                    <th>Jueves</th>
                    <th>Viernes</th>
                </tr>
                ${generateScheduleTableRows(currentSchedule)}
            </table>
            
            <div class="footer">
                <p>Generado por MatriFlex UNSA - Sistema de Gestión Académica</p>
            </div>
            
            <button class="print-btn no-print" onclick="window.print()">Imprimir</button>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    
    // Auto-imprimir después de cargar
    printWindow.onload = function() {
        setTimeout(() => {
            printWindow.print();
        }, 500);
    };
    
    showAlert('✅ Abriendo ventana de impresión...', 'success');
}

console.log('✅ Archivo schedule.js cargado completamente');
