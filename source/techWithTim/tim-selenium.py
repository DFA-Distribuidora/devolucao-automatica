from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait #para trabalhar com elementos que talvez ainda nao existam no DOM
from selenium.webdriver.support import expected_conditions as EC #esperar pela presença de um elemento
import time

# service = Service(executable_path="./chromedriver-win64/chromedriver.exe")
# driver = webdriver.Chrome(service=service)
driver = webdriver.Edge()



driver.get("https://google.com") #acessar um site



#Clicking Links and Navigating Pages

#Acessar um elementos que ainda nao existe
#usar o webdriver, esperar por 5 segundos até localizar um elemento pelo nome da classe

WebDriverWait(driver, 5).until( # espera por 5 seg até que uma condição seja verdadeira antes de 
                                # prosseguir para o próximo passo no código.
                                # until() -> é um método que indica que o WebDriverWait deve 
                                # continuar esperando até que a condição especificada seja atendida.
                                
    EC.presence_of_element_located((By.CLASS_NAME, "gLFyf")) #verifica se um elemento está 
                                                             #presente no DOM da página
)



#Locating and interacting with Elements
input_element = driver.find_element(By.CLASS_NAME, "gLFyf")
input_element.clear() #limpa textos de inputs se houver
input_element.send_keys("Tech with Tim" + Keys.ENTER) #enviar chaves para o elemento


#Localizar o primeiro elemento na página com base em um texto parcial do link
link = driver.find_element(By.PARTIAL_LINK_TEXT, "Tech With Tim") 

#Procura o primeiro elemento que tenha o texto exato fornecido como link.
link = driver.find_element(By.LINK_TEXT, "Tech With Tim") 

#Para encontrar todos os elementos, basta usar elements()
link = driver.find_elements(By.LINK_TEXT, "Tech With Tim") 
link = driver.find_elements(By.PARTIAL_LINK_TEXT, "Tech With Tim") 

#Acessar o atributo text do elemento e/ou valores
link = driver.find_element(By.LINK_TEXT, "Tech With Tim").text


link.click() #clica no elemento


time.sleep(3)


driver.quit() #fechar o drive