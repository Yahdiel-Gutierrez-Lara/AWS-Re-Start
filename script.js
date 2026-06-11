let baseDatosLaboratorios = [];
let vistaActual = "inicio"; // Estados: inicio, lista-labs, detalle-evidencia
let moduloSeleccionado = "";

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

        // Clics en los enlaces del Menú Lateral (Sidebar)
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