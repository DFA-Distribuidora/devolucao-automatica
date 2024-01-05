from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait #para trabalhar com elementos que talvez ainda nao existam no DOM
from selenium.webdriver.support import expected_conditions as EC #esperar pela presença de um elemento
import time

driver = webdriver.Firefox()
driver.get("http://10.250.1.8:8090")
elem = driver.find_element(By.ID, "Login")
elem.send_keys("0028")
elem = driver.find_element(By.ID, "Password")
elem.send_keys("Claudiane.1")
elem.send_keys(Keys.RETURN)
time.sleep(7)
driver.get("http://10.250.1.8:8090/Core/StockMovement/ProductTransfer")
