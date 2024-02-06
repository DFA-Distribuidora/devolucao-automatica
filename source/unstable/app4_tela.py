from tkinter.ttk import Treeview
from tkinter import messagebox
from tkinter import *
from app2_openpyxl import Produtos
from app3_selenium import Navegador


prod = Produtos()
nav = Navegador()


def abrir_planilha():
    prod.set_tudo()

def carregar_navegador():
    nav.carregar_navegador()


def inserir_codigo():
    nav.inserir_codigo(prod.array_cod_prod)
    atualizar_contador()

def fazer_devolucao():
    nav.fazer_devolucao(prod.array_cod_prod,prod.array_lote, prod.array_quant_result)
    atualizar_contador()

def mostrar_dados_planilha():
    dados, tamanho = nav.dados_planilha(prod)
    vazio = all(not subarray for subarray in dados)
    if vazio:
        messagebox.showinfo(title='Atenção!',message='Planilha não selecionada')
    else:
        # Criando uma janela tipo TopLevel para mostrar os itens de devolução
        tp_itens_devolucao = Toplevel()
        tp_itens_devolucao.title("Itens da Devolução")
        tp_itens_devolucao.geometry("1000x450")
        
        frame_botoes = Frame(tp_itens_devolucao)
        frame_botoes.place(x=10, y=10)
        
        frame_tv = Frame(tp_itens_devolucao)
        frame_tv.place(x=300, y=10)
        
        # Criando um widget do tipo treeview para mostrar essas devolucoes no toplevel
        treeview = Treeview(frame_tv ,columns=("linha", "codigo_produto", "lote", 'quantidade', 'nome_produto'), show="headings")
        treeview.pack()
        # Adicionando os cabecalhos do treeview
        treeview.heading("linha", text="Linha", anchor='w')
        treeview.heading("codigo_produto", text="Cod. Produto", anchor='w')
        treeview.heading("lote", text="Lote", anchor='w')
        treeview.heading("quantidade", text="Quantidade", anchor='w')
        treeview.heading("nome_produto", text="Nome do Produto", anchor='w')
        
        #editando as colunas do treeview
        treeview.column("linha", minwidth=0, width=50, anchor='w')
        treeview.column("codigo_produto", minwidth=0, width=80, anchor='w')
        treeview.column("lote", minwidth=0, width=90, anchor='w')
        treeview.column("quantidade", minwidth=0, width=80, anchor='c')
        treeview.column("nome_produto", minwidth=0, width=300, anchor='w')
        
        #Print os dados no TreeView
        for i in range(0, tamanho):
            cor_fundo = "white" if len(treeview.get_children()) % 2 == 0 else "lightgrey"
            treeview.insert("", "end", values=(i+1, dados[0][i], dados[1][i], dados[2][i], dados[3][i]), tags=cor_fundo)
            treeview.tag_configure("lightgrey", background=cor_fundo)
            # print(cor_fundo)
            # cor_fundo = "white" if len(tree.get_children()) % 2 == 0 else "lightgrey"
        Button(frame_botoes, text='Abrir Planilha de Devolução', foreground="#FFFFFF", background='#006633', font=('Arial', 15), command=abrir_planilha).pack(padx=8, pady=8, anchor='e',fill='both')
        Button(frame_botoes, text='Carregar Navegador', foreground="#FFFFFF", background='#A57A0F', font=('Arial', 15), command=carregar_navegador).pack(padx=8, pady=8, anchor='e',fill='both')
        Button(frame_botoes, text='Inserir Código', foreground="#FFFFFF", background='#0D214F', font=('Arial', 15), command=inserir_codigo).pack(padx=8, pady=8, anchor='e',fill='both')
        Button(frame_botoes, text='Fazer Devolução', foreground="#FFFFFF", background='#0D214F', font=('Arial', 15), command=fazer_devolucao).pack(padx=8, pady=8, anchor='e',fill='both')
        Button(frame_botoes, text='Mostrar quantidades', font=('Arial', 15), command=mostrarQuantidades).pack(padx=8, pady=8, anchor='e',fill='both')
        Button(frame_botoes, text='Mostrar dados planilha', font=('Arial', 15), command=mostrar_dados_planilha).pack(padx=8, pady=8, anchor='e',fill='both')
        Button(frame_botoes, text='Sair', foreground="#FFFFFF", background='#8B0000', font=('Arial', 15, ), command=sair).pack(padx=8, pady=8, anchor='e',fill='both')

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

# Criacao do botao voltar linha
botao = Button(window, text="Voltar linha", command=voltar_linha)
botao.pack(side=TOP, padx=5)

# Criacao do botao pular linha
botao = Button(window, text="Pular linha", command=pular_linha)
botao.pack(side=TOP, padx=5)

# Criacao da label que mostra o contador/linha
label_info = Label(window, font=('Arial', 10), text="Linha: " + str(int(nav.get_contador() + 2)))
label_info.pack(side=TOP, padx=5)

# Criacao da entry box para alterar a linha (alterar para a linha desejada)
campo_texto = Entry(window)
campo_texto.pack()

# Criacao do botao 'Alterar linha'
botao_alterar = Button(window, text="Alterar linha", command=alterar_linha)
botao_alterar.pack(side=TOP, padx=5)

# Definicao dos botoes da tela inicial
Button(window, text='Abrir Planilha de Devolução', foreground="#FFFFFF", background='#006633', font=('Arial', 15), command=abrir_planilha).pack(padx=8, pady=8, fill=BOTH, )
Button(window, text='Carregar Navegador', foreground="#FFFFFF", background='#A57A0F', font=('Arial', 15), command=carregar_navegador).pack(padx=8, pady=8, fill=BOTH)
Button(window, text='Inserir Código', foreground="#FFFFFF", background='#0D214F', font=('Arial', 15), command=inserir_codigo).pack(padx=8, pady=8, fill=BOTH)
Button(window, text='Fazer Devolução', foreground="#FFFFFF", background='#0D214F', font=('Arial', 15), command=fazer_devolucao).pack(padx=8, pady=8, fill=BOTH)
Button(window, text='Mostrar dados planilha', font=('Arial', 15), command=mostrar_dados_planilha).pack(padx=8, pady=8, fill=BOTH, )
Button(window, text='Sair', foreground="#FFFFFF", background='#8B0000', font=('Arial', 15, ), command=sair).pack(padx=8, pady=8, fill=BOTH, )

window.mainloop()
