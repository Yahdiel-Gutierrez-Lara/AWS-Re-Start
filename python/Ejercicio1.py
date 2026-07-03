def datos(): 
    nombre = input("Dime tu nombre: ")
    apellido = input("Dime tu apellido: ")
    edad = int(input("¿Cuál es tu edad?: "))
    hobby = input("¿Qué te gusta hacer en tu tiempo libre?: ")

    print(f"\n--- Registro Exitoso ---")
    print(f"Nombre completo: {nombre} {apellido}")
    print(f"Edad: {edad} años")
    print(f"Hobby: {hobby}")

datos()
