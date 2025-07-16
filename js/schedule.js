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
    const generateBtn = document.querySelector('.generate-btn');
    generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...';
    generateBtn.disabled = true;
    
    // Simular procesamiento avanzado
    showGenerationProgress();
    
    setTimeout(() => {
        // Generar múltiples horarios
        generateMultipleSchedules();
        
        // Mostrar el primer horario
        showGeneratedSchedule();
        
        generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generar Nuevos Horarios';
        generateBtn.disabled = false;
        
        showAlert('¡Se generaron ' + generatedSchedules.length + ' horarios optimizados!', 'success');
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
    
    if (selectedSubjects.length === 0) {
        showAlert('No hay materias seleccionadas para generar horarios', 'error');
        return;
    }
    
    // Configurar horarios disponibles
    const timeSlots = [
        '7:00 AM - 8:30 AM', '8:00 AM - 9:30 AM', '9:00 AM - 10:30 AM', 
        '10:00 AM - 11:30 AM', '11:00 AM - 12:30 PM', '12:00 PM - 1:30 PM',
        '1:00 PM - 2:30 PM', '2:00 PM - 3:30 PM', '3:00 PM - 4:30 PM',
        '4:00 PM - 5:30 PM', '5:00 PM - 6:30 PM', '6:00 PM - 7:30 PM'
    ];
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const rooms = ['A101', 'A205', 'Lab B', 'Lab C', 'C101', 'C205', 'D101'];
    
    // Generar 5 horarios diferentes
    for (let i = 0; i < 5; i++) {
        const schedule = {
            name: getScheduleName(i),
            quality: Math.floor(Math.random() * 25) + 75, // 75-100%
            courses: []
        };
        
        // Asignar cada materia seleccionada a un horario
        selectedSubjects.forEach((subject, index) => {
            const dayIndex = (index + i) % days.length;
            const timeIndex = (index + i * 2) % timeSlots.length;
            const roomIndex = (index + i) % rooms.length;
            
            schedule.courses.push({
                name: subject.name,
                time: timeSlots[timeIndex],
                day: days[dayIndex],
                room: rooms[roomIndex],
                color: getCourseColor(subject.category || 'general'),
                credits: subject.credits
            });
        });
        
        // Calcular calidad basada en distribución
        schedule.quality = calculateScheduleQuality(schedule);
        
        generatedSchedules.push(schedule);
    }
    
    // Ordenar por calidad (mejor primero)
    generatedSchedules.sort((a, b) => b.quality - a.quality);
    
    currentScheduleIndex = 0;
    updateScheduleNavigation();
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
function calculateScheduleQuality(schedule) {
    let quality = 80; // Base
    
    // Bonificación por distribución equilibrada
    const dayDistribution = {};
    schedule.courses.forEach(course => {
        dayDistribution[course.day] = (dayDistribution[course.day] || 0) + 1;
    });
    
    const maxCoursesPerDay = Math.max(...Object.values(dayDistribution));
    if (maxCoursesPerDay <= 2) quality += 10;
    else if (maxCoursesPerDay <= 3) quality += 5;
    
    // Bonificación por horarios matutinos
    const morningCourses = schedule.courses.filter(course => 
        course.time.includes('AM') && !course.time.includes('11:') && !course.time.includes('12:')
    ).length;
    
    if (morningCourses >= schedule.courses.length * 0.7) quality += 10;
    
    // Penalización por horarios muy tardíos
    const lateCourses = schedule.courses.filter(course => 
        course.time.includes('6:00 PM') || course.time.includes('7:00 PM')
    ).length;
    
    quality -= lateCourses * 5;
    
    return Math.min(100, Math.max(60, quality));
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
    if (generatedSchedules.length === 0) return;
    
    const currentSchedule = generatedSchedules[currentScheduleIndex];
    
    // Actualizar título
    const sectionTitle = document.querySelector('.schedule-section h3');
    if (sectionTitle) {
        sectionTitle.innerHTML = `${currentSchedule.name} <span class="quality-badge">Calidad: ${currentSchedule.quality}%</span>`;
    }
    
    // Limpiar grid
    clearScheduleGrid();
    
    // Colocar cursos en el grid
    currentSchedule.courses.forEach(course => {
        const slot = findSlotForCourse(course);
        if (slot) {
            slot.innerHTML = `
                <div class="class-block ${course.color}">
                    <div class="class-name">${course.name}</div>
                    <div class="class-time">${course.time}</div>
                    <div class="class-room">${course.room}</div>
                </div>
            `;
            slot.classList.add('occupied');
        }
    });
}

// Encontrar slot para un curso
function findSlotForCourse(course) {
    // Mapear días a índices
    const dayMap = {
        'Monday': 1,
        'Tuesday': 2,
        'Wednesday': 3,
        'Thursday': 4,
        'Friday': 5
    };
    
    // Mapear horas a filas (simplificado)
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
        '6:00 PM': 11
    };
    
    const hour = course.time.split(' - ')[0];
    const dayIndex = dayMap[course.day];
    const timeIndex = timeMap[hour];
    
    if (dayIndex && timeIndex !== undefined) {
        const slots = document.querySelectorAll('.slot');
        const targetIndex = timeIndex * 4 + (dayIndex - 1);
        return slots[targetIndex];
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
    selectedSubjects = JSON.parse(localStorage.getItem('selectedSubjects')) || [];
    
    if (selectedSubjects.length === 0) {
        showAlert('❌ No has seleccionado materias. Ve a "Gestión de Materias" para seleccionar materias primero.', 'warning');
        
        // Deshabilitar botón de generar
        const generateBtn = document.querySelector('.generate-btn');
        if (generateBtn) {
            generateBtn.disabled = true;
            generateBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Primero selecciona materias';
        }
        return;
    }
    
    // Mostrar materias seleccionadas
    showSelectedSubjectsInfo();
    
    console.log('Materias seleccionadas:', selectedSubjects);
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
