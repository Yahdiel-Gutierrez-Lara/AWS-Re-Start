let baseDatosLaboratorios = [];
let vistaActual = "inicio"; // Estados: inicio, lista-labs, detalle-evidencia
let moduloSeleccionado = "";

async function cargarMarkdownDesdeJSON() {
    try {
        // Lee el archivo JSON
        const respuesta = await fetch('contenido.json');
        const datos = await respuesta.json();

        // Muestra el título normal
        document.getElementById('titulo-web').textContent = datos.titulo;

        // Convierte el texto Markdown del JSON a HTML usando marked.parse()
        const htmlConvertido = marked.parse(datos.textoMarkdown);

        // Inserta el HTML resultante en el contenedor web
        document.getElementById('contenido-markdown').innerHTML = htmlConvertido;

    } catch (error) {
        console.error('Hubo un error al cargar el archivo JSON:', error);
        document.getElementById('titulo-web').textContent = 'Error al cargar el contenido';
    }
}

cargarMarkdownDesdeJSON();

document.addEventListener("DOMContentLoaded", () => {
    // Referencias a los elementos del HTML
    const panelBienvenida = document.getElementById("panel-bienvenida");
    const sectionModulos = document.getElementById("modulos");
    const sectionIndexLabs = document.getElementById("labs-index-view");
    const sectionEvidence = document.getElementById("evidence-view");
    const labsListContainer = document.getElementById("labs-list-container");
    const btnBack = document.getElementById("btn-back");

    // 1. Descargar y cargar los datos desde el archivo JSON
    fetch("laboratorios.json")
        .then(response => {
            if (!response.ok) throw new Error("Error al cargar la base de datos de laboratorios.");
            return response.json();
        })
        .then(data => {
            baseDatosLaboratorios = data;
            mapearEventos();
        })
        .catch(err => console.error("Error inicializando el portafolio:", err));

    // 2. Mapeo de clicks y navegación interactiva
    function mapearEventos() {
        // Clics en las tarjetas de los módulos principales
        document.querySelectorAll(".module-item").forEach(item => {
            item.addEventListener("click", (e) => {
                e.preventDefault();
                const nombreModulo = item.getAttribute("data-module");
                mostrarListaLaboratorios(nombreModulo);
            });
        });

        // Clics en los enlaces del Menú Lateral (Sidebar) o navegación general
        document.querySelectorAll(".nav-link").forEach(link => {
            link.addEventListener("click", (e) => {
                const href = link.getAttribute("href");
                if (href === "#inicio") irAInicio();
                if (href === "#modulos") irAModulos();
            });
        });

        // Comportamiento inteligente del botón "Volver"
        btnBack.addEventListener("click", () => {
            if (vistaActual === "detalle-evidencia") {
                mostrarListaLaboratorios(moduloSeleccionado);
            } else if (vistaActual === "lista-labs") {
                irAInicio();
            }
        });
    }

    // Navegación: Mostrar Pantalla de Inicio Completa (Módulos + Stats)
    function irAInicio() {
        vistaActual = "inicio";
        btnBack.classList.add("hidden-view");
        panelBienvenida.classList.remove("hidden-view"); // Muestra estadísticas globales
        sectionModulos.classList.remove("hidden-view");   // Muestra las categorías
        sectionIndexLabs.classList.add("hidden-view");
        sectionEvidence.classList.add("hidden-view");
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Navegación: Desplazar suavemente hasta el bloque de módulos
    function irAModulos() {
        irAInicio();
        setTimeout(() => {
            sectionModulos.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }

    // VISTA 3: Filtrar y pintar el índice de laboratorios de un módulo específico
    function mostrarListaLaboratorios(modulo) {
        vistaActual = "lista-labs";
        moduloSeleccionado = modulo;
        
        // Control de visibilidad para simular "página nueva"
        btnBack.classList.remove("hidden-view");
        panelBienvenida.classList.add("hidden-view"); // Se ocultan las estadísticas superiores
        sectionModulos.classList.add("hidden-view");   // Se oculta el listado de módulos
        sectionEvidence.classList.add("hidden-view");
        sectionIndexLabs.classList.remove("hidden-view");
        
        document.getElementById("labs-index-title").innerText = `Laboratorios de ${modulo}`;

        // Filtrado de la base de datos
        const labsFiltrados = baseDatosLaboratorios.filter(lab => lab.modulo === modulo);
        labsListContainer.innerHTML = "";
        
        if (labsFiltrados.length === 0) {
            labsListContainer.innerHTML = `<p style="padding: 20px; color: #8b949e;">Próximamente se añadirán las evidencias para este módulo.</p>`;
            return;
        }

        // Renderizar las tarjetas (.lab-card) reutilizando tus estilos CSS existentes
        labsFiltrados.forEach(lab => {
            const card = document.createElement("a");
            card.href = "#";
            card.classList.add("lab-card");
            
            // Asignar dinámicamente la clase de estado (Hecho o WIP)
            const statusClass = lab.status === "done" ? "badge-done" : "badge-wip";

            card.innerHTML = `
                <div class="lab-card-top">
                  <div class="lab-icon"><i class="fa-solid fa-flask"></i></div>
                  <span class="lab-status ${statusClass}">${lab.status_texto}</span>
                </div>
                <div class="lab-num">${lab.numero} · ${lab.modulo}</div>
                <div class="lab-name">${lab.titulo}</div>
                <div class="lab-desc">${lab.descripcion_general.substring(0, 120)}...</div>
            `;

            // Al hacer clic en la tarjeta del lab, avanzamos al despliegue de evidencia
            card.addEventListener("click", (e) => {
                e.preventDefault();
                mostrarDetalleEvidencia(lab);
            });

            labsListContainer.appendChild(card);
        });
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // VISTA 4: Desplegar el reporte técnico estructurado en micro-secciones
    function mostrarDetalleEvidencia(lab) {
        vistaActual = "detalle-evidencia";
        
        panelBienvenida.classList.add("hidden-view");
        sectionIndexLabs.classList.add("hidden-view");
        sectionEvidence.classList.remove("hidden-view");

        // Rellenar datos base del encabezado y breadcrumb
        document.getElementById("evidence-module-breadcrumb").innerText = lab.modulo;
        document.getElementById("evidence-title-breadcrumb").innerText = lab.numero;
        document.getElementById("evidence-title").innerText = `${lab.numero}: ${lab.titulo}`;
        document.getElementById("evidence-desc").innerText = lab.descripcion_general;
        
        // Configurar el Badge de Estado principal del lab
        const statusBadge = document.getElementById("evidence-status");
        statusBadge.className = `nav-badge ${lab.status === "done" ? "badge-done" : "badge-wip"}`;
        statusBadge.innerText = lab.status_texto;

        // ── CONTROL DE FLUJO MULTI-SECCIÓN CORRECTO (EVITA EL UNDEFINED) ──
        const stepsContainer = document.getElementById("evidence-steps-container");
        stepsContainer.innerHTML = ""; // Limpiar evidencias del laboratorio anterior

        if (lab.pasos && lab.pasos.length > 0) {
            lab.pasos.forEach((paso) => {
                // Crear bloque contenedor para el Paso actual
                const pasoBlock = document.createElement("div");
                pasoBlock.style.marginBottom = "40px";
                pasoBlock.style.borderTop = "1px solid #eaecef";
                pasoBlock.style.paddingTop = "25px";

                // Agregar el subtítulo del Paso
                pasoBlock.innerHTML = `<h3 style="font-family: 'IBM Plex Sans', sans-serif; color: #24292e; margin-bottom: 15px;">${paso.subtitulo}</h3>`;

                // EVALUACIÓN A: El paso usa el formato nuevo estructurado con el array "secciones"
                if (paso.secciones && paso.secciones.length > 0) {
                    paso.secciones.forEach(sec => {
                        
                        // Caso A.1: La sección contiene Texto Plano
                        if (sec.texto) {
                            const p = document.createElement("p");
                            p.style.color = "#444";
                            p.style.lineHeight = "1.6";
                            p.style.marginBottom = "14px";
                            p.style.fontSize = "1rem";
                            p.innerText = sec.texto;
                            pasoBlock.appendChild(p);
                        }

                        // Caso A.2: La sección contiene una Captura de Evidencia con Pie de Foto
                        if (sec.imagen) {
                            const imgDiv = document.createElement("div");
                            imgDiv.style.margin = "22px 0";
                            imgDiv.style.textAlign = "center";
                            imgDiv.style.background = "#fafafa";
                            imgDiv.style.borderRadius = "6px";
                            imgDiv.style.padding = "15px";
                            imgDiv.style.border = "1px dashed #e1e4e8";

                            imgDiv.innerHTML = `
                                <img src="${sec.imagen}" alt="${sec.descripcion || 'Evidencia del laboratorio'}" style="max-width: 100%; max-height: 480px; border-radius: 4px; object-fit: contain;" loading="lazy">
                                ${sec.descripcion ? `<p style="margin-top: 10px; font-size: 0.85rem; color: #586069; font-style: italic; line-height: 1.4;">${sec.descripcion}</p>` : ''}
                            `;
                            pasoBlock.appendChild(imgDiv);
                        }
                    });
                } 
                // EVALUACIÓN B: El paso usa el formato plano antiguo (Mantiene compatibilidad con JSONs viejos)
                else {
                    if (paso.texto) {
                        const p = document.createElement("p");
                        p.style.color = "#444";
                        p.style.lineHeight = "1.6";
                        p.style.marginBottom = "14px";
                        p.innerText = paso.texto;
                        pasoBlock.appendChild(p);
                    }
                    if (paso.imagen) {
                        const imgDiv = document.createElement("div");
                        imgDiv.style.margin = "22px 0";
                        imgDiv.style.textAlign = "center";
                        imgDiv.style.background = "#fafafa";
                        imgDiv.style.borderRadius = "6px";
                        imgDiv.style.padding = "15px";
                        imgDiv.style.border = "1px dashed #e1e4e8";
                        imgDiv.innerHTML = `<img src="${paso.imagen}" style="max-width: 100%; max-height: 450px; border-radius: 4px; object-fit: contain;" loading="lazy">`;
                        pasoBlock.appendChild(imgDiv);
                    }
                }

                // Añadir el bloque completamente estructurado a la interfaz
                stepsContainer.appendChild(pasoBlock);
            });
        }

        // 3. Cargar las Etiquetas Técnicas (Tags)
        const tagsContainer = document.getElementById("evidence-tags");
        tagsContainer.innerHTML = "";
        if (lab.tags) {
            lab.tags.forEach(tag => {
                const span = document.createElement("span");
                span.classList.add("tag");
                span.innerText = tag;
                tagsContainer.appendChild(span);
            });
        }

        // 4. Actualizar enlace dinámico del repositorio de GitHub
        document.getElementById("evidence-repo-link").href = lab.enlace_github || "#";
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});