document.addEventListener('DOMContentLoaded', () => {
    const fileItems = document.querySelectorAll('.file-item');
    const tabsContainer = document.querySelector('.editor-tabs');
    const contentArea = document.getElementById('content-area');
    const breadcrumbFileName = document.querySelector('.breadcrumbs span:last-child');
    const statusBarLang = document.querySelector('.status-right .status-item:nth-child(3)');
    const sidebar = document.querySelector('.sidebar');
    const explorerIcon = document.querySelector('.activity-icon[title="Explorer"]');

    // Mobile Sidebar Toggle
    if (explorerIcon) {
        // Initial sync for mobile
        if (window.innerWidth <= 768) {
            explorerIcon.classList.remove('active');
        }

        explorerIcon.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-visible');
            // Sync icon state
            if (sidebar.classList.contains('mobile-visible')) {
                explorerIcon.classList.add('active');
            } else {
                explorerIcon.classList.remove('active');
            }
        });
    }

    // Content Data
    const fileContents = {
        'readme': {
            lang: 'Markdown',
            icon: 'fab fa-markdown readme-icon',
            templateId: 'tpl-readme'
        },
        'inicio': {
            lang: 'JavaScript React',
            icon: 'fab fa-react react-icon',
            content: generateInicioJSX()
        },
        'sobre-mi': {
            lang: 'JavaScript React',
            icon: 'fas fa-user-circle user-icon',
            content: generateSobreMiJSX() // Replaces Quick Start logic but in JSX format or keeps text
        },
        'proyectos': {
            lang: 'JavaScript React',
            icon: 'fas fa-folder projects-icon',
            content: generateProyectosJSX()
        },
        'habilidades': {
            lang: 'JavaScript React',
            icon: 'fas fa-bolt skills-icon',
            content: generateHabilidadesJSX()
        },
        'contacto': {
            lang: 'JavaScript React',
            icon: 'fas fa-envelope contact-icon',
            content: generateContactoJSX()
        }
    };

    // State
    let activeFile = 'inicio';

    // Initial Load
    renderContent('inicio');

    // Event Listeners
    fileItems.forEach(item => {
        item.addEventListener('click', () => {
            const file = item.getAttribute('data-file');
            switchToFile(file);
        });
    });

    // Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        if (document.body.classList.contains('light-mode')) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    });

    function switchToFile(fileKey) {
        if (activeFile === fileKey) return;

        // Mobile: Close sidebar after selection
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('mobile-visible');
            if (explorerIcon) explorerIcon.classList.remove('active');
        }

        // Update Sidebar
        document.querySelectorAll('.file-item').forEach(el => el.classList.remove('active'));
        document.querySelector(`.file-item[data-file="${fileKey}"]`).classList.add('active');

        // Update Tabs
        const existingTab = document.querySelector(`.tab[data-file="${fileKey}"]`);
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));

        if (existingTab) {
            existingTab.classList.add('active');
        } else {
            // Create new tab
            const newTab = document.createElement('div');
            newTab.className = 'tab active';
            newTab.setAttribute('data-file', fileKey);

            const fileData = fileContents[fileKey];
            const fileName = getFileName(fileKey);

            newTab.innerHTML = `<i class="${fileData.icon}"></i><span>${fileName}</span><i class="fas fa-times close-tab"></i>`;

            // Switch to tab on click
            newTab.addEventListener('click', (e) => {
                if (!e.target.classList.contains('close-tab')) {
                    switchToFile(fileKey);
                }
            });

            // Close tab handler
            const closeBtn = newTab.querySelector('.close-tab');
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent switching to tab when closing
                closeTab(fileKey);
            });

            tabsContainer.appendChild(newTab);
        }

        // Update Header/Breadcrumbs
        activeFile = fileKey;
        const fileName = getFileName(fileKey);
        breadcrumbFileName.textContent = fileName;
        statusBarLang.textContent = fileContents[fileKey].lang;

        // Render Content
        renderContent(fileKey);
    }

    function closeTab(fileKey) {
        const tabToRemove = document.querySelector(`.tab[data-file="${fileKey}"]`);
        if (!tabToRemove) return;

        // If closing the active tab, switch to another one
        if (tabToRemove.classList.contains('active')) {
            const allTabs = Array.from(document.querySelectorAll('.tab'));
            const index = allTabs.indexOf(tabToRemove);

            // Try to switch to the previous tab, or the next one if it's the first
            let nextTab = allTabs[index - 1] || allTabs[index + 1];

            if (nextTab) {
                const nextFile = nextTab.getAttribute('data-file');
                switchToFile(nextFile);
            } else {
                // If no tabs left, clear content (or keep a default empty state)
                activeFile = null;
                contentArea.innerHTML = '<div class="empty-state">Selecciona un archivo para ver su contenido</div>';
                breadcrumbFileName.textContent = '';
                statusBarLang.textContent = '';
                // Update Sidebar selection to nothing
                document.querySelectorAll('.file-item').forEach(el => el.classList.remove('active'));
            }
        }

        tabToRemove.remove();
    }

    function renderContent(fileKey) {
        contentArea.innerHTML = '';
        const data = fileContents[fileKey];

        if (data.templateId) {
            const tpl = document.getElementById(data.templateId);
            if (tpl) contentArea.appendChild(tpl.content.cloneNode(true));
        } else if (data.content) {
            contentArea.innerHTML = data.content;

            if (fileKey === 'contacto') {
                initContactForm();
            }
        }
    }

    function getFileName(key) {
        switch (key) {
            case 'readme': return 'README.md';
            case 'inicio': return 'inicio.jsx';
            case 'sobre-mi': return 'sobre-mi.jsx';
            case 'proyectos': return 'proyectos.jsx';
            case 'habilidades': return 'habilidades.jsx';
            case 'contacto': return 'contacto.jsx';
            default: return 'file';
        }
    }

    function generateInicioJSX() {
        return `
        <div class="inicio-container">
            <!-- Top Section: Photo + Code -->
            <div class="profile-card">
                <div class="profile-image-container">
                    <img src="profile.jpg" alt="Diego Hernández" class="profile-img">
                </div>
                <div class="profile-code">
<div class="code-line">
  <span class="cs-keyword">const</span>&nbsp;
  <span class="cs-class">desarrollador</span> = {
</div>
                <div class="code-line">&nbsp;</div>
                    <div class="code-line">&nbsp;&nbsp;<span class="syn-attr">nombre</span>: <span class="cs-string">"Diego Enrique Hernández Molina"</span>,</div>
                    <div class="code-line">&nbsp;</div>
                    <div class="code-line">&nbsp;&nbsp;<span class="syn-attr">titulo</span>: <span class="cs-string">"Estudiante de Ingeniería en Sistemas"</span>,</div>

                    <div class="code-line">&nbsp;</div>
                    <div class="code-line">&nbsp;&nbsp;<span class="syn-attr">institucion</span>: <span class="cs-string">"Universidad Tecnológica (UTEC)"</span>,</div>
                    <div class="code-line">&nbsp;</div>
                    <div class="code-line">&nbsp;&nbsp;<span class="syn-attr">nivel</span>: <span class="cs-string">"Cuarto año de Ingeniería en Sistemas"</span>,</div>
                    <div class="code-line">&nbsp;</div>
                    <div class="code-line">&nbsp;&nbsp;<span class="syn-attr">ubicacion</span>: <span class="cs-string">"El Salvador"</span>,</div>
                    <div class="code-line">&nbsp;</div>
                    <div class="code-line">&nbsp;&nbsp;<span class="syn-attr">disponible</span>: <span class="cs-keyword">true</span></div>
                    <div class="code-line">};</div>
                </div>
            </div>

            <!-- Bottom Section: Description -->
            <div class="description-card">
                <h2>Perfil Profesional</h2>
                <p>
                    Soy estudiante de cuarto año de Ingeniería en Sistemas en la Universidad Tecnológica (UTEC), 
                    apasionado por el desarrollo de software y la creación de aplicaciones web eficientes, escalables y bien estructuradas.
                </p>
                <div class="tech-focus">
                    <p>Cuento con un fuerte enfoque en el ecosistema <strong>C# y ASP.NET</strong>, donde he desarrollado proyectos integrando:</p>
                    <ul class="feature-list">
                        <li><strong>Lógica de Negocio:</strong> Implementación de reglas y procesos complejos.</li>
                        <li><strong>Bases de Datos:</strong> Diseño y conexión eficiente para persistencia de datos.</li>
                        <li><strong>APIs REST:</strong> Experiencia técnica en la creación y consumo de servicios RESTful.</li>
                    </ul>
                </div>
                <p>
                    Mi objetivo es el aprendizaje continuo, fortaleciendo mis habilidades técnicas para aportar soluciones 
                    reales y de alta calidad a través del desarrollo de software.
                </p>
                <div class="action-buttons">
                    <button class="btn-primary" onclick="window.open('https://github.com/diegohernandezdev2004-png', '_blank')"><i class="fab fa-github"></i> GitHub</button>
                    <button class="btn-secondary" onclick="window.open('https://www.linkedin.com/in/diego-enrique-hernández-molina-3130a63ab', '_blank')"><i class="fab fa-linkedin"></i> LinkedIn</button>
                </div>
            </div>
        </div>
        `;
    }

    function generateSobreMiJSX() {
        return `
        <div class="sobre-mi-container">
            <div class="code-line"><span class="cs-keyword">function</span> <span class="cs-method">sobreMi</span>() {</div>
            
            <div class="info-card">
                <h3 class="card-title title-green">Formación</h3>
                <ul class="card-list">
                    <li><span class="highlight">Ingeniería en Sistemas – UTEC</span> (2023 – actualidad)</li>
                    <li>Cuarto año en curso.</li>
                    <li>Diseño de Bases de Datos Relacionales</li>
                    <li>IT Essentials – Soporte y mantenimiento de equipos</li>
                    <li>CCNA 1: Introducción a Redes</li>
                </ul>
            </div>

            <div class="info-card">
                <h3 class="card-title title-blue">Experiencia</h3>
                <div class="exp-item">
                    <p class="exp-role">Soporte Técnico – QUAPE (6 meses)</p>
                    <p class="exp-desc">Soporte a usuarios, mantenimiento de equipos y resolución de incidencias.</p>
                </div>
                <div class="exp-item">
                    <p class="exp-role">Desarrollador .NET – Law Latam (1 año)</p>
                    <p class="exp-desc">Desarrollo y mantenimiento de aplicaciones con C# y .NET, bases de datos y consumo de APIs.</p>
                </div>
            </div>

            <div class="info-card">
                <h3 class="card-title title-purple">Intereses</h3>
                <p>Backend, C# y ASP.NET, APIs, buenas prácticas y arquitectura de software.</p>
            </div>

            <div class="info-card">
                <h3 class="card-title title-orange">Habilidades</h3>
                <p>Trabajo en equipo · Empatía · Liderazgo · Compromiso</p>
            </div>

            <div class="info-card download-section">
                <p>Si querés conocer más sobre mi experiencia y formación:</p>
                <a href="CV_Diego_Hernandez.pdf" download="CV_Diego_Hernandez.pdf" target="_blank" class="btn-download" style="text-decoration: none; color: #1e1e1e; display: flex; align-items: center; gap: 8px;"><i class="fas fa-download"></i> Descargar CV</a>
            </div>

            <div class="code-line">}</div>
        </div>
        `;
    }

    function generateProyectosJSX() {
        return `
        <div class="proyectos-container">
            <div class="code-line"><span class="cs-keyword">const</span> <span class="cs-class">proyectos</span> = [</div>
            
            <!-- Project Card -->
            <div class="project-card">
                <div class="project-header">
                    <h3>SGE: Gestión Empresarial (El Salvador)</h3>
                </div>
                <div class="project-subheader">
                    Sistema Web Integral (ERP/HRM)
                </div>
                
                <div class="project-desc">
                    <span class="section-label">Core:</span>
                    Gestión de Planillas (ISSS, AFP, ISR), Inventario, Compras y Facturación con IVA.
                    
                    <span class="section-label">Compliance:</span>
                    Adaptado a la legislación laboral y fiscal salvadoreña (Código de Trabajo y normativas tributarias).
                    
                    <span class="section-label">Reportes:</span>
                    Generación y exportación automática a PDF y Excel (Libros de IVA, boletas de pago, estados financieros).
                </div>

                <div class="project-tech-stack">
                    <span class="tech-badge">ASP.NET Core 8</span>
                    <span class="tech-badge">Entity Framework Core</span>
                    <span class="tech-badge">SQL Server</span>
                    <span class="tech-badge">Razor Pages</span>
                    <span class="tech-badge">Bootstrap 5</span>
                    <span class="tech-badge">JavaScript</span>
                    <span class="tech-badge">QuestPDF</span>
                    <span class="tech-badge">ClosedXML</span>
                    <span class="tech-badge">OpenXML</span>
                </div>

                <div class="project-links">
                    <a href="https://github.com/diegohernandezdev2004-png/SGE" target="_blank" class="project-link">
                        <i class="fab fa-github"></i> Código
                    </a>
                    <a href="https://sqe.life/Identity/Account/Login?ReturnUrl=%2F" target="_blank" class="project-link">
                        <i class="fas fa-external-link-alt"></i> Demo
                    </a>
                </div>
            </div>
            
            
            <!-- Help_Desk Card -->
            <div class="project-card">
                <div class="project-header">
                    <h3>Help Desk Pro: Sistema de Tickets y Soporte</h3>
                </div>
                <div class="project-subheader">
                    Sistema Web de Gestión de Soporte Técnico
                </div>
                
                <div class="project-desc">
                    <span class="section-label">Core:</span>
                    Creación, asignación y seguimiento de tickets con prioridades, estados, comentarios y archivos adjuntos.
                    
                    <span class="section-label">Roles:</span>
                    Gestión de usuarios con permisos (Administrador, Agente, Usuario) y panel de control con métricas y gráficas.
                    
                    <span class="section-label">SLA:</span>
                    Definición de tiempos de respuesta y resolución por categoría de ticket.

                    <span class="section-label">Reportes:</span>
                    Dashboard con estadísticas clave para monitoreo del rendimiento del soporte.
                </div>

                <div class="project-tech-stack">
                    <span class="tech-badge">ASP.NET Core 9 MVC</span>
                    <span class="tech-badge">Entity Framework Core</span>
                    <span class="tech-badge">SQL Server</span>
                    <span class="tech-badge">Bootstrap 5</span>
                    <span class="tech-badge">Identity UI</span>
                    <span class="tech-badge">JavaScript</span>
                </div>

                <div class="project-links">
                    <a href="https://github.com/diegohernandezdev2004-png/Help_desk" target="_blank" class="project-link">
                        <i class="fab fa-github"></i> Código
                    </a>
                    <a href="https://helpe.store/Identity/Account/Login?ReturnUrl=%2FTickets" target="_blank" class="project-link">
                        <i class="fas fa-external-link-alt"></i> Demo
                    </a>
                </div>
            </div>
            
            <!-- AcademiEnroll Card -->
            <div class="project-card">
                <div class="project-header">
                    <h3>AcademiEnroll: Gestión y Matrícula Académica</h3>
                </div>
                <div class="project-subheader">
                    Sistema Web de Gestión Escolar (Academic ERP)
                </div>
                 
                <div class="project-desc">
                    <span class="section-label">Core:</span>
                    Administración de materias, períodos académicos, matrícula en línea y registro de calificaciones por docente.

                    <span class="section-label">Roles:</span>
                    Acceso por perfiles (Administrador, Docente, Estudiante) con portales y funcionalidades específicas.

                    <span class="section-label">Académico:</span>
                    Inscripción de materias con validación de horarios y cupos, consulta de notas e historial académico en tiempo real.

                    <span class="section-label">Reportes:</span>
                    Dashboard con métricas académicas (aprobados/reprobados, cursos activos, rendimiento por materia).
                </div>

                <div class="project-tech-stack">
                    <span class="tech-badge">ASP.NET Core MVC</span>
                    <span class="tech-badge">C#</span>
                    <span class="tech-badge">Entity Framework Core</span>
                    <span class="tech-badge">SQL Server</span>
                    <span class="tech-badge">Razor Views</span>
                    <span class="tech-badge">Bootstrap 5</span>
                    <span class="tech-badge">JavaScript</span>
                    <span class="tech-badge">jQuery</span>
                </div>

                <div class="project-links">
                    <a href="https://github.com/diegohernandezdev2004-png/AcademiEnroll" target="_blank" class="project-link">
                         <i class="fab fa-github"></i> Código
                    </a>
                    <a href="https://academienroll.shop/" target="_blank" class="project-link">
                        <i class="fas fa-external-link-alt"></i> Demo
                    </a>
                </div>
            </div>
            
            <!-- Portafolio Personal Card -->
            <div class="project-card">
                <div class="project-header">
                    <h3>Portafolio Web Personal</h3>
                </div>
                <div class="project-subheader">
                    Sitio Web Profesional de Presentación
                </div>
                 
                <div class="project-desc">
                    <span class="section-label">Core:</span>
                    Exhibición de proyectos, habilidades técnicas y experiencia en desarrollo de software.

                    <span class="section-label">UI/UX:</span>
                    Diseño responsivo, navegación moderna y secciones dinámicas optimizadas para dispositivos móviles.

                    <span class="section-label">Contacto:</span>
                    Formulario funcional con envío de correos y descarga de CV en PDF.
                </div>

                <div class="project-tech-stack">
                    <span class="tech-badge">HTML</span>
                    <span class="tech-badge">CSS</span>
                    <span class="tech-badge">JavaScript</span>
                </div>

                <div class="project-links">
                    <a href="https://github.com/diegohernandezdev2004-png/Portafolio" target="_blank" class="project-link">
                         <i class="fab fa-github"></i> Código
                    </a>
                </div>
            </div>
            
            <div class="code-line">];</div>
        </div>
        `;
    }

    function generateHabilidadesJSX() {
        return `
        <div class="habilidades-container">
            <div class="code-line"><span class="cs-keyword">const</span> <span class="cs-class">habilidades</span> = {</div>
            
            <!-- Frontend -->
            <div class="skill-section">
                <h3 class="skill-title">Frontend</h3>
                <div class="skill-grid">
                    <span class="skill-tag">HTML5</span>
                    <span class="skill-tag">CSS3</span>
                    <span class="skill-tag">JavaScript</span>
                    <span class="skill-tag">Diseño responsivo</span>
                    <span class="skill-tag">Interfaces de usuario</span>
                </div>
            </div>

            <!-- Backend -->
            <div class="skill-section">
                <h3 class="skill-title">Backend</h3>
                <div class="skill-grid">
                    <span class="skill-tag">C# / .NET</span>
                    <span class="skill-tag">ASP.NET / Blazor</span>
                    <span class="skill-tag">Creación de APIs REST</span>
                    <span class="skill-tag">Consumo de APIs</span>
                    <span class="skill-tag">Lógica de negocio</span>
                    <span class="skill-tag">Gestión de bases de datos</span>
                    <span class="skill-tag">SQL Server</span>
                    <span class="skill-tag">SQLite</span>
                    <span class="skill-tag">Transact-SQL</span>
                </div>
            </div>

            <!-- Bases de Datos -->
            <div class="skill-section">
                <h3 class="skill-title">Bases de Datos</h3>
                <div class="skill-grid">
                    <span class="skill-tag">Diseño de bases de datos relacionales</span>
                    <span class="skill-tag">Normalización y modelado de datos</span>
                    <span class="skill-tag">Consultas SQL</span>
                    <span class="skill-tag">Optimización básica de rendimiento</span>
                    <span class="skill-tag">Procedimientos almacenados</span>    
                   <span class="skill-tag">Consultas SQL con JOINs</span>
                    </div>
            </div>

            <!-- Infraestructura y Redes -->
            <div class="skill-section">
                <h3 class="skill-title">Infraestructura y Redes</h3>
                <div class="skill-grid">
                    <span class="skill-tag">Virtualización con Hyper-V</span>
                    <span class="skill-tag">Configuración básica de redes</span>
                    <span class="skill-tag">Direccionamiento IPv4 / IPv6</span>
                    <span class="skill-tag">Diagnóstico de fallos de red</span>
                    <span class="skill-tag">Administración de redes CCTV</span>
                    <span class="skill-tag">Active Directory (básico)</span>
                </div>
            </div>

            <!-- Herramientas -->
            <div class="skill-section">
                <h3 class="skill-title">Herramientas</h3>
                <div class="skill-grid">
                    <span class="skill-tag">Git & GitHub</span>
                    <span class="skill-tag">Docker</span>
                    <span class="skill-tag">Jasper Report</span>
                    <span class="skill-tag">Postman</span>
                    <span class="skill-tag">Azure DevOps</span>
                    <span class="skill-tag">Crystal Reports</span>
                </div>
            </div>

            <!-- Sistemas -->
            <div class="skill-section">
                <h3 class="skill-title">Sistemas</h3>
                <div class="skill-grid">
                    <span class="skill-tag">Windows (instalación, configuración y soporte)</span>
                    <span class="skill-tag">Montaje y mantenimiento de equipos de cómputo</span>
                    <span class="skill-tag">Linux comandos esenciales</span>
                    </div>
            </div>

            <div class="code-line">};</div>
        </div>
        `;
    }

    function generateContactoJSX() {
        return `
        <div class="contacto-container">
            <div class="code-line"><span class="cs-keyword">async function</span> <span class="cs-method">enviarMensaje</span>(<span class="cs-attr">formulario</span>) {</div>
            <div class="code-line">&nbsp;</div>

            <form id="formContacto" onsubmit="event.preventDefault();">
                <div class="form-group">
                    <div class="code-line">
                        &nbsp;&nbsp;<span class="cs-keyword">const</span> <span class="cs-class">nombre</span> = 
                        <input type="text" id="nombre" name="nombre" class="code-input" placeholder='"Tu Nombre"' autocomplete="off">
                    </div>
                </div>

                <div class="form-group">
                    <div class="code-line">
                        &nbsp;&nbsp;<span class="cs-keyword">const</span> <span class="cs-class">email</span> = 
                        <input type="email" id="email" name="email" class="code-input" placeholder='"tu@email.com"' autocomplete="off">
                    </div>
                </div>

                <div class="form-group">
                    <div class="code-line">
                        &nbsp;&nbsp;<span class="cs-keyword">const</span> <span class="cs-class">mensaje</span> = 
                    </div>
                    <div class="code-line">
                        &nbsp;&nbsp;<textarea id="mensaje" name="mensaje" class="code-input code-textarea" placeholder='"Escribe tu mensaje..."'></textarea>
                    </div>
                </div>

                <div class="code-line">&nbsp;</div>
                <div class="code-line">
                    &nbsp;&nbsp;<button type="submit" id="btn-send-mail" class="btn-primary btn-send">
                        <i class="fas fa-paper-plane"></i> Enviar mensaje
                    </button>
                </div>
            </form>

            <div class="code-line">}</div>

            <div class="info-card contact-card">
                <p>También podés contactarme directamente por:</p>
                <ul class="contact-links">
                    <li><i class="fas fa-envelope"></i> <a href="mailto:diego.hernandez.dev2004@gmail.com">diego.hernandez.dev2004@gmail.com</a></li>
                    <li><i class="fab fa-github"></i> <a href="https://github.com/diegohernandezdev2004-png" target="_blank">github.com/diegohernandezdev2004-png</a></li>
                    <li><i class="fab fa-linkedin"></i> <a href="https://www.linkedin.com/in/diego-enrique-hernández-molina-3130a63ab" target="_blank">linkedin.com/in/diego-enrique-hernández-molina-3130a63ab</a></li>
                </ul>
            </div>
        </div>
        `;
    }

    function initContactForm() {
        const form = document.getElementById('formContacto');
        if (!form) return;

        // Initialize EmailJS
        emailjs.init("TQwARXFbUW-VMkN0-");

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            const btn = document.getElementById('btn-send-mail');
            const originalBtnText = btn.innerHTML;

            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const mensaje = document.getElementById('mensaje').value;

            if (!nombre || !email || !mensaje) {
                alert('Por favor completa todos los campos.');
                return;
            }

            // Show loading state
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            btn.disabled = true;

            const serviceID = 'service_8or183y';
            const templateID = 'template_pvp13oq';

            emailjs.send(serviceID, templateID, {
                nombre: nombre,
                email: email,
                mensaje: mensaje
            })
                .then(() => {
                    alert('¡Mensaje enviado con éxito!');
                    form.reset();
                }, (err) => {
                    alert('Hubo un error al enviar el mensaje. Por favor intenta nuevamente.');
                    console.error('EmailJS Error:', err);
                })
                .finally(() => {
                    btn.innerHTML = originalBtnText;
                    btn.disabled = false;
                });
        });
    }
});
