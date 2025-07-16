// Archivo temporal para solucionar el problema del grid

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

// Sobreescribir la función original
window.findSlotForCourse = findSlotForCourseFixed;
