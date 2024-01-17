from tkinter import ttk
from tkinter import messagebox
from tkinter import *
from app2_openpyxl import Produtos
from app3_selenium import Navegador

prod = Produtos()
nav = Navegador()

def abrir_planilha():
    prod.set_tudo()


def mostrarQuantidades():
    print(prod.array_quant_result)

def carregar_navegador():
    nav.carregar_navegador()

def fazer_devolucao():
    nav.fazer_devolucao(prod.array_cod_prod,prod.array_lote, prod.array_quant_result)
    atualizar_contador()

def mostrar_dados_planilha():
    dados, tamanho = nav.dados_planilha(prod)
    vazio = all(not subarray for subarray in dados)
    if not vazio:
        messagebox.showinfo(title='Atenção!',message='Planilha não selecionada')
    
    for i in range(tamanho):
        print(f"{str(i + 1):4} Cód. Produto: {dados[0][i]:12} Lote: {dados[1][i]:12} Quantidade: {str(dados[2][i]):6} Nome: {dados[3][i]}")

    print(f"Total de produtos: {tamanho}")


def inserir_codigo():
    nav.inserir_codigo(prod.array_cod_prod)
    atualizar_contador()


def sair():
    window.destroy()


def pular_linha():
    nav.contador()
    atualizar_contador()


def voltar_linha():
    nav.descontador()
    atualizar_contador()


def alterar_linha():
    nova_linha = campo_texto.get()
    if nova_linha is None or nova_linha == "" or nova_linha == 0:
        nova_linha = 1
    nav.alter_contador(int(nova_linha)-2)
    atualizar_contador()


def atualizar_contador():
    label_info.config(text="Linha: "+str(int(nav.get_contador()+2)))


window = Tk()

notebook = ttk.Notebook(window)  # Um widget que gerencia uma coleção de janelas/displays
notebook.pack(
    expand=True,  # expande para preencher qualquer espaço que não seja utilizado de outra forma para poder ficar no meio da janela
    fill='both',  # para que fill= funcione corretamente, é necessario o expand=True
    )

tab1 = Frame(notebook)  # um novo frame para a tab 1
tab2 = Frame(notebook)

notebook.add(tab1, text="Tab 1")
notebook.add(tab2, text="Tab 2")

# Criacao do botao voltar linha
botao = Button(tab1, text="Voltar linha", command=voltar_linha)
botao.pack(side=TOP, padx=5)

# Criacao do botao pular linha
botao = Button(tab1, text="Pular linha", command=pular_linha)
botao.pack(side=TOP, padx=5)

# Criacao da label que mostra o contador/linha
label_info = Label(tab1, font=('Arial', 10), text="Linha: " + str(int(nav.get_contador() + 2)))
label_info.pack(side=TOP, padx=5)

# Criacao da entry box para alterar a linha (alterar para a linha desejada)
campo_texto = Entry(tab1)
campo_texto.pack()

# Criacao do botao 'Alterar linha'
botao_alterar = Button(tab1, text="Alterar linha", command=alterar_linha)
botao_alterar.pack(side=TOP, padx=5)

# Criacao dos label da tab2
label_head_linha = Label(tab2, text='Linha', font=('Arial', 12, 'bold') ,bd=1, relief='solid', bg='#3399ff', foreground='white')
label_head_linha.grid(column=0, row=0, ipadx=10 ,ipady=5)
label_head_cod_prod = Label(tab2, text='Código do produto', font=(12) ,bd=1, relief='solid', bg='blue')
label_head_cod_prod.grid(column=1, row=0, ipadx=15 ,ipady=5)
label_head_lote = Label(tab2, text='Lote', font=(12) ,bd=1, relief='solid', bg='blue')
label_head_lote.grid(column=2, row=0, ipadx=70 ,ipady=5)
label_head_lote = Label(tab2, text='Quantidade', font=(12) ,bd=1, relief='solid', bg='blue')
label_head_lote.grid(column=3, row=0, ipadx=5 ,ipady=5)
label_head_lote = Label(tab2, text='Nome do Produto', font=(12) ,bd=1, relief='solid', bg='blue')
label_head_lote.grid(column=4, row=0, ipadx=200 ,ipady=5)

# Definicao dos botoes da tela inicial
Button(tab1, text='Abrir Planilha', foreground="#FFFFFF", background='#006633', font=('Arial', 15), command=abrir_planilha).pack(padx=8, pady=8, fill=BOTH, )
Button(tab1, text='Carregar Navegador', foreground="#FFFFFF", background='#A57A0F', font=('Arial', 15), command=carregar_navegador).pack(padx=8, pady=8, fill=BOTH)
Button(tab1, text='Inserir Código', foreground="#FFFFFF", background='#0D214F', font=('Arial', 15), command=inserir_codigo).pack(padx=8, pady=8, fill=BOTH)
Button(tab1, text='Fazer Devolução', foreground="#FFFFFF", background='#0D214F', font=('Arial', 15), command=fazer_devolucao).pack(padx=8, pady=8, fill=BOTH)
Button(tab1, text='Mostrar quantidades', font=('Arial', 15), command=mostrarQuantidades).pack(padx=8, pady=8, fill=BOTH, )
Button(tab1, text='Mostrar dados planilha', font=('Arial', 15), command=mostrar_dados_planilha).pack(padx=8, pady=8, fill=BOTH, )
Button(tab1, text='Sair', foreground="#FFFFFF", background='#8B0000', font=('Arial', 15, ), command=sair).pack(padx=8, pady=8, fill=BOTH, )

window.mainloop()
