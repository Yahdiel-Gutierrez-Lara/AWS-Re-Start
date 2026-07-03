def rombo():
    num = int(input("Digita un número: "))

    for i in range (0, num):
        print("*",end='')
        for j in range(0, i):
            print("*",end='')
        print()
    for i in range (num -1, 0, -1):
        print("*",end='')
        for j in range(i -1, 0, -1):
            print("*",end='')
        print()

rombo()