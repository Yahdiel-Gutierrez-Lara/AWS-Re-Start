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
        
        // Renderizar descripción general con Markdown
        const descEl = document.getElementById("evidence-desc");
        descEl.innerHTML = lab.descripcion_general ? marked.parse(lab.descripcion_general) : "";
        
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
                        
                        // Caso A.1: La sección contiene Texto (Interpretado con Markdown)
                        if (sec.texto) {
                            const divTexto = document.createElement("div");
                            divTexto.style.color = "#444";
                            divTexto.style.lineHeight = "1.6";
                            divTexto.style.marginBottom = "14px";
                            divTexto.style.fontSize = "1rem";
                            divTexto.innerHTML = marked.parse(sec.texto); // <-- AQUÍ SE ACTIVA MARKED
                            pasoBlock.appendChild(divTexto);
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
                        const divTexto = document.createElement("div");
                        divTexto.style.color = "#444";
                        divTexto.style.lineHeight = "1.6";
                        divTexto.style.marginBottom = "14px";
                        divTexto.innerHTML = marked.parse(paso.texto); // <-- AQUÍ SE ACTIVA MARKED
                        pasoBlock.appendChild(divTexto);
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