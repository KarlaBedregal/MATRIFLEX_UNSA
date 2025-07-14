# MatriFlex UNSA - Prototipo de Sistema de Gestión Académica

## Descripción
MatriFlex UNSA es un prototipo de sistema web para la gestión académica universitaria que permite a los estudiantes gestionar sus materias, configurar preferencias de horario y generar horarios académicos optimizados.

## Características Principales

### 🔐 Sistema de Autenticación
- Inicio de sesión seguro
- Registro de nuevos usuarios
- Validación de datos

### 📚 Gestión de Materias
- Visualización de materias sugeridas
- Selección de materias con validación de prerrequisitos
- Control de límite de créditos
- Sistema de búsqueda y filtrado

### ⚙️ Configuración de Preferencias
- Configuración de días disponibles
- Bloqueo de horarios específicos
- Registro de actividades externas
- Interfaz visual interactiva

### 📅 Generador de Horarios
- Generación automática de horarios
- Visualización en grid interactivo
- Selección y edición de horarios
- Exportación de horarios

### 📊 Dashboard Centralizado
- Información del estudiante
- Acceso rápido a todas las funciones
- Gestión integrada de materias
- Navegación intuitiva

### 📈 Historial Académico
- Visualización completa del progreso académico
- Filtros por semestre y estado de materias
- Estadísticas detalladas de rendimiento
- Exportación de reportes académicos
- Detalles de calificaciones por materia

## Estructura del Proyecto

```
Prototipo_MATRIFLEX/
├── index.html              # Página de inicio de sesión
├── register.html           # Página de registro
├── dashboard.html          # Dashboard principal
├── schedule-generator.html # Generador de horarios
├── preferences.html        # Configuración de preferencias
├── subjects.html          # Gestión de materias
├── academic-history.html  # Historial académico
├── styles/
│   └── main.css           # Estilos principales
└── js/
    ├── main.js            # Funciones principales
    ├── dashboard.js       # Lógica del dashboard
    ├── schedule.js        # Funciones del generador
    ├── preferences.js     # Configuración de preferencias
    ├── subjects.js        # Gestión de materias
    └── academic-history.js # Funciones del historial
```

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Diseño responsivo con CSS Grid y Flexbox
- **JavaScript (ES6+)**: Interactividad y lógica de negocio
- **Font Awesome**: Iconografía
- **LocalStorage**: Persistencia de datos local

## Paleta de Colores

- **Azul Principal**: `#4f75ff` - Botones principales y elementos destacados
- **Azul Oscuro**: `#3a5998` - Estados hover y encabezados
- **Azul Claro**: `#e8f1ff` - Fondos y destacados sutiles
- **Gris Oscuro**: `#2c3e50` - Texto principal y sidebar
- **Gris Medio**: `#6c757d` - Texto secundario
- **Gris Claro**: `#f8f9fa` - Fondos y separadores

## Instalación y Uso

1. **Descarga o clona el proyecto**
   ```bash
   git clone [URL-del-repositorio]
   ```

2. **Navega al directorio del proyecto**
   ```bash
   cd Prototipo_MATRIFLEX
   ```

3. **Abre el archivo `index.html` en tu navegador**
   - Puedes usar cualquier navegador moderno
   - Se recomienda usar un servidor local para mejor experiencia

4. **Credenciales de prueba**
   - Email: cualquier email válido
   - Contraseña: cualquier contraseña de 6+ caracteres

## Características Técnicas

### Responsividad
- Diseño adaptativo para dispositivos móviles
- Breakpoints optimizados para tablets y escritorio
- Grid system flexible

### Interactividad
- Efectos hover y transiciones suaves
- Validación en tiempo real de formularios
- Feedback visual inmediato
- Modales y alertas informativos

### Persistencia de Datos
- Uso de LocalStorage para mantener estado
- Datos de sesión de usuario
- Preferencias y configuraciones
- Materias seleccionadas y horarios

### Funcionalidades Avanzadas
- Sistema de prerrequisitos de materias
- Validación de límites de créditos
- Generación automática de horarios
- Exportación de datos en formato texto

## Flujo de Usuario

1. **Registro/Inicio de Sesión**
   - El usuario se registra o inicia sesión
   - Redirección automática al dashboard

2. **Selección de Materias**
   - Acceso a la gestión de materias
   - Selección con validaciones automáticas
   - Confirmación de materias elegidas

3. **Configuración de Preferencias**
   - Definición de horarios disponibles
   - Bloqueo de horarios ocupados
   - Registro de actividades externas

4. **Generación de Horario**
   - Generación automática basada en preferencias
   - Visualización de opciones disponibles
   - Selección final del horario

5. **Consulta de Historial Académico**
   - Revisión completa del progreso académico
   - Filtrado por semestres y estados
   - Exportación de reportes y estadísticas

## Futuras Mejoras

- 🔄 Integración con API backend
- 📱 Aplicación móvil nativa
- 🔔 Sistema de notificaciones
- 📈 Analytics y reportes
- 🤝 Integración con sistemas universitarios
- 🌐 Soporte multiidioma
- 🎨 Temas personalizables
- 🔒 Autenticación avanzada (2FA)

## Compatibilidad

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Dispositivos móviles (iOS/Android)

## Licencia

Este proyecto es un prototipo educativo desarrollado como parte del curso de Innovación y Creatividad de la carrera de Ingeniería de Sistemas.

## Contacto

Desarrollado como proyecto académico para UNSA (Universidad Nacional de San Agustín).

---

**Nota**: Este es un prototipo con fines educativos. Los datos son simulados y la funcionalidad está limitada al alcance del proyecto.
