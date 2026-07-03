def contador():
    texto = input("Escribe un texto y te dire cuantos caracteres tiene:")

    texto_nuevo = texto.replace(" ", "")

    num = len(texto_nuevo)

    print(f"Texto insertado: {texto}")
    print(f"Número de caracteres: {num}")

contador()