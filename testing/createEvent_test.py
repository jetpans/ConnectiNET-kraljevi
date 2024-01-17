from selenium import webdriver
import time
from util import login

driver = webdriver.Chrome()


try:
    driver.maximize_window()
    driver.get("http://localhost:3000")

    login(driver, "orgorg", "MScWrAKvFFw6KQe")

    driver.implicitly_wait(20)
    locate = driver.find_element("xpath", "//*[@id='root']/div[1]/div[1]/header/div/button")
    locate.click()

    driver.implicitly_wait(20)
    create = driver.find_element("xpath", "/html/body/div[2]/div[3]/div/ul/li[3]/div/div[2]/span")
    create.click()

    driver.implicitly_wait(20)
    name = driver.find_element("xpath", "//*[@name='eventName']")
    desc = driver.find_element("xpath", "//*[@id=':r7:']")
    city = driver.find_element("xpath", "//*[@name='city']")
    address = driver.find_element("xpath", "//*[@name='location']")

    name.send_keys("Programiranje")
    desc.send_keys("Kolektivno ucenje")
    city.send_keys("Amsterdam")
    address.send_keys("Ulica 4")

    country = driver.find_element("xpath", "//*[@id='mui-component-select-country']")
    country.click()
    country_ = driver.find_element("xpath", "//*[@id=':rd:']/li[6]")
    country_.click()

    type = driver.find_element("xpath", "//*[@id='mui-component-select-eventType']")
    type.click()
    type_ = driver.find_element("xpath", "//*[@id=':rf:']/li[3]")
    type_.click()

    fromD = driver.find_element("xpath", "//*[@id=':rh:']")
    fromD.send_keys("120320240000")

    toDate = driver.find_element("xpath", "//*[@id=':rj:']")
    toDate.send_keys("120420240000")

    price = driver.find_element("xpath", "//*[@name='priceOptions' and @value='paid']")
    price.click()

    fee = driver.find_element("xpath", "//*[@id=':rn:']")
    fee.clear()
    fee.send_keys("5")

    butt = driver.find_element("xpath", "//*[@id='root']/div/div[2]/div/div/div/form/div[10]/button")
    butt.click()

    driver.implicitly_wait(20)
    cancel = driver.find_element("xpath", "//*[@id='root']/div[2]/div/div[2]/button[2]")
    cancel.click()
    
    print("Create event successful!")
except Exception as e:
    print("Create event failed.\n")
finally:
    # Close the browser window
    driver.quit()