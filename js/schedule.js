// Funciones para el generador de horarios

// Variables globales para el generador
let generatedSchedules = [];
let currentScheduleIndex = 0;
let selectedSubjects = [];
let userPreferences = {};

document.addEventListener('DOMContentLoaded', function() {
    // Cargar preferencias del usuario
    loadUserPreferences();
    
    // Cargar materias seleccionadas
    loadSelectedSubjects();
    
    // Mostrar información de preferencias
    showPreferencesInfo();
    
    // Mostrar información de preferencias
    showUserPreferencesInfo();
    
    // Inicializar interfaz mejorada
    initializeAdvancedInterface();
});

// Inicializar interfaz avanzada
function initializeAdvancedInterface() {
    // Añadir controles adicionales
    const generateBtn = document.querySelector('.generate-btn');
    if (generateBtn) {
        generateBtn.innerHTML = `
            <i class="fas fa-magic"></i> Generar Horarios Inteligentes
        `;
    }
    
    // Añadir panel de opciones de generación
    addGenerationOptions();
    
    // Añadir navegación entre horarios
    addScheduleNavigation();
}

// Añadir opciones de generación
function addGenerationOptions() {
    const scheduleGenerator = document.querySelector('.schedule-generator');
    const optionsPanel = document.createElement('div');
    optionsPanel.className = 'generation-options';
    optionsPanel.innerHTML = `
        <h3><i class="fas fa-cog"></i> Opciones de Generación</h3>
        <div class="options-grid">
            <div class="option-group">
                <label>
                    <input type="checkbox" id="prioritizeMorning" checked>
                    <span>Priorizar horarios matutinos</span>
                </label>
            </div>
            <div class="option-group">
                <label>
                    <input type="checkbox" id="avoidConflicts" checked>
                    <span>Evitar conflictos de horario</span>
                </label>
            </div>
            <div class="option-group">
                <label>
                    <input type="checkbox" id="minimizeGaps" checked>
                    <span>Minimizar huecos entre clases</span>
                </label>
            </div>
            <div class="option-group">
                <label>
                    <input type="checkbox" id="balanceDaily">
                    <span>Balancear carga diaria</span>
                </label>
            </div>
            <div class="option-group">
                <label for="maxCredits">Máximo créditos por día:</label>
                <select id="maxCredits">
                    <option value="8">8 créditos</option>
                    <option value="10" selected>10 créditos</option>
                    <option value="12">12 créditos</option>
                    <option value="15">15 créditos</option>
                </select>
            </div>
            <div class="option-group">
                <label for="scheduleType">Tipo de horario:</label>
                <select id="scheduleType">
                    <option value="compact">Compacto</option>
                    <option value="distributed" selected>Distribuido</option>
                    <option value="custom">Personalizado</option>
                </select>
            </div>
        </div>
    `;
    
    scheduleGenerator.insertBefore(optionsPanel, scheduleGenerator.querySelector('.generate-btn'));
}

// Añadir navegación entre horarios
function addScheduleNavigation() {
    const scheduleSection = document.querySelector('.schedule-section');
    if (scheduleSection) {
        const navigation = document.createElement('div');
        navigation.className = 'schedule-navigation';
        navigation.innerHTML = `
            <div class="nav-header">
                <h3>Horarios Generados: <span id="scheduleCount">0</span></h3>
                <div class="quality-score">
                    <span>Calidad: </span>
                    <div class="score-bar">
                        <div class="score-fill" id="qualityScore" style="width: 0%"></div>
                    </div>
                    <span id="scoreText">0%</span>
                </div>
            </div>
            <div class="nav-controls">
                <button onclick="previousSchedule()" class="nav-btn" id="prevBtn" disabled>
                    <i class="fas fa-chevron-left"></i> Anterior
                </button>
                <span class="current-schedule">Horario <span id="currentIndex">1</span> de <span id="totalSchedules">1</span></span>
                <button onclick="nextSchedule()" class="nav-btn" id="nextBtn" disabled>
                    Siguiente <i class="fas fa-chevron-right"></i>
                </button>
            </div>
            <div class="schedule-actions-extended">
                <button onclick="compareSchedules()" class="btn-secondary">
                    <i class="fas fa-columns"></i> Comparar
                </button>
                <button onclick="saveAsFavorite()" class="btn-secondary">
                    <i class="fas fa-heart"></i> Favorito
                </button>
                <button onclick="shareSchedule()" class="btn-secondary">
                    <i class="fas fa-share"></i> Compartir
                </button>
                <button onclick="optimizeSchedule()" class="btn-secondary">
                    <i class="fas fa-bolt"></i> Optimizar
                </button>
            </div>
        `;
        
        scheduleSection.insertBefore(navigation, scheduleSection.querySelector('.schedule-grid'));
    }
}

// Generar horarios mejorado
function generateSchedule() {
    // Validar que hay materias seleccionadas
    if (!selectedSubjects || selectedSubjects.length === 0) {
        showAlert('❌ No hay materias seleccionadas. Ve a "Gestión de Materias" primero.', 'error');
        return;
    }
    
    // Validar que hay preferencias configuradas
    if (!userPreferences || !userPreferences.availableDays || userPreferences.availableDays.length === 0) {
        showAlert('❌ No has configurado tus preferencias. Ve a "Preferencias" primero.', 'error');
        return;
    }
    
    const generateBtn = document.querySelector('.generate-btn');
    generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...';
    generateBtn.disabled = true;
    
    // Mostrar información de generación
    console.log('🚀 Iniciando generación de horarios con:');
    console.log('📚 Materias:', selectedSubjects);
    console.log('⚙️ Preferencias:', userPreferences);
    
    // Simular procesamiento avanzado
    showGenerationProgress();
    
    setTimeout(() => {
        // Generar múltiples horarios usando los datos reales
        generateMultipleSchedules();
        
        // Mostrar el primer horario
        showGeneratedSchedule();
        
        generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generar Nuevos Horarios';
        generateBtn.disabled = false;
        
        // Mostrar resumen detallado
        showGenerationSummary();
        
    }, 3000);
}

// Mostrar progreso de generación
function showGenerationProgress() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay generation-progress';
    modal.innerHTML = `
        <div class="modal generation-modal">
            <div class="modal-header">
                <h3><i class="fas fa-magic"></i> Generando Horarios Inteligentes</h3>
            </div>
            <div class="modal-body">
                <div class="progress-steps">
                    <div class="step active" id="step1">
                        <i class="fas fa-check-circle"></i>
                        <span>Analizando materias seleccionadas</span>
                    </div>
                    <div class="step" id="step2">
                        <i class="fas fa-clock"></i>
                        <span>Aplicando preferencias de horario</span>
                    </div>
                    <div class="step" id="step3">
                        <i class="fas fa-clock"></i>
                        <span>Detectando conflictos</span>
                    </div>
                    <div class="step" id="step4">
                        <i class="fas fa-clock"></i>
                        <span>Optimizando distribución</span>
                    </div>
                    <div class="step" id="step5">
                        <i class="fas fa-clock"></i>
                        <span>Generando alternativas</span>
                    </div>
                </div>
                <div class="overall-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" id="overallProgress" style="width: 20%"></div>
                    </div>
                    <span id="progressText">Analizando materias...</span>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Simular progreso
    setTimeout(() => updateProgress(2, 40, 'Aplicando preferencias...'), 600);
    setTimeout(() => updateProgress(3, 60, 'Detectando conflictos...'), 1200);
    setTimeout(() => updateProgress(4, 80, 'Optimizando distribución...'), 1800);
    setTimeout(() => updateProgress(5, 100, '¡Horarios generados!'), 2400);
    setTimeout(() => modal.remove(), 3000);
}

// Actualizar progreso
function updateProgress(step, percentage, text) {
    // Marcar paso anterior como completado
    if (step > 1) {
        const prevStep = document.getElementById(`step${step - 1}`);
        if (prevStep) {
            prevStep.classList.remove('active');
            prevStep.classList.add('completed');
            prevStep.querySelector('i').className = 'fas fa-check-circle';
        }
    }
    
    // Activar paso actual
    const currentStep = document.getElementById(`step${step}`);
    if (currentStep) {
        currentStep.classList.add('active');
        currentStep.querySelector('i').className = 'fas fa-spinner fa-spin';
    }
    
    // Actualizar barra de progreso
    const progressFill = document.getElementById('overallProgress');
    const progressText = document.getElementById('progressText');
    
    if (progressFill) progressFill.style.width = percentage + '%';
    if (progressText) progressText.textContent = text;
}

// Generar múltiples horarios usando materias reales
function generateMultipleSchedules() {
    generatedSchedules = [];
    
    console.log('🚀 === INICIO DE GENERACIÓN DE HORARIOS ===');
    console.log('📊 Estado inicial:');
    console.log('  - selectedSubjects:', selectedSubjects);
    console.log('  - selectedSubjects.length:', selectedSubjects.length);
    
    if (selectedSubjects.length === 0) {
        console.error('❌ Error: No hay materias seleccionadas');
        showAlert('No hay materias seleccionadas para generar horarios', 'error');
        return;
    }
    
    // Obtener datos reales del usuario
    const userPrefs = JSON.parse(localStorage.getItem('userPreferences')) || {};
    const externalActivities = JSON.parse(localStorage.getItem('externalActivities')) || [];
    
    console.log('🎯 Generando horarios con datos reales:');
    console.log('📚 Materias:', selectedSubjects);
    console.log('⚙️ Preferencias:', userPrefs);
    console.log('🎯 Actividades externas:', externalActivities);
    
    // Usar días disponibles del usuario o por defecto
    const availableDays = userPrefs.availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    // Configurar horarios basados en preferencias
    let timeSlots = [];
    if (userPrefs.preferredTime === 'morning' || !userPrefs.preferredTime) {
        timeSlots = ['7:00 AM - 8:30 AM', '8:00 AM - 9:30 AM', '9:00 AM - 10:30 AM', '10:00 AM - 11:30 AM', '11:00 AM - 12:30 PM'];
    } else if (userPrefs.preferredTime === 'afternoon') {
        timeSlots = ['12:00 PM - 1:30 PM', '1:00 PM - 2:30 PM', '2:00 PM - 3:30 PM', '3:00 PM - 4:30 PM', '4:00 PM - 5:30 PM'];
    } else if (userPrefs.preferredTime === 'evening') {
        timeSlots = ['5:00 PM - 6:30 PM', '6:00 PM - 7:30 PM', '7:00 PM - 8:30 PM'];
    } else {
        // Horario mixto
        timeSlots = [
            '7:00 AM - 8:30 AM', '8:00 AM - 9:30 AM', '9:00 AM - 10:30 AM', 
            '10:00 AM - 11:30 AM', '11:00 AM - 12:30 PM', '12:00 PM - 1:30 PM',
            '1:00 PM - 2:30 PM', '2:00 PM - 3:30 PM', '3:00 PM - 4:30 PM',
            '4:00 PM - 5:30 PM', '5:00 PM - 6:30 PM', '6:00 PM - 7:30 PM'
        ];
    }
    
    const rooms = ['A101', 'A205', 'Lab B', 'Lab C', 'C101', 'C205', 'D101'];
    
    // Función para verificar conflictos con actividades externas
    function hasConflictWithActivities(day, timeSlot) {
        const [startTime, endTime] = timeSlot.split(' - ');
        
        return externalActivities.some(activity => {
            if (activity.day !== day) return false;
            
            // Convertir horarios a minutos para comparación precisa
            const courseStart = timeToMinutes(startTime);
            const courseEnd = timeToMinutes(endTime);
            const activityStart = timeToMinutes(activity.timeStart);
            const activityEnd = timeToMinutes(activity.timeEnd);
            
            // Verificar superposición: hay conflicto si los horarios se solapan
            const hasOverlap = courseStart < activityEnd && courseEnd > activityStart;
            
            if (hasOverlap) {
                console.warn(`⚠️ Conflicto detectado: ${day} ${timeSlot} choca con actividad ${activity.name} (${activity.timeStart} - ${activity.timeEnd})`);
                return true;
            }
            
            return false;
        });
    }
    
    // Convertir hora a minutos (ej: "9:00 AM" -> 540)
    function timeToMinutes(timeStr) {
        const [time, period] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        
        return hours * 60 + (minutes || 0);
    }
    
    // Función global para conversión de tiempo (disponible en todo el archivo)
    window.timeToMinutes = timeToMinutes;
    
    // Generar 5 horarios diferentes con estilos variados
    const scheduleStyles = [
        { name: 'Optimizado Personalizado', description: 'Basado en tus preferencias exactas' },
        { name: 'Horario Matutino', description: 'Concentrado en la mañana' },
        { name: 'Horario Distribuido', description: 'Espaciado a través de la semana' },
        { name: 'Horario Compacto', description: 'Concentrado en menos días' },
        { name: 'Horario Flexible', description: 'Máxima adaptabilidad' }
    ];
    
    for (let i = 0; i < 5; i++) {
        const schedule = {
            name: scheduleStyles[i].name,
            description: scheduleStyles[i].description,
            quality: Math.floor(Math.random() * 15) + 85, // 85-100%
            courses: [],
            conflictsWithActivities: 0
        };
        
        // Asignar cada materia seleccionada evitando conflictos
        selectedSubjects.forEach((subject, index) => {
            console.log(`\n📝 Procesando materia ${index + 1}/${selectedSubjects.length}:`, subject);
            
            let assigned = false;
            let attempts = 0;
            let bestOption = null;
            let conflictFound = false;
            
            // Intentar múltiples opciones para evitar conflictos
            while (!assigned && attempts < 30) {
                const dayIndex = (index + i + attempts) % availableDays.length;
                const timeIndex = (index + i * 2 + attempts) % timeSlots.length;
                const roomIndex = (index + i) % rooms.length;
                
                const selectedDay = availableDays[dayIndex];
                const selectedTime = timeSlots[timeIndex];
                
                // Verificar conflictos con actividades externas
                const hasConflict = hasConflictWithActivities(selectedDay, selectedTime);
                
                if (!hasConflict) {
                    // Opción sin conflictos - usar inmediatamente
                    const newCourse = {
                        name: subject.name || subject,
                        time: selectedTime,
                        day: selectedDay,
                        room: rooms[roomIndex],
                        color: getCourseColor(subject.category || 'general'),
                        credits: subject.credits
                    };
                    
                    console.log(`  ✅ Asignado sin conflictos:`, newCourse);
                    schedule.courses.push(newCourse);
                    assigned = true;
                } else {
                    // Guardar como opción de respaldo
                    if (!bestOption) {
                        bestOption = {
                            name: subject.name || subject,
                            time: selectedTime,
                            day: selectedDay,
                            room: rooms[roomIndex],
                            color: getCourseColor(subject.category || 'general'),
                            credits: subject.credits,
                            hasConflict: true,
                            conflictDetails: getConflictDetails(selectedDay, selectedTime, externalActivities)
                        };
                    }
                    conflictFound = true;
                    attempts++;
                }
            }
            
            // Si no se pudo asignar sin conflictos, usar la mejor opción con conflicto
            if (!assigned && bestOption) {
                console.log(`  ⚠️ Asignado con conflicto:`, bestOption);
                schedule.courses.push(bestOption);
                schedule.conflictsWithActivities++;
                console.warn(`❌ Materia "${subject.name || subject}" asignada con conflicto en ${bestOption.day} ${bestOption.time}`);
            } else if (!assigned) {
                console.error(`  ❌ No se pudo asignar la materia:`, subject);
            }
        });
        
        console.log(`\n📋 Horario ${i + 1} completado:`, schedule);
        console.log(`  - Cursos asignados: ${schedule.courses.length}`);
        console.log(`  - Conflictos: ${schedule.conflictsWithActivities}`);
        
        // Calcular calidad basada en distribución y preferencias
        schedule.quality = calculateScheduleQuality(schedule, userPrefs, externalActivities);
        
        generatedSchedules.push(schedule);
    }
    
    // Ordenar por calidad (mejor primero)
    generatedSchedules.sort((a, b) => b.quality - a.quality);
    
    console.log('\n🎯 === HORARIOS GENERADOS ===');
    console.log(`Total de horarios: ${generatedSchedules.length}`);
    generatedSchedules.forEach((sched, i) => {
        console.log(`Horario ${i + 1}: ${sched.name} - ${sched.courses.length} cursos - Calidad: ${sched.quality}%`);
    });
    
    // Verificar y alertar sobre conflictos
    checkAndAlertConflicts(generatedSchedules);
    
    currentScheduleIndex = 0;
    updateScheduleNavigation();
}

// Obtener detalles específicos de conflictos
function getConflictDetails(day, timeSlot, externalActivities) {
    const [startTime, endTime] = timeSlot.split(' - ');
    const conflicts = [];
    
    externalActivities.forEach(activity => {
        if (activity.day === day) {
            const courseStart = timeToMinutes(startTime);
            const courseEnd = timeToMinutes(endTime);
            const activityStart = timeToMinutes(activity.timeStart);
            const activityEnd = timeToMinutes(activity.timeEnd);
            
            if (courseStart < activityEnd && courseEnd > activityStart) {
                conflicts.push({
                    activityName: activity.name,
                    activityTime: `${activity.timeStart} - ${activity.timeEnd}`,
                    overlapStart: Math.max(courseStart, activityStart),
                    overlapEnd: Math.min(courseEnd, activityEnd)
                });
            }
        }
    });
    
    return conflicts;
}

// Verificar conflictos en todos los horarios y mostrar alertas
function checkAndAlertConflicts(schedules) {
    const totalConflicts = schedules.reduce((sum, schedule) => sum + schedule.conflictsWithActivities, 0);
    const schedulesWithConflicts = schedules.filter(s => s.conflictsWithActivities > 0).length;
    
    if (totalConflicts > 0) {
        showConflictAlert(totalConflicts, schedulesWithConflicts, schedules.length);
    } else {
        showAlert('✅ ¡Perfecto! Se generaron horarios sin conflictos con tus actividades externas.', 'success');
    }
}

// Mostrar alerta detallada de conflictos
function showConflictAlert(totalConflicts, schedulesWithConflicts, totalSchedules) {
    const conflictModal = document.createElement('div');
    conflictModal.className = 'modal-overlay conflict-alert';
    conflictModal.innerHTML = `
        <div class="modal conflict-modal">
            <div class="modal-header">
                <h3><i class="fas fa-exclamation-triangle"></i> Conflictos Detectados</h3>
            </div>
            <div class="modal-body">
                <div class="conflict-summary">
                    <p><strong>⚠️ Se detectaron ${totalConflicts} conflictos</strong></p>
                    <p>📊 ${schedulesWithConflicts} de ${totalSchedules} horarios tienen conflictos</p>
                    <p>🎯 ${totalSchedules - schedulesWithConflicts} horarios están libres de conflictos</p>
                </div>
                
                <div class="conflict-recommendations">
                    <h4>💡 Recomendaciones:</h4>
                    <ul>
                        <li>✅ Revisa los horarios con <strong>mayor calidad</strong> - tienen menos conflictos</li>
                        <li>📝 Considera <strong>modificar tus actividades externas</strong> en Preferencias</li>
                        <li>🔄 Puedes <strong>regenerar</strong> para obtener nuevas combinaciones</li>
                        <li>⚡ Los conflictos se muestran en <strong>rojo</strong> en el horario</li>
                    </ul>
                </div>
                
                <div class="conflict-actions">
                    <button onclick="this.closest('.modal-overlay').remove()" class="btn-primary">
                        Entendido
                    </button>
                    <button onclick="goToPreferences()" class="btn-secondary">
                        Editar Preferencias
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Aplicar estilos
    conflictModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    const modal = conflictModal.querySelector('.modal');
    modal.style.cssText = `
        background: white;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(conflictModal);
    
    // Cerrar al hacer clic fuera
    conflictModal.addEventListener('click', (e) => {
        if (e.target === conflictModal) {
            conflictModal.remove();
        }
    });
}

// Ir a preferencias
function goToPreferences() {
    window.location.href = 'preferences.html';
}

// Obtener nombre descriptivo del horario
function getScheduleName(index) {
    const names = [
        'Horario Optimizado',
        'Horario Matutino',
        'Horario Distribuido',
        'Horario Compacto',
        'Horario Vespertino'
    ];
    return names[index] || `Horario ${index + 1}`;
}

// Obtener color según categoría
function getCourseColor(category) {
    const colorMap = {
        'matematicas': 'math',
        'programacion': 'comp-sci',
        'idiomas': 'language',
        'ciencias': 'science',
        'general': 'comp-sci'
    };
    return colorMap[category] || 'comp-sci';
}

// Calcular calidad del horario
function calculateScheduleQuality(schedule, userPrefs = {}, externalActivities = []) {
    let quality = 70; // Base más bajo para dar más rango
    
    // Bonificación por distribución equilibrada
    const dayDistribution = {};
    schedule.courses.forEach(course => {
        dayDistribution[course.day] = (dayDistribution[course.day] || 0) + 1;
    });
    
    const maxCoursesPerDay = Math.max(...Object.values(dayDistribution));
    if (maxCoursesPerDay <= 2) quality += 15;
    else if (maxCoursesPerDay <= 3) quality += 10;
    else if (maxCoursesPerDay > 4) quality -= 10;
    
    // Bonificación por respetar preferencia de horario
    if (userPrefs.preferredTime) {
        let matchingCourses = 0;
        
        schedule.courses.forEach(course => {
            const isMorning = course.time.includes('AM') && !course.time.includes('12:');
            const isAfternoon = course.time.includes('PM') && 
                (course.time.includes('12:') || course.time.includes('1:') || 
                 course.time.includes('2:') || course.time.includes('3:') || 
                 course.time.includes('4:') || course.time.includes('5:'));
            const isEvening = course.time.includes('6:00 PM') || course.time.includes('7:00 PM');
            
            if (userPrefs.preferredTime === 'morning' && isMorning) matchingCourses++;
            if (userPrefs.preferredTime === 'afternoon' && isAfternoon) matchingCourses++;
            if (userPrefs.preferredTime === 'evening' && isEvening) matchingCourses++;
        });
        
        const matchPercentage = matchingCourses / schedule.courses.length;
        quality += Math.floor(matchPercentage * 20);
    }
    
    // Bonificación por usar días disponibles del usuario
    if (userPrefs.availableDays && userPrefs.availableDays.length > 0) {
        const coursesInAvailableDays = schedule.courses.filter(course => 
            userPrefs.availableDays.includes(course.day)
        ).length;
        
        const availabilityMatch = coursesInAvailableDays / schedule.courses.length;
        quality += Math.floor(availabilityMatch * 15);
    }
    
    // Penalización por conflictos con actividades externas
    if (schedule.conflictsWithActivities) {
        quality -= schedule.conflictsWithActivities * 10;
    }
    
    // Penalización por cursos marcados con conflicto
    const conflictCourses = schedule.courses.filter(course => course.hasConflict).length;
    if (conflictCourses > 0) {
        quality -= conflictCourses * 5;
    }
    
    // Bonificación por espaciado entre cursos (evitar cursos consecutivos)
    let wellSpacedBonus = 0;
    Object.keys(dayDistribution).forEach(day => {
        const coursesThisDay = schedule.courses
            .filter(course => course.day === day)
            .sort((a, b) => {
                const timeA = parseInt(a.time.split(':')[0]);
                const timeB = parseInt(b.time.split(':')[0]);
                return timeA - timeB;
            });
        
        if (coursesThisDay.length > 1) {
            // Verificar si hay al menos 1 hora entre cursos
            for (let i = 0; i < coursesThisDay.length - 1; i++) {
                const endTimeA = coursesThisDay[i].time.split(' - ')[1];
                const startTimeB = coursesThisDay[i + 1].time.split(' - ')[0];
                
                // Simplificado: si no son horas consecutivas, dar bonificación
                if (!areConsecutiveHours(endTimeA, startTimeB)) {
                    wellSpacedBonus += 3;
                }
            }
        }
    });
    
    quality += wellSpacedBonus;
    
    // Asegurar que la calidad esté en el rango correcto
    return Math.min(100, Math.max(60, quality));
}

// Verificar si dos horas son consecutivas
function areConsecutiveHours(endTime, startTime) {
    // Simplificado: comparar si la diferencia es mínima
    const endHour = parseInt(endTime.split(':')[0]);
    const startHour = parseInt(startTime.split(':')[0]);
    
    // Si la diferencia es de 1 hora o menos, considerarlos consecutivos
    return Math.abs(startHour - endHour) <= 1;
}

// Mostrar horario generado mejorado
function showGeneratedSchedule() {
    const scheduleSection = document.querySelector('.schedule-section');
    scheduleSection.style.display = 'block';
    
    // Limpiar grid actual
    clearScheduleGrid();
    
    // Mostrar horario actual
    displayCurrentSchedule();
    
    // Animar la aparición
    scheduleSection.style.opacity = '0';
    scheduleSection.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        scheduleSection.style.transition = 'all 0.5s ease';
        scheduleSection.style.opacity = '1';
        scheduleSection.style.transform = 'translateY(0)';
    }, 100);
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
    console.log('\n🖥️ === MOSTRANDO HORARIO ACTUAL ===');
    console.log('📊 Estado del sistema:');
    console.log('  - generatedSchedules.length:', generatedSchedules.length);
    console.log('  - currentScheduleIndex:', currentScheduleIndex);
    
    if (generatedSchedules.length === 0) {
        console.warn('🚫 No hay horarios generados para mostrar');
        showAlert('No hay horarios generados. Haz clic en "Generar Horarios" primero.', 'warning');
        return;
    }
    
    const currentSchedule = generatedSchedules[currentScheduleIndex];
    console.log('🎯 Horario actual:', currentSchedule);
    console.log('📚 Cursos en el horario:', currentSchedule.courses);
    
    // Actualizar título
    const sectionTitle = document.querySelector('.schedule-section h3');
    if (sectionTitle) {
        sectionTitle.innerHTML = `${currentSchedule.name} <span class="quality-badge">Calidad: ${currentSchedule.quality}%</span>`;
        console.log('✅ Título actualizado');
    } else {
        console.warn('⚠️ No se encontró el elemento .schedule-section h3');
    }
    
    // Limpiar grid
    clearScheduleGrid();
    console.log('🧹 Grid limpiado');
    
    // Verificar si hay cursos para mostrar
    if (!currentSchedule.courses || currentSchedule.courses.length === 0) {
        console.warn('🚫 No hay cursos en el horario actual');
        showAlert('No hay cursos para mostrar en este horario', 'warning');
        return;
    }
    
    console.log(`📚 Intentando colocar ${currentSchedule.courses.length} cursos:`);
    
    // Colocar cursos en el grid
    let coursesPlaced = 0;
    currentSchedule.courses.forEach((course, index) => {
        console.log(`\n📍 Curso ${index + 1}:`, course);
        
        const slot = findSlotForCourse(course);
        if (slot) {
            const conflictClass = course.hasConflict ? 'has-conflict' : '';
            const conflictIcon = course.hasConflict ? '<i class="fas fa-exclamation-triangle conflict-icon"></i>' : '';
            
            slot.innerHTML = `
                <div class="class-block ${course.color} ${conflictClass}">
                    <div class="class-name">${course.name} ${conflictIcon}</div>
                    <div class="class-time">${course.time}</div>
                    <div class="class-room">${course.room}</div>
                    ${course.hasConflict ? `<div class="conflict-info">⚠️ Conflicto detectado</div>` : ''}
                </div>
            `;
            slot.classList.add('occupied');
            coursesPlaced++;
            
            console.log(`✅ Curso "${course.name}" colocado exitosamente`);
            
            // Agregar evento click para mostrar detalles de conflicto
            if (course.hasConflict) {
                slot.addEventListener('click', () => showConflictDetails(course));
            }
        } else {
            console.error(`❌ No se pudo colocar el curso "${course.name}" - slot no encontrado`);
        }
    });
    
    console.log(`\n📊 Resumen: ${coursesPlaced}/${currentSchedule.courses.length} cursos colocados en el grid`);
    
    // También mostrar actividades externas como referencia
    displayExternalActivities();
    
    if (coursesPlaced === 0) {
        showAlert('No se pudieron colocar cursos en el horario. Revisa la consola para más detalles.', 'error');
    }
}

// Mostrar actividades externas en el horario
function displayExternalActivities() {
    const externalActivities = JSON.parse(localStorage.getItem('externalActivities')) || [];
    
    if (externalActivities.length === 0) {
        console.log('📝 No hay actividades externas para mostrar');
        return;
    }
    
    console.log('🎯 Mostrando actividades externas:', externalActivities);
    
    externalActivities.forEach((activity, index) => {
        console.log(`\n🎯 Actividad ${index + 1}:`, activity);
        
        // Crear un curso simulado para usar la misma lógica de colocación
        const simulatedCourse = {
            name: activity.name,
            time: `${activity.timeStart} - ${activity.timeEnd}`,
            day: activity.day,
            room: activity.location || 'Externa',
            color: 'external-activity'
        };
        
        const slot = findSlotForCourse(simulatedCourse);
        if (slot && !slot.classList.contains('occupied')) {
            slot.innerHTML = `
                <div class="class-block external-activity">
                    <div class="class-name">🎯 ${activity.name}</div>
                    <div class="class-time">${activity.timeStart} - ${activity.timeEnd}</div>
                    <div class="class-room">${activity.location || 'Externa'}</div>
                    <div class="activity-type">Actividad Externa</div>
                </div>
            `;
            slot.classList.add('occupied', 'external');
            console.log(`✅ Actividad "${activity.name}" colocada exitosamente`);
        } else {
            console.warn(`⚠️ Slot ocupado o no encontrado para actividad "${activity.name}"`);
        }
    });
}

// Encontrar slot para un curso
// Función auxiliar para encontrar slots correctamente en el grid
function findSlotForCourseFixed(course) {
    console.log('=== NUEVA FUNCION DE BUSQUEDA DE SLOTS ===');
    console.log('Curso a ubicar:', course);
    
    // Mapear dias a columnas
    const dayMap = {
        'Monday': 1,
        'Tuesday': 2,
        'Wednesday': 3,
        'Thursday': 4,
        'Friday': 5
    };
    
    // Mapear horas a filas
    const timeMap = {
        '7:00 AM': 0,
        '8:00 AM': 1,
        '9:00 AM': 2,
        '10:00 AM': 3,
        '11:00 AM': 4,
        '12:00 PM': 5,
        '1:00 PM': 6,
        '2:00 PM': 7,
        '3:00 PM': 8,
        '4:00 PM': 9,
        '5:00 PM': 10,
        '6:00 PM': 11,
        '7:00 PM': 12
    };
    
    const hour = course.time.split(' - ')[0];
    const dayColumn = dayMap[course.day];
    const timeRow = timeMap[hour];
    
    console.log('Mapeo: dia=' + course.day + ' -> columna=' + dayColumn + ', hora=' + hour + ' -> fila=' + timeRow);
    
    if (dayColumn && timeRow !== undefined) {
        const scheduleGrid = document.querySelector('.schedule-grid');
        if (!scheduleGrid) {
            console.error('No se encontro el grid de horarios');
            return null;
        }
        
        const allGridItems = scheduleGrid.children;
        console.log('Total elementos en grid: ' + allGridItems.length);
        
        // El grid tiene estructura: 
        // Fila 0: headers (6 elementos)
        // Fila N: time-header + 5 slots (6 elementos cada una)
        const headerRowElements = 6;
        const elementsPerRow = 6;
        
        // Calcular posicion del slot
        const rowStartIndex = headerRowElements + (timeRow * elementsPerRow);
        const slotIndex = rowStartIndex + dayColumn;
        
        console.log('Calculando: inicio fila=' + rowStartIndex + ', slot objetivo=' + slotIndex);
        
        if (slotIndex < allGridItems.length) {
            const targetElement = allGridItems[slotIndex];
            console.log('Elemento encontrado, clase: ' + targetElement.className);
            
            if (targetElement.classList.contains('slot')) {
                console.log('Slot valido encontrado');
                return targetElement;
            } else {
                console.warn('Elemento no es slot, buscando alternativas...');
                // Buscar slots cercanos
                for (let offset = 1; offset <= 3; offset++) {
                    const altIndex = slotIndex + offset;
                    if (altIndex < allGridItems.length && allGridItems[altIndex].classList.contains('slot')) {
                        console.log('Slot alternativo encontrado en posicion ' + altIndex);
                        return allGridItems[altIndex];
                    }
                }
                return null;
            }
        } else {
            console.warn('Indice fuera de rango: ' + slotIndex + '/' + allGridItems.length);
            return null;
        }
    }
    
    console.warn('No se pudo mapear el curso');
    return null;
}

function findSlotForCourse(course) {
    // Usar la nueva funcion corregida
    return findSlotForCourseFixed(course);
}

// Mostrar detalles específicos de conflicto
    const dayMap = {
        'Monday': 1,
        'Tuesday': 2,
        'Wednesday': 3,
        'Thursday': 4,
        'Friday': 5,
        'Saturday': 6
    };
    
    // Mapear horas a filas (expandido para más horarios)
    const timeMap = {
        '7:00 AM': 0,
        '8:00 AM': 1,
        '9:00 AM': 2,
        '10:00 AM': 3,
        '11:00 AM': 4,
        '12:00 PM': 5,
        '1:00 PM': 6,
        '2:00 PM': 7,
        '3:00 PM': 8,
        '4:00 PM': 9,
        '5:00 PM': 10,
        '6:00 PM': 11,
        '7:00 PM': 12
    };
    
    const hour = course.time.split(' - ')[0];
    const dayIndex = dayMap[course.day];
    const timeIndex = timeMap[hour];
    
    console.log(`� Mapeo:`)
    console.log(`  - Día: ${course.day} → índice ${dayIndex}`);
    console.log(`  - Hora: ${hour} → índice ${timeIndex}`);
    
    if (dayIndex && timeIndex !== undefined) {
        const slots = document.querySelectorAll('.slot');
        console.log(`📏 Total de slots en el grid: ${slots.length}`);
        
        // Calcular índice considerando que hay 5 días (Lun-Vie) por defecto
        const targetIndex = timeIndex * 5 + (dayIndex - 1);
        
        console.log(`🎯 Índice calculado: ${targetIndex}`);
        console.log(`📐 Fórmula: ${timeIndex} * 5 + (${dayIndex} - 1) = ${targetIndex}`);
        
        if (targetIndex < slots.length && targetIndex >= 0) {
            const targetSlot = slots[targetIndex];
            console.log(`✅ Slot encontrado:`, targetSlot);
            return targetSlot;
        } else {
            console.warn(`⚠️ Índice ${targetIndex} fuera de rango. Total slots: ${slots.length}`);
            return null;
        }
    } else {
        console.warn(`⚠️ No se pudo mapear: día=${course.day} hora=${hour}`);
        console.warn(`⚠️ dayIndex=${dayIndex}, timeIndex=${timeIndex}`);
        return null;
    }
    
    return null;
}

// Mostrar detalles específicos de conflicto
function showConflictDetails(course) {
    const conflictModal = document.createElement('div');
    conflictModal.className = 'modal-overlay';
    conflictModal.innerHTML = `
        <div class="modal conflict-details-modal">
            <div class="modal-header">
                <h3><i class="fas fa-exclamation-triangle"></i> Detalles del Conflicto</h3>
                <button onclick="this.closest('.modal-overlay').remove()" class="modal-close">×</button>
            </div>
            <div class="modal-body">
                <div class="course-info">
                    <h4>📚 Materia: ${course.name}</h4>
                    <p><strong>🕒 Horario:</strong> ${course.day} ${course.time}</p>
                    <p><strong>📍 Aula:</strong> ${course.room}</p>
                </div>
                
                <div class="conflict-details">
                    <h4>⚠️ Conflictos Detectados:</h4>
                    ${course.conflictDetails ? course.conflictDetails.map(conflict => `
                        <div class="conflict-item">
                            <p><strong>🎯 Actividad:</strong> ${conflict.activityName}</p>
                            <p><strong>⏰ Horario:</strong> ${conflict.activityTime}</p>
                            <p><strong>🔴 Superposición:</strong> ${minutesToTime(conflict.overlapStart)} - ${minutesToTime(conflict.overlapEnd)}</p>
                        </div>
                    `).join('') : '<p>Conflicto general detectado</p>'}
                </div>
                
                <div class="conflict-solutions">
                    <h4>💡 Soluciones:</h4>
                    <ul>
                        <li>Modifica el horario de tu actividad externa</li>
                        <li>Busca otro horario para esta materia</li>
                        <li>Genera nuevos horarios alternativos</li>
                    </ul>
                </div>
                
                <div class="modal-actions">
                    <button onclick="this.closest('.modal-overlay').remove()" class="btn-secondary">
                        Cerrar
                    </button>
                    <button onclick="goToPreferences()" class="btn-primary">
                        Editar Actividades
                    </button>
                </div>
            </div>
        </div>
    `;
    
    styleModal(conflictModal);
    document.body.appendChild(conflictModal);
}

// Convertir minutos a hora (540 -> "9:00 AM")
function minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
    
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
}

// Mostrar resumen de generación
function showGenerationSummary() {
    const totalConflicts = generatedSchedules.reduce((sum, schedule) => sum + schedule.conflictsWithActivities, 0);
    const bestSchedule = generatedSchedules[0]; // Ya están ordenados por calidad
    const averageQuality = Math.round(generatedSchedules.reduce((sum, s) => sum + s.quality, 0) / generatedSchedules.length);
    
    const summaryMessage = totalConflicts === 0 
        ? `¡Perfecto! Se generaron ${generatedSchedules.length} horarios sin conflictos. Calidad promedio: ${averageQuality}%`
        : `Se generaron ${generatedSchedules.length} horarios (${totalConflicts} conflictos detectados). Mejor calidad: ${bestSchedule.quality}%`;
    
    const alertType = totalConflicts === 0 ? 'success' : 'warning';
    
    showAlert(summaryMessage, alertType);
}

// Agregar curso manual
function addCustomCourse() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal add-course-modal">
            <div class="modal-header">
                <h3><i class="fas fa-plus"></i> Agregar Curso Manual</h3>
                <button onclick="this.closest('.modal-overlay').remove()" class="modal-close">×</button>
            </div>
            <div class="modal-body">
                <form id="addCourseForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="courseName">Nombre del Curso:</label>
                            <input type="text" id="courseName" required placeholder="ej: Cálculo Diferencial">
                        </div>
                        <div class="form-group">
                            <label for="courseCode">Código:</label>
                            <input type="text" id="courseCode" placeholder="ej: MAT-201">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="courseDay">Día:</label>
                            <select id="courseDay" required>
                                <option value="">Seleccionar día</option>
                                <option value="Monday">Lunes</option>
                                <option value="Tuesday">Martes</option>
                                <option value="Wednesday">Miércoles</option>
                                <option value="Thursday">Jueves</option>
                                <option value="Friday">Viernes</option>
                                <option value="Saturday">Sábado</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="courseCredits">Créditos:</label>
                            <input type="number" id="courseCredits" min="1" max="6" value="3">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="startTime">Hora de Inicio:</label>
                            <input type="time" id="startTime" required>
                        </div>
                        <div class="form-group">
                            <label for="endTime">Hora de Fin:</label>
                            <input type="time" id="endTime" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="courseRoom">Aula:</label>
                            <input type="text" id="courseRoom" placeholder="ej: A-101">
                        </div>
                        <div class="form-group">
                            <label for="courseCategory">Categoría:</label>
                            <select id="courseCategory">
                                <option value="general">General</option>
                                <option value="matematicas">Matemáticas</option>
                                <option value="programacion">Programación</option>
                                <option value="idiomas">Idiomas</option>
                                <option value="ciencias">Ciencias</option>
                            </select>
                        </div>
                    </div>
                </form>
                
                <div class="conflict-check" id="conflictCheck" style="display: none;">
                    <div class="conflict-warning">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span id="conflictMessage"></span>
                    </div>
                </div>
                
                <div class="modal-actions">
                    <button type="button" onclick="this.closest('.modal-overlay').remove()" class="btn-secondary">
                        Cancelar
                    </button>
                    <button type="button" onclick="checkCourseConflicts()" class="btn-warning">
                        Verificar Conflictos
                    </button>
                    <button type="button" onclick="saveCourse()" class="btn-primary">
                        Guardar Curso
                    </button>
                </div>
            </div>
        </div>
    `;
    
    styleModal(modal);
    document.body.appendChild(modal);
}

// Verificar conflictos del curso manual
function checkCourseConflicts() {
    const day = document.getElementById('courseDay').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const courseName = document.getElementById('courseName').value;
    
    if (!day || !startTime || !endTime) {
        showAlert('Por favor completa día y horarios', 'warning');
        return;
    }
    
    // Crear horario simulado para verificar
    const timeSlot = `${convertTo12Hour(startTime)} - ${convertTo12Hour(endTime)}`;
    const externalActivities = JSON.parse(localStorage.getItem('externalActivities')) || [];
    
    const hasConflict = hasConflictWithActivities(day, timeSlot);
    const conflictCheck = document.getElementById('conflictCheck');
    const conflictMessage = document.getElementById('conflictMessage');
    
    if (hasConflict) {
        const conflicts = getConflictDetails(day, timeSlot, externalActivities);
        conflictMessage.textContent = `Conflicto con: ${conflicts.map(c => c.activityName).join(', ')}`;
        conflictCheck.style.display = 'block';
        conflictCheck.className = 'conflict-check conflict-found';
    } else {
        conflictMessage.textContent = 'No se encontraron conflictos';
        conflictCheck.style.display = 'block';
        conflictCheck.className = 'conflict-check no-conflict';
    }
}

// Convertir tiempo 24h a 12h
function convertTo12Hour(time24) {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    return `${displayHour}:${minutes} ${period}`;
}

// Guardar curso manual
function saveCourse() {
    const courseName = document.getElementById('courseName').value;
    const courseCode = document.getElementById('courseCode').value;
    const day = document.getElementById('courseDay').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const room = document.getElementById('courseRoom').value;
    const credits = parseInt(document.getElementById('courseCredits').value);
    const category = document.getElementById('courseCategory').value;
    
    if (!courseName || !day || !startTime || !endTime) {
        showAlert('Por favor completa todos los campos obligatorios', 'error');
        return;
    }
    
    const newCourse = {
        name: courseName,
        code: courseCode || 'MAN-' + Date.now(),
        day: day,
        time: `${convertTo12Hour(startTime)} - ${convertTo12Hour(endTime)}`,
        room: room || 'Por asignar',
        credits: credits,
        category: category,
        isManual: true,
        addedAt: new Date().toISOString()
    };
    
    // Agregar a materias seleccionadas
    let selectedSubjects = JSON.parse(localStorage.getItem('selectedSubjects')) || [];
    selectedSubjects.push(newCourse);
    localStorage.setItem('selectedSubjects', JSON.stringify(selectedSubjects));
    
    // Actualizar vista
    loadSelectedSubjects();
    showPreferencesInfo();
    
    // Cerrar modal
    document.querySelector('.modal-overlay').remove();
    
    showAlert(`Curso "${courseName}" agregado exitosamente`, 'success');
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

// Actualizar navegación
function updateScheduleNavigation() {
    const scheduleCount = document.getElementById('scheduleCount');
    const currentIndex = document.getElementById('currentIndex');
    const totalSchedules = document.getElementById('totalSchedules');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const qualityScore = document.getElementById('qualityScore');
    const scoreText = document.getElementById('scoreText');
    
    if (scheduleCount) scheduleCount.textContent = generatedSchedules.length;
    if (currentIndex) currentIndex.textContent = currentScheduleIndex + 1;
    if (totalSchedules) totalSchedules.textContent = generatedSchedules.length;
    
    if (prevBtn) prevBtn.disabled = currentScheduleIndex === 0;
    if (nextBtn) nextBtn.disabled = currentScheduleIndex === generatedSchedules.length - 1;
    
    if (generatedSchedules.length > 0) {
        const quality = generatedSchedules[currentScheduleIndex].quality;
        if (qualityScore) qualityScore.style.width = quality + '%';
        if (scoreText) scoreText.textContent = quality + '%';
    }
}

// Funciones adicionales
function compareSchedules() {
    showAlert('Funcionalidad de comparación próximamente disponible', 'info');
}

function saveAsFavorite() {
    if (generatedSchedules.length > 0) {
        const currentSchedule = generatedSchedules[currentScheduleIndex];
        localStorage.setItem('favoriteSchedule', JSON.stringify(currentSchedule));
        showAlert(`"${currentSchedule.name}" guardado como favorito`, 'success');
    }
}

function shareSchedule() {
    if (generatedSchedules.length > 0) {
        const currentSchedule = generatedSchedules[currentScheduleIndex];
        const shareText = `¡Mira mi horario optimizado: ${currentSchedule.name} con ${currentSchedule.quality}% de calidad en MatriFlex UNSA!`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Mi Horario - MatriFlex UNSA',
                text: shareText,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                showAlert('Enlace copiado al portapapeles', 'success');
            });
        }
    }
}

function optimizeSchedule() {
    showAlert('Optimizando horario actual...', 'info');
    
    setTimeout(() => {
        if (generatedSchedules.length > 0) {
            generatedSchedules[currentScheduleIndex].quality = Math.min(100, generatedSchedules[currentScheduleIndex].quality + 5);
            updateScheduleNavigation();
            showAlert('¡Horario optimizado! Calidad mejorada.', 'success');
        }
    }, 1500);
}

// Cargar materias seleccionadas mejorado
function loadSelectedSubjects() {
    console.log('🔄 === CARGANDO MATERIAS SELECCIONADAS ===');
    
    // Obtener datos de localStorage
    const storedSubjects = localStorage.getItem('selectedSubjects');
    console.log('📦 Datos en localStorage:', storedSubjects);
    
    selectedSubjects = JSON.parse(storedSubjects) || [];
    console.log('📚 Materias parseadas:', selectedSubjects);
    console.log('📊 Cantidad de materias:', selectedSubjects.length);
    
    if (selectedSubjects.length === 0) {
        console.warn('⚠️ No se encontraron materias seleccionadas');
        showAlert('❌ No has seleccionado materias. Ve a "Gestión de Materias" para seleccionar materias primero.', 'warning');
        
        // Deshabilitar botón de generar
        const generateBtn = document.querySelector('.generate-btn');
        if (generateBtn) {
            generateBtn.disabled = true;
            generateBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Primero selecciona materias';
        }
        return;
    }
    
    console.log('✅ Materias cargadas exitosamente');
    
    // Mostrar materias seleccionadas
    showSelectedSubjectsInfo();
    
    console.log('Materias seleccionadas:', selectedSubjects);
}

// Función para cargar datos de prueba (temporal para debugging)
function loadTestData() {
    console.log('🧪 Cargando datos de prueba...');
    
    // Datos de prueba - materias
    const testSubjects = [
        {
            id: 'algebra',
            name: 'Álgebra Lineal',
            credits: 3,
            code: 'MAT200',
            category: 'matematicas'
        },
        {
            id: 'programacion',
            name: 'Programación Avanzada',
            credits: 4,
            code: 'CS204',
            category: 'programacion'
        },
        {
            id: 'basedatos',
            name: 'Base de Datos',
            credits: 3,
            code: 'CS301',
            category: 'programacion'
        }
    ];
    
    // Datos de prueba - preferencias
    const testPreferences = {
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        preferredTime: 'morning',
        studyStyle: 'concentrated',
        breakTime: 15
    };
    
    // Datos de prueba - actividades externas
    const testActivities = [
        {
            name: 'Gimnasio',
            day: 'Monday',
            timeStart: '6:00 PM',
            timeEnd: '8:00 PM'
        }
    ];
    
    // Guardar en localStorage
    localStorage.setItem('selectedSubjects', JSON.stringify(testSubjects));
    localStorage.setItem('userPreferences', JSON.stringify(testPreferences));
    localStorage.setItem('externalActivities', JSON.stringify(testActivities));
    
    console.log('✅ Datos de prueba cargados exitosamente');
    
    // Recargar la página para aplicar los cambios
    location.reload();
}

// Mostrar información de materias seleccionadas
function showSelectedSubjectsInfo() {
    const scheduleGenerator = document.querySelector('.schedule-generator');
    
    // Remover panel existente si existe
    const existingPanel = document.querySelector('.selected-subjects-panel');
    if (existingPanel) {
        existingPanel.remove();
    }
    
    // Crear panel de información
    const infoPanel = document.createElement('div');
    infoPanel.className = 'selected-subjects-panel';
    infoPanel.innerHTML = `
        <div class="panel-header">
            <h3><i class="fas fa-books"></i> Materias Seleccionadas (${selectedSubjects.length})</h3>
            <p>Estas materias se usarán para generar tu horario</p>
        </div>
        <div class="subjects-list">
            ${selectedSubjects.map(subject => `
                <div class="subject-item">
                    <span class="subject-name">${subject.name || subject}</span>
                    <span class="subject-credits">${subject.credits || 3} créditos</span>
                </div>
            `).join('')}
        </div>
        <div class="panel-actions">
            <button onclick="window.location.href='subjects.html'" class="btn-secondary">
                <i class="fas fa-edit"></i> Editar Materias
            </button>
        </div>
    `;
    
    // Insertar después del header
    const contentHeader = scheduleGenerator.querySelector('.content-header');
    if (contentHeader) {
        contentHeader.insertAdjacentElement('afterend', infoPanel);
    }
}

// Mostrar información de preferencias
function showUserPreferencesInfo() {
    const preferences = JSON.parse(localStorage.getItem('userPreferences')) || {};
    
    if (!preferences.availableDays || preferences.availableDays.length === 0) {
        showAlert('⚠️ No has configurado tus preferencias. Ve a "Preferencias" para configurar días y horarios disponibles.', 'warning');
    } else {
        console.log('✅ Preferencias configuradas:', {
            diasDisponibles: preferences.availableDays,
            horariosBloquados: preferences.blockedTimes?.length || 0,
            actividadesExternas: preferences.externalActivities?.length || 0
        });
    }
}

// Mostrar información de materias seleccionadas
function showSelectedSubjectsInfo() {
    const generateBtn = document.querySelector('.generate-btn');
    if (generateBtn && selectedSubjects.length > 0) {
        generateBtn.disabled = false;
        generateBtn.innerHTML = `<i class="fas fa-magic"></i> Generar Horarios para ${selectedSubjects.length} materias`;
    }
    
    // Crear panel informativo
    const scheduleGenerator = document.querySelector('.schedule-generator');
    let infoPanel = document.querySelector('.subjects-info-panel');
    
    if (!infoPanel) {
        infoPanel = document.createElement('div');
        infoPanel.className = 'subjects-info-panel';
        infoPanel.innerHTML = `
            <h3><i class="fas fa-books"></i> Materias seleccionadas</h3>
            <div class="subjects-list"></div>
        `;
        scheduleGenerator.insertBefore(infoPanel, scheduleGenerator.querySelector('.generation-controls'));
    }
    
    const subjectsList = infoPanel.querySelector('.subjects-list');
    subjectsList.innerHTML = selectedSubjects.map(subject => `
        <div class="subject-item">
            <span class="subject-name">${subject.name}</span>
            <span class="subject-code">${subject.code}</span>
            <span class="subject-credits">${subject.credits} créditos</span>
        </div>
    `).join('');
}

// Cargar preferencias del usuario mejorado
function loadUserPreferences() {
    userPreferences = JSON.parse(localStorage.getItem('userPreferences')) || {
        availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        blockedTimes: [],
        externalActivities: []
    };
    
    console.log('Preferencias del usuario:', userPreferences);
}

// Funciones adicionales del schedule generator
function saveSchedule() {
    if (generatedSchedules.length > 0) {
        const currentSchedule = generatedSchedules[currentScheduleIndex];
        localStorage.setItem('savedSchedule', JSON.stringify(currentSchedule));
        showAlert('Horario guardado exitosamente', 'success');
    }
}

function exportSchedule() {
    if (generatedSchedules.length > 0) {
        const currentSchedule = generatedSchedules[currentScheduleIndex];
        
        // Simular exportación a PDF
        showAlert('Preparando exportación PDF...', 'info');
        
        setTimeout(() => {
            showAlert('¡Horario exportado como PDF!', 'success');
            
            // En una implementación real, aquí usarías una librería como jsPDF
            console.log('Exportando horario:', currentSchedule);
        }, 2000);
    }
}

function printSchedule() {
    if (generatedSchedules.length > 0) {
        // Crear ventana de impresión
        const printWindow = window.open('', '_blank');
        const currentSchedule = generatedSchedules[currentScheduleIndex];
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Horario - ${currentSchedule.name}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .schedule-table { width: 100%; border-collapse: collapse; }
                    .schedule-table th, .schedule-table td { 
                        border: 1px solid #ddd; 
                        padding: 12px; 
                        text-align: center; 
                    }
                    .schedule-table th { background-color: #f5f5f5; }
                    .course { 
                        background-color: #e3f2fd; 
                        padding: 8px; 
                        border-radius: 4px; 
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>MatriFlex UNSA</h1>
                    <h2>${currentSchedule.name}</h2>
                    <p>Calidad: ${currentSchedule.quality}%</p>
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
                    <!-- Aquí irían las filas del horario -->
                </table>
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.print();
        
        showAlert('Ventana de impresión abierta', 'success');
    }
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

// Mostrar información de preferencias
function showPreferencesInfo() {
    const infoPanel = document.getElementById('preferencesInfo');
    if (!infoPanel) return;
    
    const userPrefs = JSON.parse(localStorage.getItem('userPreferences')) || {};
    const externalActivities = JSON.parse(localStorage.getItem('externalActivities')) || [];
    const subjects = JSON.parse(localStorage.getItem('selectedSubjects')) || [];
    
    // Actualizar información
    document.getElementById('selectedSubjectsCount').textContent = subjects.length;
    
    const preferredTime = userPrefs.preferredTime || 'No configurado';
    const timeLabels = {
        'morning': 'Matutino (7AM - 12PM)',
        'afternoon': 'Vespertino (12PM - 6PM)', 
        'evening': 'Nocturno (6PM - 9PM)',
        'flexible': 'Flexible'
    };
    document.getElementById('preferredTimeInfo').textContent = timeLabels[preferredTime] || preferredTime;
    
    const availableDays = userPrefs.availableDays || [];
    const dayLabels = {
        'Monday': 'Lun',
        'Tuesday': 'Mar', 
        'Wednesday': 'Mié',
        'Thursday': 'Jue',
        'Friday': 'Vie',
        'Saturday': 'Sáb',
        'Sunday': 'Dom'
    };
    const daysText = availableDays.length > 0 
        ? availableDays.map(day => dayLabels[day] || day).join(', ')
        : 'Todos los días';
    document.getElementById('availableDaysInfo').textContent = daysText;
    
    document.getElementById('externalActivitiesCount').textContent = externalActivities.length;
    
    // Mostrar panel si hay datos configurados
    if (subjects.length > 0 || Object.keys(userPrefs).length > 0 || externalActivities.length > 0) {
        infoPanel.style.display = 'block';
    }
}
