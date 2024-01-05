from tkinter import ttk
from tkinter import *
from tkinter import filedialog
from app2_openpyxl import Produtos
from app3_selenium import Navegador

prod = Produtos() 
nav = Navegador()

def abrir_planilha():
    prod.set_tudo()
    
def mostrarQuantidades():
    print(prod.array_quant_result)
    
def enviar_dados_selenium():
    nav.dados_planilha(prod)

def carregar_navegador():
    nav.carregar_navegador()

def fazer_devolucao():
    nav.fazer_devolucao(prod.array_cod_prod,prod.array_lote, prod.array_quant_result)
    atualizar_contador()
   
def print_dados_planilha():
    print(nav.dados_planilha(prod))
    
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
    if nova_linha == None or nova_linha == "" or nova_linha == 0:
        nova_linha = 1
    nav.alter_contador(int(nova_linha)-2)
    atualizar_contador()

def atualizar_contador():
    label_info.config(text="Linha: "+str(int(nav.get_contador()+2)))

window = Tk()



notebook = ttk.Notebook(window) # Um widget que gerencia uma coleção de janelas/displays
notebook.pack(
    expand=True, # expande para preencher qualquer espaço que não seja utilizado de outra forma para poder ficar no meio da janela
    fill='both', # para que fill= funcione corretamente, é necessario o expand=True
    )

tab1 = Frame(notebook) # um novo frame para a tab 1
tab2 = Frame(notebook,bg='black')

notebook.add(tab1,text="Tab 1")
notebook.add(tab2,text="Tab 2")

# Criando um botão
botao = Button(tab1, text="Voltar linha", command=voltar_linha)
botao.pack(side=TOP, padx=5)
# Criando um botão
botao = Button(tab1, text="Pular linha", command=pular_linha)
botao.pack(side=TOP, padx=5)

# Criando uma label
label_info = Label(tab1,font=('Arial', 10) ,text="Linha: "+str(int(nav.get_contador()+2)))
label_info.pack(side=TOP, padx=5)

# Criando um campo de texto
campo_texto = Entry(tab1)
campo_texto.pack()

# Criando um botão para alterar a label
botao_alterar = Button(tab1, text="Alterar linha", command=alterar_linha)
botao_alterar.pack(side=TOP, padx=5)

Label(tab2, text='Inserir dados', width= 22, height=10, bg='light yellow').pack()

Button(tab1, text='Abrir Planilha',foreground="#FFFFFF",background='#006633', font=('Arial', 15), command=abrir_planilha).pack(padx=8, pady=8, fill=BOTH, )
Button(tab1, text='Carregar Navegador',foreground="#FFFFFF",background='#A57A0F' ,font=('Arial', 15), command=carregar_navegador).pack(padx=8, pady=8, fill=BOTH)
Button(tab1, text='Inserir Código', foreground="#FFFFFF",background='#0D214F', font=('Arial', 15), command=inserir_codigo).pack(padx=8, pady=8, fill=BOTH)
Button(tab1, text='Fazer Devolução', foreground="#FFFFFF",background='#0D214F',font=('Arial', 15), command=fazer_devolucao).pack(padx=8, pady=8, fill=BOTH)
Button(tab1, text='Mostrar quantidades', font=('Arial', 15), command=mostrarQuantidades).pack(padx=8, pady=8, fill=BOTH, )
Button(tab1, text='Mostrar dados planilha', font=('Arial', 15), command=print_dados_planilha).pack(padx=8, pady=8, fill=BOTH, )
Button(tab1, text='Sair',foreground="#FFFFFF",background='#8B0000', font=('Arial', 15, ), command=sair).pack(padx=8, pady=8, fill=BOTH, )

window.mainloop()