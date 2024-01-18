from selenium import webdriver
import time
from util import login

driver = webdriver.Chrome()

try:
    driver.maximize_window()
    driver.get("https://progi-fe-xo22.onrender.com/login")

    login(driver, "serbiangamesbl", "password123")

    driver.implicitly_wait(10)
    butt = driver.find_element("xpath", "//*[@id='root']/div[1]/div[2]/div[3]/div[1]/div/div[3]/div[1]/button")
    butt.click()

    driver.implicitly_wait(10)
    interest = driver.find_element("xpath", "//*[@id='root']/div[3]/div/div/div/div[2]/div/div[2]/div[2]/button[1]")
    interest.click()

    print("Leave interest successful!")
except Exception as e:
    print("Leave interest failed.\n")
finally:
    # Close the browser window
    driver.quit()