from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait #para trabalhar com elementos que talvez ainda nao existam no DOM
from selenium.webdriver.support import expected_conditions as EC #esperar pela presença de um elemento
import time
from app2_openpyxl import Produtos


class Navegador():
    
    def __init__(self):
        self.linha = 0
        
    def contador(self):
        self.linha = self.linha + 1
        
    def descontador(self):
        self.linha = self.linha - 1
        if self.linha < 0:
            self.linha = 0
        
    def alter_contador(self, num: int):
        self.linha = num
        if self.linha < 0:
            self.linha = 0
    
    def get_contador(self):
        return int(self.linha)
        
    def dados_planilha(self, obj: Produtos):
        dados = [obj.array_cod_prod, obj.array_lote, obj.array_nome_prod, obj.array_quant_result, obj.tamanho_devolucao]
        return dados
        
    def carregar_navegador(self):
        self.driver = webdriver.Chrome()
        # pagina0 = "https://amberlive.000webhostapp.com/parte_endereco_picking.html"
        pagina1 = 'http://10.250.1.8:8090'
        self.driver.get(pagina1)
        elem = self.driver.find_element(By.ID, "Login")
        elem.send_keys("0028")
        elem = self.driver.find_element(By.ID, "Password")
        elem.send_keys("Claudiane.1")
        elem.send_keys(Keys.RETURN)
        time.sleep(7)
        pagina2 = "http://10.250.1.8:8090/Core/StockMovement/ProductTransfer"
        self.driver.get(pagina2)
    
    def inserir_codigo(self, array_cod_prod):
        try:
            # Localizo o campo input de produtos ✓
            prod = self.driver.find_element(By.XPATH, "//input[@id='Product_Name']")
            # Clico nesse input ✓
            prod.click()
            # Limpo esse input, para evitar qualquer coisa ✓
            prod.clear()
            # Digito o codigo do produto ✓
            prod.send_keys(array_cod_prod[self.linha])
        except Exception as e:
            print('Não foi possível inserir o código do produto', e)
        
    
    def fazer_devolucao(self, array_cod_prod: list,array_lote: list, array_quant_result: list):
        try:
            # Localizo o RadioButton de Devolucao ✓
            bot_dev = self.driver.find_element(By.ID, "OriginalAddress_Devolution")
            # Clico nesse botão ✓
            bot_dev.click()
            # E espero um pouco ✓
            time.sleep(0.2)
        except Exception as e:
            print("Não foi possível clicar na opção devolução -> ",e)
            print("Contador: ", int(self.get_contador()+2))
        else:
        #---------------------------------------------------------------------------------------------------------
            try:
                # Xpath dos botões Dropdowns
                xpath_dropdowns = '//button[@class="pui-button ui-widget ui-state-default ui-corner-right pui-button-icon-only"]'
                # Pego a lista dos botões dropdown
                list_bot_drop = self.driver.find_elements(By.XPATH, xpath_dropdowns)
                # Clico no 2º botão dropdown (botão do endereço de origem da devolução) ✓
                list_bot_drop[1].click()
            except Exception as e:
                print('Não foi possível clicar no botão dropdown do endereço da devolução -> ', e)
                print("Contador: ", int(self.get_contador()+2))
            else:
                #---------------------------------------------------------------------------------------------------------
                try:
                    # Xpath da DIV que contem o lote do produto a ser devolvido
                    xpath_div_lote = '//div[@style="padding-left: 10px;margin-top: -10px;" and contains(., "Lote: {}")]'.format(array_lote[self.linha])
                    # WebDriver Wait para esperar aparecer a DIV do produto a ser devolvido
                    WebDriverWait(self.driver, 15).until(
                        EC.presence_of_element_located((By.XPATH, xpath_div_lote))
                    )
                except Exception as e:
                    print("Não foi possível encontrar DIV com lote: {} -> ".format(array_lote[self.linha]), e)
                    print("Contador: ", int(self.get_contador()+2))
                #---------------------------------------------------------------------------------------------------------
                else:
                    try:
                        # Apareceu? Então localizo essa DIV
                        div_prod = self.driver.find_element(By.XPATH, xpath_div_lote)
                        # Clico nessa DIV
                        div_prod.click()
                        # e espero um pouco
                        time.sleep(0.2)
                    except Exception as e:
                        print("Não foi possível clicar na div com o seguinte XPATH: {} -> ".format(xpath_div_lote),e)
                        print("Contador: ", int(self.get_contador()+2))
                    #---------------------------------------------------------------------------------------------------------
                    else:
                        try:
                            # Localizo o input de quantidades ✓
                            id_quant = self.driver.find_element(By.ID, "Ammount")
                            # Clico nesse input ✓
                            id_quant.click()
                            #Limpo o input ✓
                            id_quant.clear()
                            # Espero um pouco ✓
                            time.sleep(0.2)
                            # Digito a quantidade certa ✓
                            id_quant.send_keys(array_quant_result[self.linha])
                        except Exception as e:
                            print("Não foi possível inserir a quantidade {} no produto {} de lote {} -> ".format(array_quant_result[self.linha],array_cod_prod[self.linha], array_lote[self.linha]), e)
                            print("Contador: ", int(self.get_contador()+2))
                        #---------------------------------------------------------------------------------------------------------
                        else:
                            try:
                                time.sleep(0.2)
                                #Clico no terceiro botão dropdown
                                list_bot_drop[2].click()
                                # Xpath da DIV que contem o endereço da posicão a ser devolvida
                                xpath_div_endereco_op = "//li[@class='pui-autocomplete-item pui-autocomplete-list-item ui-corner-all ui-state-highlight' and contains(text(),*) and contains(text(),'.') and contains(text(),*) and contains(text(),'.') and contains(text(),*) and contains(text(),'.01.') and contains(text(),*)]"
                                # WebDriver Wait para esperar aparecer a DIV da posicão a ser devolvida
                                WebDriverWait(self.driver, 15).until(
                                    EC.presence_of_element_located((By.XPATH, xpath_div_endereco_op))
                                )
                            except Exception as e:
                                print("Não foi possível localizar a DIV da posicão a ser devolvida -> ",e)
                                print("Contador: ", int(self.get_contador()+2))
                            else:
                                try:
                                    # Apareceu? Então localizo essa DIV
                                    div_pos_op = self.driver.find_element(By.XPATH, xpath_div_endereco_op)
                                    # e espero um pouco
                                    time.sleep(0.2)
                                    # Clico nessa DIV
                                    div_pos_op.click()
                                except Exception as e:
                                    print("Nao foi possível clicar na DIV na posição da devolução -> ",e)
                                    print("Contador: ", int(self.get_contador()+2))
                                else:
                                    try:
                                        #localiza o botão verde
                                        bot_verde = self.driver.find_element(By.ID, "MovingProduct_Submit")
                                        #clica no botão verde
                                        bot_verde.click()
                                    except Exception as e:
                                        print("Não foi possível clicar no botão verde -> ",e)
                                        print("Contador: ", int(self.get_contador()+2))
                                    else:
                                        # Adiciono +1 á linha ✓
                                        self.contador()
                                        # printa o contador
                                        print("Contador: ", int(self.get_contador()+2))
                                    finally:
                                        print("Contador: ", int(self.get_contador()+2))