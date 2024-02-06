# from tkinter import *


# window = Tk()

# frame1 = Frame(window)
# label = Label(frame1,text="Frame 1")
# label.pack(anchor='nw')
# frame1.pack(anchor='nw')

# frame2 = Frame(window)
# labe2 = Label(frame2,text="Frame 2")
# labe2.pack(anchor='ne')
# frame2.place()

# frame1.config(borderwidth=10, relief="raised")
# frame2.config(borderwidth=10, relief='raised')



# window.mainloop()











import tkinter as tk

def criar_frames():
    # Criar a janela principal
    janela = tk.Tk()
    janela.title("Dois Frames ao Lado")

    # Criar o primeiro frame
    frame1 = tk.Frame(janela, width=200, height=300, bg="lightblue")
    frame1.place(x=600, y=200)

    # Criar o segundo frame
    frame2 = tk.Frame(janela, width=200, height=300, bg="lightgreen")
    frame2.place(x=200, y=10)  # Coloca o segundo frame ao lado do primeiro

    # Iniciar o loop principal
    janela.mainloop()

# Chama a função para criar os frames
criar_frames()