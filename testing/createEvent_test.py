from selenium import webdriver
import time
from util import login

driver = webdriver.Chrome()


try:
    driver.maximize_window()
    driver.get("https://progi-fe-xo22.onrender.com/login")

    login(driver, "orgorg", "MScWrAKvFFw6KQe")

    driver.implicitly_wait(20)
    locate = driver.find_element("xpath", "//*[@id='root']/div[1]/div[1]/header/div/button")
    locate.click()
    
    driver.implicitly_wait(20)
    create = driver.find_element("xpath", "/html/body/div[2]/div[3]/div/ul/li[3]/div/div[2]/span")
    create.click()

    driver.implicitly_wait(20)
    name = driver.find_element("xpath", "//*[@name='eventName']")
    desc = driver.find_element("xpath", "//*[@id=':r3:']")

    city = driver.find_element("xpath", "//*[@name='city']")

    address = driver.find_element("xpath", "//*[@name='location']")
    name.send_keys("Programiranje")
    desc.send_keys("Kolektivno ucenje")
    city.send_keys("Amsterdam")
    address.send_keys("Ulica 4")

    country = driver.find_element("xpath", "//*[@id='mui-component-select-country']")
    time.sleep(1)

    country.click()
    country_ = driver.find_element("xpath", "//*[contains(text(), 'Croatia')]")
    time.sleep(1)

    country_.click()

    type = driver.find_element("xpath", "//*[@id='mui-component-select-eventType']")
    time.sleep(1)
    type.click()
    type_ = driver.find_element("xpath", "//*[contains(text(), 'Technology')]")
    time.sleep(1)
    type_.click()
    
    fromD = driver.find_element("xpath", "//*[@id=':r8:']")
    fromD.send_keys("12032024000012")

    toDate = driver.find_element("xpath", "//*[@id=':r9:']")
    toDate.send_keys("12042024000012")

    butt = driver.find_element("xpath", "//*[contains(text(), 'Create Event')]")
    time.sleep(1)
    butt.click()

    driver.implicitly_wait(20)
    cancel = driver.find_element("xpath", "//*[contains(text(), 'Cancel')]")
    time.sleep(1)
    cancel.click()
    
    print("Create event successful!")
except Exception as e:
    print("Create event failed.\n")
    print(e)
finally:
    # Close the browser window
    driver.quit()