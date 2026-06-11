let baseDatosLaboratorios = [];
let vistaActual = "inicio"; // Estados: inicio, lista-labs, detalle-evidencia
let moduloSeleccionado = "";

document.addEventListener("DOMContentLoaded", () => {
    // Referencias HTML
    const sectionModulos = document.getElementById("modulos");
    const sectionIndexLabs = document.getElementById("labs-index-view");
    const sectionEvidence = document.getElementById("evidence-view");
    const labsListContainer = document.getElementById("labs-list-container");
    const btnBack = document.getElementById("btn-back");

    // 1. Descargar los datos del JSON
    fetch("laboratorios.json")
        .then(response => {
            if (!response.ok) throw new Error("Error al cargar la base de datos de laboratorios.");
            return response.json();
        })
        .then(data => {
            baseDatosLaboratorios = data;
            mapearEventos();
        })
        .catch(err => console.error(err));

    function mapearEventos() {
        // Escuchar clics en los bloques de módulos del HTML
        document.querySelectorAll(".module-item").forEach(item => {
            item.addEventListener("click", (e) => {
                e.preventDefault();
                const nombreModulo = item.getAttribute("data-module");
                mostrarListaLaboratorios(nombreModulo);
            });
        });

        // Escuchar clics en los enlaces del Sidebar (Menú lateral)
        document.querySelectorAll(".nav-link").forEach(link => {
            link.addEventListener("click", (e) => {
                const href = link.getAttribute("href");
                if (href === "#inicio") {
                    irAInicio();
                } else if (href === "#modulos") {
                    irAModulos();
                }
            });
        });

        // Evento del botón volver
        btnBack.addEventListener("click", () => {
            if (vistaActual === "detalle-evidencia") {
                mostrarListaLaboratorios(moduloSeleccionado);
            } else if (vistaActual === "lista-labs") {
                irAModulos();
            }
        });
    }

    // Navegación: Ir al Inicio del sitio
    function irAInicio() {
        vistaActual = "inicio";
        btnBack.classList.add("hidden-view");
        sectionModulos.classList.remove("hidden-view");
        sectionIndexLabs.classList.add("hidden-view");
        sectionEvidence.classList.add("hidden-view");
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Navegación: Enfocar la lista de módulos
    function irAModulos() {
        vistaActual = "inicio";
        btnBack.classList.add("hidden-view");
        sectionModulos.classList.remove("hidden-view");
        sectionIndexLabs.classList.add("hidden-view");
        sectionEvidence.classList.add("hidden-view");
        
        // Hacer scroll suave hacia la sección de módulos
        sectionModulos.scrollIntoView({ behavior: "smooth" });
    }

    // VISTA 3: Filtrar y mostrar los laboratorios del módulo seleccionado
    function mostrarListaLaboratorios(modulo) {
        vistaActual = "lista-labs";
        moduloSeleccionado = modulo;
        
        // Configurar UI de control
        btnBack.classList.remove("hidden-view");
        sectionModulos.classList.add("hidden-view");
        sectionEvidence.classList.add("hidden-view");
        sectionIndexLabs.classList.remove("hidden-view");
        
        document.getElementById("labs-index-title").innerText = `Laboratorios de ${modulo}`;

        // Filtrar datos
        const labsFiltrados = baseDatosLaboratorios.filter(lab => lab.modulo === modulo);
        
        labsListContainer.innerHTML = "";
        
        if(labsFiltrados.length === 0) {
            labsListContainer.innerHTML = `<p style="padding: 20px; color: #6a737d;">Próximamente se añadirán las evidencias para este módulo.</p>`;
            return;
        }

        // Crear las tarjetas dinámicamente usando tus estilos de '.lab-card'
        labsFiltrados.forEach(lab => {
            const card = document.createElement("a");
            card.href = "#";
            card.classList.add("lab-card");
            // Determinar color de tarjeta según estado
            const cardColor = lab.status === "done" ? "#3fb950" : "#58a6ff";
            card.style.setAttribute = `--card-color: ${cardColor}`;

            card.innerHTML = `
                <div class="lab-card-top">
                  <div class="lab-icon"><i class="fa-solid fa-flask"></i></div>
                  <span class="lab-status badge-${lab.status}">${lab.status_texto}</span>
                </div>
                <div class="lab-num">${lab.numero} · ${lab.modulo}</div>
                <div class="lab-name">${lab.titulo}</div>
                <div class="lab-desc">${lab.descripcion.substring(0, 100)}...</div>
            `;

            card.addEventListener("click", (e) => {
                e.preventDefault();
                mostrarDetalleEvidencia(lab);
            });

            labsListContainer.appendChild(card);
        });
        
        sectionIndexLabs.scrollIntoView({ behavior: "smooth" });
    }

    // VISTA 4: Desplegar la pantalla de detalle de un laboratorio específico
    function mostrarDetalleEvidencia(lab) {
        vistaActual = "detalle-evidencia";
        
        sectionIndexLabs.classList.add("hidden-view");
        sectionEvidence.classList.remove("hidden-view");

        // Rellenar los campos de la evidencia
        document.getElementById("evidence-module-breadcrumb").innerText = lab.modulo;
        document.getElementById("evidence-title-breadcrumb").innerText = lab.numero;
        document.getElementById("evidence-title").innerText = `${lab.numero}: ${lab.titulo}`;
        document.getElementById("evidence-desc").innerText = lab.descripcion;
        
        // Cargar Imagen
        const imgElement = document.getElementById("evidence-img");
        imgElement.src = lab.imagen;
        imgElement.alt = `Evidencia de ${lab.titulo}`;

        // Estado del badge
        const statusBadge = document.getElementById("evidence-status");
        statusBadge.className = `nav-badge badge-${lab.status}`;
        statusBadge.innerText = lab.status_texto;

        // Cargar las etiquetas (Tags)
        const tagsContainer = document.getElementById("evidence-tags");
        tagsContainer.innerHTML = "";
        lab.tags.forEach(tag => {
            const span = document.createElement("span");
            span.classList.add("tag");
            span.innerText = tag;
            tagsContainer.appendChild(span);
        });

        // Configurar enlace de GitHub
        document.getElementById("evidence-repo-link").href = lab.enlace_github;
        
        sectionEvidence.scrollIntoView({ behavior: "smooth" });
    }
});