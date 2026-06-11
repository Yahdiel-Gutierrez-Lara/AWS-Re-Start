let baseDatosLaboratorios = [];
let vistaActual = "inicio"; 
let moduloSeleccionado = "";

document.addEventListener("DOMContentLoaded", () => {
    // Referencias HTML
    const panelBienvenida = document.getElementById("panel-bienvenida");
    const sectionModulos = document.getElementById("modulos");
    const sectionIndexLabs = document.getElementById("labs-index-view");
    const sectionEvidence = document.getElementById("evidence-view");
    const labsListContainer = document.getElementById("labs-list-container");
    const btnBack = document.getElementById("btn-back");

    fetch("laboratorios.json")
        .then(response => response.json())
        .then(data => {
            baseDatosLaboratorios = data;
            mapearEventos();
        });

    function mapearEventos() {
        document.querySelectorAll(".module-item").forEach(item => {
            item.addEventListener("click", (e) => {
                e.preventDefault();
                const nombreModulo = item.getAttribute("data-module");
                mostrarListaLaboratorios(nombreModulo);
            });
        });

        document.querySelectorAll(".nav-link").forEach(link => {
            link.addEventListener("click", (e) => {
                const href = link.getAttribute("href");
                if (href === "#inicio") irAInicio();
                if (href === "#modulos") irAModulos();
            });
        });

        btnBack.addEventListener("click", () => {
            if (vistaActual === "detalle-evidencia") {
                mostrarListaLaboratorios(moduloSeleccionado);
            } else if (vistaActual === "lista-labs") {
                irAInicio();
            }
        });
    }

    function irAInicio() {
        vistaActual = "inicio";
        btnBack.classList.add("hidden-view");
        panelBienvenida.classList.remove("hidden-view"); // Muestra las estadísticas
        sectionModulos.classList.remove("hidden-view");   // Muestra los módulos
        sectionIndexLabs.classList.add("hidden-view");
        sectionEvidence.classList.add("hidden-view");
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function irAModulos() {
        irAInicio();
        setTimeout(() => {
            sectionModulos.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }

    // Al dar clic en un Módulo (Ej: Linux)
    function mostrarListaLaboratorios(modulo) {
        vistaActual = "lista-labs";
        moduloSeleccionado = modulo;
        
        btnBack.classList.remove("hidden-view");
        panelBienvenida.classList.add("hidden-view"); // ¡AQUÍ SE OCULTAN LAS ESTADÍSTICAS!
        sectionModulos.classList.add("hidden-view");   // Oculta el índice de módulos
        sectionEvidence.classList.add("hidden-view");
        sectionIndexLabs.classList.remove("hidden-view");
        
        document.getElementById("labs-index-title").innerText = `Laboratorios de ${modulo}`;

        const labsFiltrados = baseDatosLaboratorios.filter(lab => lab.modulo === modulo);
        labsListContainer.innerHTML = "";
        
        if(labsFiltrados.length === 0) {
            labsListContainer.innerHTML = `<p style="padding: 20px; color: #8b949e;">Próximamente se añadirán las evidencias para este módulo.</p>`;
            return;
        }

        labsFiltrados.forEach(lab => {
            const card = document.createElement("a");
            card.href = "#";
            card.classList.add("lab-card");
            
            // Reutiliza tus estados CSS
            const statusClass = lab.status === "done" ? "badge-done" : "badge-wip";

            card.innerHTML = `
                <div class="lab-card-top">
                  <div class="lab-icon"><i class="fa-solid fa-flask"></i></div>
                  <span class="lab-status ${statusClass}">${lab.status_texto}</span>
                </div>
                <div class="lab-num">${lab.numero} · ${lab.modulo}</div>
                <div class="lab-name">${lab.titulo}</div>
                <div class="lab-desc">${lab.descripcion_general.substring(0, 100)}...</div>
            `;

            card.addEventListener("click", (e) => {
                e.preventDefault();
                mostrarDetalleEvidencia(lab);
            });

            labsListContainer.appendChild(card);
        });
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Al dar clic en un laboratorio específico
    function mostrarDetalleEvidencia(lab) {
        vistaActual = "detalle-evidencia";
        
        panelBienvenida.classList.add("hidden-view"); // Asegura que sigan ocultas las stats
        sectionIndexLabs.classList.add("hidden-view");
        sectionEvidence.classList.remove("hidden-view");

        document.getElementById("evidence-module-breadcrumb").innerText = lab.modulo;
        document.getElementById("evidence-title-breadcrumb").innerText = lab.numero;
        document.getElementById("evidence-title").innerText = `${lab.numero}: ${lab.titulo}`;
        document.getElementById("evidence-desc").innerText = lab.descripcion_general;
        
        // Manejar el estado del Badge
        const statusBadge = document.getElementById("evidence-status");
        statusBadge.className = `nav-badge ${lab.status === "done" ? "badge-done" : "badge-wip"}`;
        statusBadge.innerText = lab.status_texto;

        // ── MAGIC: Renderizar múltiples pasos descripciones e imágenes ──
        const stepsContainer = document.getElementById("evidence-steps-container");
        stepsContainer.innerHTML = ""; // Limpiar pasos anteriores

        if (lab.pasos && lab.pasos.length > 0) {
            lab.pasos.forEach(paso => {
                const pasoBlock = document.createElement("div");
                pasoBlock.style.marginBottom = "35px";
                pasoBlock.style.borderTop = "1px solid #eaecef";
                pasoBlock.style.paddingTop = "20px";

                pasoBlock.innerHTML = `
                    <h3 style="font-family: 'IBM Plex Sans', sans-serif; color: #24292e; margin-bottom: 10px;">${paso.subtitulo}</h3>
                    <p style="color: #444; line-height: 1.6; margin-bottom: 15px; font-size: 1rem;">${paso.texto}</p>
                    <div style="text-align: center; background: #fafafa; border-radius: 6px; padding: 10px; border: 1px dashed #e1e4e8;">
                        <img src="${paso.imagen}" alt="${paso.subtitulo}" style="max-width: 100%; max-height: 450px; border-radius: 4px; object-fit: contain;" loading="lazy">
                    </div>
                `;
                stepsContainer.appendChild(pasoBlock);
            });
        }

        // Cargar las etiquetas (Tags)
        const tagsContainer = document.getElementById("evidence-tags");
        tagsContainer.innerHTML = "";
        lab.tags.forEach(tag => {
            const span = document.createElement("span");
            span.classList.add("tag");
            span.innerText = tag;
            tagsContainer.appendChild(span);
        });

        document.getElementById("evidence-repo-link").href = lab.enlace_github;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});