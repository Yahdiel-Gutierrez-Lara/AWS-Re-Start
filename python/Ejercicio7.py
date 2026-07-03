import tkinter as tk
from tkinter import ttk
import json
import os
import random

ARCHIVO = "nombres.json"

# Crear archivo inicial con 50 nombres de niños y 50 de niñas
def crear_archivo_inicial():
    datos_iniciales = {
        "niñas": {
            "sofia": "sabiduría", "isabella": "promesa de dios", "valentina": "valiente y fuerte",
            "sarah": "princesa", "elena": "antorcha brillante", "emma": "universal y fuerte",
            "olivia": "la que trae paz", "mia": "la elegida", "ava": "llena de vida",
            "lucia": "nacida de la luz", "amalia": "trabajadora", "victoria": "triunfadora",
            "clara": "brillante y pura", "aurora": "amanecer", "luna": "brillante como el satélite",
            "zoe": "llena de vida", "julia": "fuente de juventud", "alba": "primera luz del día",
            "gala": "hermosa y solemne", "alma": "bondadosa y espiritual", "iris": "arcoíris de colores",
            "chloe": "brote verde", "maya": "ilusión o madre", "abril": "apertura y frescura",
            "gemma": "piedra preciosa", "ada": "de noble linaje", "lea": "fuerte o leona",
            "eva": "la que da vida", "ana": "benéfica y compasiva", "ines": "pura y casta",
            "carmen": "jardín de dios", "marta": "señora", "laura": "victoriosa", 
            "paula": "pequeña y humilde", "daniela": "justicia de dios", "adriana": "mujer del mar", 
            "martina": "consagrada a marte", "sara": "princesa", "camila": "mensajera de dios", 
            "valeria": "sana y fuerte", "natalia": "nacida en navidad", "andrea": "valiente", 
            "gabriela": "fuerza de dios", "rebeca": "lazo fuerte", "triana": "más allá del río", 
            "jimena": "la que escucha", "blanca": "brillante y pura", "ariadna": "muy pura", 
            "carlota": "mujer fuerte", "elisa": "propuesta divina"
        },
        "niños": {
            "mateo": "regalo de dios", "santiago": "sostenido por el talón", "matias": "fiel a dios",
            "sebastian": "honrado y reverenciado", "alejandro": "defensor de hombres", "diego": "profesor o educado",
            "nicolas": "victoria del pueblo", "samuel": "escuchado por dios", "daniel": "dios es mi juez",
            "lucas": "luminoso", "benjamin": "hijo de la mano derecha", "gabriel": "fuerza de dios",
            "martin": "guerrero", "joaquin": "dios construirá", "tomas": "gemelo",
            "leo": "fuerte como un león", "ian": "dios es misericordioso", "enzo": "dueño de su casa",
            "gael": "generoso", "liam": "protector firme", "noah": "descanso y paz",
            "alan": "armonía y paz", "axel": "padre de la paz", "bruno": "coraza o marrón",
            "hugo": "inteligente y brillante", "ivan": "compasión de dios", "oliver": "defensor de la paz",
            "thiago": "dios nos recompensará", "milo": "soldado o misericordioso", "eric": "gobernante eterno",
            "adrian": "hombre del mar", "marcos": "martillo o guerrero", "david": "el amado",
            "angel": "mensajero", "javier": "casa nueva", "manuel": "dios con nosotros",
            "carlos": "hombre libre", "luis": "guerrero famoso", "juan": "fiel a dios",
            "pedro": "firme como piedra", "pablo": "pequeño y humilde", "sergio": "guardián",
            "jorge": "trabajador de la tierra", "alberto": "noble y brillante", "miguel": "quién como dios",
            "fernando": "viajero audaz", "raul": "consejero lobo", "gonzalo": "salvado en el combate",
            "rodrigo": "guerrero glorioso", "alonso": "noble y preparado"
        }
    }

    if os.path.exists(ARCHIVO):
        try:
            with open(ARCHIVO, "r", encoding="utf-8") as archivo:
                actuales = json.load(archivo)
            if "niñas" not in actuales or "niños" not in actuales:
                raise KeyError
        except:
            with open(ARCHIVO, "w", encoding="utf-8") as archivo:
                json.dump(datos_iniciales, archivo, indent=4, ensure_ascii=False)
    else:
        with open(ARCHIVO, "w", encoding="utf-8") as archivo:
            json.dump(datos_iniciales, archivo, indent=4, ensure_ascii=False)

def cargar_nombres():
    with open(ARCHIVO, "r", encoding="utf-8") as archivo:
        return json.load(archivo)

def guardar_nombres(diccionario):
    with open(ARCHIVO, "w", encoding="utf-8") as archivo:
        json.dump(diccionario, archivo, indent=4, ensure_ascii=False)

# Función para calcular qué tan bien suena un nombre (1 a 5 estrellas)
def calcular_estrellas(nombre_completo):
    # Algoritmo de armonía: evalúa variedad de vocales y longitud ideal
    nombre_limpio = nombre_completo.lower().replace(" ", "")
    vocales = set([c for c in nombre_limpio if c in "aeiouáéíóú"])
    
    # Base de estrellas por la variedad armónica de sonidos
    puntos = len(vocales) 
    
    # Penalizar si es exageradamente largo o premiar equilibrio
    if 7 <= len(nombre_limpio) <= 14:
        puntos += 1
        
    estrellas = min(5, max(1, puntos))
    return "⭐" * estrellas

# 1. Procesar un solo nombre o generar un nombre compuesto
def generar_nombre():
    datos = cargar_nombres()
    todos_nombres = {**datos["niñas"], **datos["niños"]}

    nombre1 = entrada_nombre1.get().lower().strip()
    nombre2 = entrada_nombre2.get().lower().strip()

    if nombre1 == "" and nombre2 == "":
        resultado.config(text="⚠️ Por favor, escribe al menos un nombre.")
        return

    if nombre1 == "" or nombre2 == "":
        nombre_unico = nombre1 if nombre1 != "" else nombre2
        significado = todos_nombres.get(nombre_unico, "una esencia única y un futuro brillante")
        nombre_cap = nombre_unico.capitalize()
        estrellas = calcular_estrellas(nombre_cap)
        
        texto = (
            f"👤 Nombre consultado: {nombre_cap}\n"
            f"Calidad Sonora: {estrellas}\n\n"
            f"📖 Significado:\n"
            f"Este nombre representa {significado}."
        )
    else:
        significado1 = todos_nombres.get(nombre1, "una personalidad única")
        significado2 = todos_nombres.get(nombre2, "un espíritu especial")
        nombre_compuesto = f"{nombre1.capitalize()} {nombre2.capitalize()}"
        estrellas = calcular_estrellas(nombre_compuesto)
        
        texto = (
            f"✨ Nombre compuesto: {nombre_compuesto}\n"
            f"Calidad Sonora: {estrellas}\n\n"
            f"📖 Significado Combinado:\n"
            f"Este nombre une {significado1} con {significado2}."
        )

    resultado.config(text=texto)

# 2. Sugerir nombres bajo criterios específicos
def sugerir_nombre_criterio():
    datos = cargar_nombres()
    genero = combo_genero.get().lower()
    longitud_deseada = combo_longitud.get()
    tipo_nombre = combo_tipo.get()

    lista_base = datos[genero]
    candidatos = []

    for nombre, significado in lista_base.items():
        es_corto = len(nombre) <= 5
        if longitud_deseada.startswith("Corto") and es_corto:
            candidatos.append((nombre, significado))
        elif longitud_deseada.startswith("Largo") and not es_corto:
            candidatos.append((nombre, significado))

    if not candidatos:
        resultado.config(text="No se encontraron nombres con esos criterios específicos.")
        return

    if tipo_nombre == "Un nombre":
        elegido, significado = random.choice(candidatos)
        nom_cap = elegido.capitalize()
        texto = f"💡 Sugerencia: {nom_cap}\nCalidad Sonora: {calcular_estrellas(nom_cap)}\n\n📖 Significado profundo: {significado}."
    else:
        if len(candidatos) < 2:
            resultado.config(text="No hay suficientes nombres para hacer una combinación.")
            return
        primero, sig1 = random.choice(candidatos)
        segundo, sig2 = random.choice([c for c in candidatos if c[0] != primero])
        nom_comp = f"{primero.capitalize()} {segundo.capitalize()}"
        
        texto = (
            f"💡 Sugerencia Compuesta: {nom_comp}\n"
            f"Calidad Sonora: {calcular_estrellas(nom_comp)}\n\n"
            f"📖 Significado profundo:\n"
            f"- {primero.capitalize()}: {sig1}\n"
            f"- {segundo.capitalize()}: {sig2}"
        )

    resultado.config(text=texto)

# 3. Agregar un nuevo nombre al diccionario
def agregar_nombre():
    datos = cargar_nombres()
    nuevo_nombre = entrada_nuevo_nombre.get().lower().strip()
    nuevo_significado = entrada_significado.get().lower().strip()
    genero_destino = combo_agregar_genero.get().lower()

    if nuevo_nombre == "" or nuevo_significado == "":
        resultado.config(text="Escribe el nombre y su significado.")
        return

    datos[genero_destino][nuevo_nombre] = nuevo_significado
    guardar_nombres(datos)
    resultado.config(text=f"El nombre '{nuevo_nombre.capitalize()}' fue agregado correctamente a {genero_destino}.")

# 4. NUEVA FUNCIÓN: Mostrar la lista completa de nombres registrados
def ver_lista_nombres():
    datos = cargar_nombres()
    
    # Crear ventana secundaria
    ventana_lista = tk.Toplevel(ventana)
    ventana_lista.title("Diccionario de Nombres Registrados")
    ventana_lista.geometry("550x500")
    
    # Notebook para pestañas limpias (Niñas / Niños)
    tab_control = ttk.Notebook(ventana_lista)
    
    tab_ninas = ttk.Frame(tab_control)
    tab_ninos = ttk.Frame(tab_control)
    
    tab_control.add(tab_ninas, text=" 🌸 Niñas ")
    tab_control.add(tab_ninos, text=" 🚙 Niños ")
    tab_control.pack(expand=1, fill="both")
    
    # Crear áreas de texto con Scrollbars para cada pestaña
    for datos_genero, pestaña in [(datos["niñas"], tab_ninas), (datos["niños"], tab_ninos)]:
        txt_frame = ttk.Frame(pestaña)
        txt_frame.pack(expand=True, fill="both", padx=10, pady=10)
        
        scroll = ttk.Scrollbar(txt_frame)
        scroll.pack(side="right", fill="y")
        
        area_texto = tk.Text(txt_frame, wrap="word", yscrollcommand=scroll.set, font=("Arial", 10))
        area_texto.pack(side="left", expand=True, fill="both")
        scroll.config(command=area_texto.yview)
        
        # Insertar los nombres ordenados alfabéticamente
        for nom in sorted(datos_genero.keys()):
            area_texto.insert("end", f"• {nom.capitalize()}: {datos_genero[nom]}\n")
        
        area_texto.config(state="disabled") # Bloquear escritura

# Inicializar Archivo
crear_archivo_inicial()

# Ventana principal
ventana = tk.Tk()
ventana.title("Generador & Buscador de Nombres")
ventana.geometry("620x680")

# Contenedor con Scroll
canvas = tk.Canvas(ventana)
scrollbar = ttk.Scrollbar(ventana, orient="vertical", command=canvas.yview)
scrollable_frame = ttk.Frame(canvas)

scrollable_frame.bind(
    "<Configure>",
    lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
)

canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
canvas.configure(yscrollcommand=scrollbar.set)
canvas.pack(side="left", fill="both", expand=True)
scrollbar.pack(side="right", fill="y")

# --- SECCIÓN 1: TÍTULO Y BOTÓN VER REGISTROS ---
frame_top = tk.Frame(scrollable_frame)
frame_top.pack(fill="x", pady=10, padx=15)

titulo = tk.Label(frame_top, text="Generador de Nombres", font=("Arial", 16, "bold"))
titulo.pack(side="left")

boton_ver_lista = tk.Button(frame_top, text="📋 Ver Diccionario Completo", command=ver_lista_nombres, bg="#eceff1", font=("Arial", 9, "bold"))
boton_ver_lista.pack(side="right")

# --- SECCIÓN 2: CONSULTA / COMPOSICIÓN ---
frame_mezcla = tk.LabelFrame(scrollable_frame, text=" Ver Significado o Crear Nombre Compuesto ", padx=10, pady=10)
frame_mezcla.pack(fill="x", padx=15, pady=5)

tk.Label(frame_mezcla, text="Primer nombre:").grid(row=0, column=0, sticky="w")
entrada_nombre1 = tk.Entry(frame_mezcla, width=25)
entrada_nombre1.grid(row=0, column=1, pady=5)

tk.Label(frame_mezcla, text="Segundo nombre (Opcional):").grid(row=1, column=0, sticky="w")
entrada_nombre2 = tk.Entry(frame_mezcla, width=25)
entrada_nombre2.grid(row=1, column=1, pady=5)

boton_generar = tk.Button(frame_mezcla, text="Procesar Nombre(s)", command=generar_nombre, bg="#e1f5fe")
boton_generar.grid(row=2, column=0, columnspan=2, pady=10)

# --- SECCIÓN 3: SUGERENCIAS FILTRADAS ---
frame_sugerencia = tk.LabelFrame(scrollable_frame, text=" Sugerir Nombre por Características ", padx=10, pady=10)
frame_sugerencia.pack(fill="x", padx=15, pady=5)

tk.Label(frame_sugerencia, text="Género:").grid(row=0, column=0, sticky="w")
combo_genero = ttk.Combobox(frame_sugerencia, values=["Niñas", "Niños"], state="readonly", width=22)
combo_genero.current(0)
combo_genero.grid(row=0, column=1, pady=5)

tk.Label(frame_sugerencia, text="Tamaño:").grid(row=1, column=0, sticky="w")
combo_longitud = ttk.Combobox(frame_sugerencia, values=["Corto (1-5 letras)", "Largo (6+ letras)"], state="readonly", width=22)
combo_longitud.current(0)
combo_longitud.grid(row=1, column=1, pady=5)

tk.Label(frame_sugerencia, text="Formato:").grid(row=2, column=0, sticky="w")
combo_tipo = ttk.Combobox(frame_sugerencia, values=["Un nombre", "Nombre compuesto (Dos)"], state="readonly", width=22)
combo_tipo.current(0)
combo_tipo.grid(row=2, column=1, pady=5)

boton_sugerir = tk.Button(frame_sugerencia, text="Sugerir Nombre Profundo", command=sugerir_nombre_criterio, bg="#e8f5e9")
boton_sugerir.grid(row=3, column=0, columnspan=2, pady=10)

# --- SECCIÓN 4: AGREGAR NUEVOS NOMBRES ---
frame_agregar = tk.LabelFrame(scrollable_frame, text=" Agregar al Diccionario ", padx=10, pady=10)
frame_agregar.pack(fill="x", padx=15, pady=5)

tk.Label(frame_agregar, text="Nombre:").grid(row=0, column=0, sticky="w")
entrada_nuevo_nombre = tk.Entry(frame_agregar, width=25)
entrada_nuevo_nombre.grid(row=0, column=1, pady=5)

tk.Label(frame_agregar, text="Significado:").grid(row=1, column=0, sticky="w")
entrada_significado = tk.Entry(frame_agregar, width=25)
entrada_significado.grid(row=1, column=1, pady=5)

tk.Label(frame_agregar, text="Categoría:").grid(row=2, column=0, sticky="w")
combo_agregar_genero = ttk.Combobox(frame_agregar, values=["Niñas", "Niños"], state="readonly", width=22)
combo_agregar_genero.current(0)
combo_agregar_genero.grid(row=2, column=1, pady=5)

boton_agregar = tk.Button(frame_agregar, text="Guardar en Diccionario", command=agregar_nombre, bg="#fff3e0")
boton_agregar.grid(row=3, column=0, columnspan=2, pady=10)

# --- SECCIÓN 5: RESULTADOS ---
frame_resultado = tk.LabelFrame(scrollable_frame, text=" Resultado / Respuesta ", padx=10, pady=10)
frame_resultado.pack(fill="both", expand=True, padx=15, pady=10)

resultado = tk.Label(frame_resultado, text="Escribe un nombre arriba o pide una sugerencia.", wraplength=500, justify="left", font=("Arial", 11, "italic"))
resultado.pack(pady=5)

ventana.mainloop()