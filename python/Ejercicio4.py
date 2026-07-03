def suma(n,m):
    resultado= n + m
    return resultado 

def resta(n,m):
    resultado= n - m
    return resultado 

def multi(n,m):
    resultado= n * m
    return resultado 

def div(n,m):
    resultado= n / m
    return resultado 



def calculadora():
    valor=input("Selecciona una opción: \n 1. Sumar \n 2. Restar \n 3. Multiplicación \n 4. División \n")

    match valor:
        case "1": 
            a = int(input("Digita el primer número: "))
            b = int(input("Digita el segundo número: "))
            print(f"Resultado: {suma(a,b)}")
        case "2": 
            a = int(input("Digita el primer número: "))
            b = int(input("Digita el segundo número: "))
            print(f"Resultado: {resta(a,b)}")
        case "3": 
            a = int(input("Digita el primer número: "))
            b = int(input("Digita el segundo número: "))
            print(f"Resultado: {multi(a,b)}")
        case "4": 
            a = int(input("Digita el primer número: "))
            b = int(input("Digita el segundo número: "))
            print(f"Resultado: {div(a,b)}")

calculadora()

