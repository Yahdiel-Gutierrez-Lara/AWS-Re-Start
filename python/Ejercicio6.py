import tkinter as tk
from tkinter import ttk, messagebox
# Integración de Matplotlib con Tkinter
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from matplotlib.figure import Figure

# --- FUNCIONES DE LÓGICA Y ACTUALIZACIÓN ---

def actualizar_grafica():
    """Calcula las tareas pendientes/completadas y redibuja la gráfica de pastel."""
    pendientes = 0
    completadas = 0
    
    # Contar estados en la tabla
    for elemento in tabla.get_children():
        estado = tabla.item(elemento, 'values')[0]
        if estado == "☐ Pendiente":
            pendientes += 1
        else:
            completadas += 1

    # Limpiar la gráfica anterior
    ax.clear()
    ax.set_title("Progreso de Tareas", fontsize=12, fontweight='bold', pad=15)

    # Si no hay tareas, mostrar una gráfica vacía gris
    if pendientes == 0 and completadas == 0:
        ax.pie([1], colors=["#e0e0e0"], startangle=90)
        ax.text(0, 0, "Sin tareas", ha='center', va='center', fontsize=10, color="#777777")
    else:
        valores = []
        etiquetas = []
        colores = []
        
        if pendientes > 0:
            valores.append(pendientes)
            etiquetas.append(f"Pendientes ({pendientes})")
            colores.append("#FF9800")
        if completadas > 0:
            valores.append(completadas)
            etiquetas.append(f"Completadas ({completadas})")
            colores.append("#4CAF50")

        # 1. Quitamos el parámetro 'labels' de ax.pie para que no salgan textos a los lados
        ax.pie(valores, colors=colores, autopct='%1.1f%%', startangle=90, 
               textprops={'fontsize': 10, 'weight': 'bold'})
        
        # 2. Agregamos la leyenda abajo
        # loc='upper center' y bbox_to_anchor=(0.5, -0.05) empujan la leyenda justo debajo del pastel
        # ncol=2 hace que las etiquetas se pongan una al lado de la otra en horizontal
        ax.legend(etiquetas, loc='upper center', bbox_to_anchor=(0.5, -0.05), 
                  ncol=2, frameon=False, fontsize=9)
        
    # Ajustar el diseño para que la leyenda no se corte al pintar el canvas
    figura.tight_layout()
    canvas.draw()

def agregar_tarea(event=None): # <--- Añadimos event=None aquí
    tarea = entrada_tarea.get().strip()
    if tarea:
        # Insertamos iniciando con la casilla vacía
        tabla.insert("", tk.END, values=("☐ Pendiente", tarea))
        entrada_tarea.delete(0, tk.END)
        actualizar_grafica()
    else:
        messagebox.showwarning("Atención", "Por favor, escribe una tarea.")

def alternar_estado(event):
    """Detecta el clic y alterna entre completado y pendiente instantáneamente."""
    elemento = tabla.identify_row(event.y)
    columna = tabla.identify_column(event.x)
    
    # Si hizo clic en la fila y específicamente en la columna del Checkbox (#1)
    if elemento and columna == "#1":
        valores = tabla.item(elemento, 'values')
        if valores[0] == "☐ Pendiente":
            nuevo_estado = "☑ Completa"
        else:
            nuevo_estado = "☐ Pendiente"
            
        tabla.item(elemento, values=(nuevo_estado, valores[1]))
        actualizar_grafica()

def editar_tarea():
    seleccion = tabla.selection()
    if not seleccion:
        messagebox.showwarning("Atención", "Selecciona una tarea de la lista para editar.")
        return
    
    elemento = seleccion[0]
    valores = tabla.item(elemento, 'values')
    
    ventana_editar = tk.Toplevel(ventana)
    ventana_editar.title("Editar Tarea")
    ventana_editar.geometry("300x130")
    ventana_editar.resizable(False, False)
    ventana_editar.grab_set() # Bloquea la ventana principal mientras se edita
    
    tk.Label(ventana_editar, text="Modificar texto de la tarea:", font=("Arial", 10)).pack(pady=10)
    entrada_editada = tk.Entry(ventana_editar, width=32, font=("Arial", 10))
    entrada_editada.insert(0, valores[1])
    entrada_editada.pack()
    
    def guardar_cambios():
        nuevo_texto = entrada_editada.get().strip()
        if nuevo_texto:
            tabla.item(elemento, values=(valores[0], nuevo_texto))
            ventana_editar.destroy()
        else:
            messagebox.showwarning("Atención", "El texto no puede estar vacío.")

    tk.Button(ventana_editar, text="Guardar Cambios", command=guardar_cambios, bg="#2196F3", fg="white", bd=0, padx=10, pady=5).pack(pady=10)

def eliminar_tarea():
    seleccion = tabla.selection()
    if seleccion:
        for elemento in seleccion:
            tabla.delete(elemento)
        actualizar_grafica()
    else:
        messagebox.showwarning("Atención", "Selecciona una tarea para eliminar.")


# --- CONFIGURACIÓN DE LA INTERFAZ GRÁFICA (GUI) ---

ventana = tk.Tk()
ventana.title("Gestor de Tareas con Analíticas")
ventana.geometry("850x480")
ventana.configure(bg="#f5f5f5")

# PANALES PRINCIPALES (Izquierda: Control de tareas | Derecha: Gráfica)
panel_izquierdo = tk.Frame(ventana, bg="#f5f5f5")
panel_izquierdo.pack(side=tk.LEFT, fill="both", expand=True, padx=15, pady=15)

panel_derecho = tk.Frame(ventana, bg="white", bd=1, relief="solid")
panel_derecho.pack(side=tk.RIGHT, fill="both", padx=15, pady=15)

# --- PANEL IZQUIERDO: SECCIÓN DE TAREAS ---

# Entrada de texto y botón agregar
frame_entrada = tk.Frame(panel_izquierdo, bg="#f5f5f5")
frame_entrada.pack(fill="x", pady=(0, 10))

btn_agregar = tk.Button(frame_entrada, text="+ Agregar", font=("Arial", 10, "bold"), bg="#2196F3", fg="white", bd=0, padx=15, command=agregar_tarea)
btn_agregar.pack(side=tk.RIGHT, ipady=3)

# Tabla de tareas (Treeview)
frame_tabla = tk.Frame(panel_izquierdo)
frame_tabla.pack(fill="both", expand=True)

columnas = ("estado", "tarea")
tabla = ttk.Treeview(frame_tabla, columns=columnas, show="headings", selectmode="browse")

tabla.heading("estado", text="¿Lista?")
tabla.heading("tarea", text="Descripción de la Tarea")

tabla.column("estado", width=100, minwidth=100, anchor="center")
tabla.column("tarea", width=250, minwidth=150, anchor="w")

# Detectar el clic izquierdo en la tabla para activar el checkbox
tabla.bind("<ButtonRelease-1>", alternar_estado)

scrollbar = ttk.Scrollbar(frame_tabla, orient=tk.VERTICAL, command=tabla.yview)
tabla.configure(yscrollcommand=scrollbar.set)

tabla.pack(side=tk.LEFT, fill="both", expand=True)
scrollbar.pack(side=tk.RIGHT, fill="y")

# Botones de Acción (Editar / Eliminar)
frame_acciones = tk.Frame(panel_izquierdo, bg="#f5f5f5")
frame_acciones.pack(fill="x", pady=(10, 0))

btn_editar = tk.Button(frame_acciones, text="✏ Editar Texto", font=("Arial", 10), bg="#FF9800", fg="white", bd=0, pady=6, command=editar_tarea)
btn_editar.pack(side=tk.LEFT, expand=True, fill="x", padx=(0, 5))

btn_eliminar = tk.Button(frame_acciones, text="❌ Eliminar Tarea", font=("Arial", 10), bg="#F44336", fg="white", bd=0, pady=6, command=eliminar_tarea)
btn_eliminar.pack(side=tk.RIGHT, expand=True, fill="x", padx=(5, 0))

entrada_tarea = tk.Entry(frame_entrada, font=("Arial", 12), width=25)
entrada_tarea.pack(side=tk.LEFT, padx=(0, 5), ipady=4, expand=True, fill="x")

# --- ENLAZAR AMBOS TIPOS DE ENTER ---
entrada_tarea.bind("<Return>", agregar_tarea)   # Enter principal
entrada_tarea.bind("<KP_Enter>", agregar_tarea) # Enter del teclado numérico (KeyPad)


# --- PANEL DERECHO: INTEGRACIÓN DE MATPLOTLIB ---

# Creamos la figura de Matplotlib
figura = Figure(figsize=(3, 3), dpi=100)
ax = figura.add_subplot(111)

# Añadimos la figura al canvas de Tkinter
canvas = FigureCanvasTkAgg(figura, master=panel_derecho)
canvas.get_tk_widget().pack(fill="both", expand=True, padx=10, pady=10)

# Dibujar estado inicial de la gráfica
actualizar_grafica()

# Lanzar bucle de la aplicación
ventana.mainloop()