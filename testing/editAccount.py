import selenium

from selenium import webdriver

from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.wait import WebDriverWait
import time

driver = webdriver.Chrome()
actions = ActionChains(driver)
wait = WebDriverWait(driver, timeout=40)

from util import login

#--------------------------------------------------------------

try:
    driver.get("https://progi-fe-xo22.onrender.com/login")
    driver.maximize_window()

    login(driver)
    driver.implicitly_wait(10)
    events_text = driver.find_element("xpath", "//*[@id='root']/div[1]/div[1]/header/div/h5[text()='Events']")
    assert "events" in driver.current_url
    time.sleep(2)

    driver.implicitly_wait(10)
    menu_button = driver.find_element("xpath", "/html/body/div/div[1]/div[1]/header/div/button")
    menu_button.click()

    account_button = driver.find_element("xpath", "//div[@value='Account']")
    time.sleep(1)
    account_button.click()

    driver.implicitly_wait(10)
    last_name_loaded = driver.find_element("xpath", "//*[@id='edit-form']/tbody/tr[7]/td[2][text()!='']")

    driver.implicitly_wait(10)
    edit_button = driver.find_element("xpath", "//*[@id='edit-form']/tbody/tr[1]/td[1]/button")
    time.sleep(1)
    edit_button.click()

    
    driver.implicitly_wait(10)
    email_adress_element = driver.find_element("xpath", "//input[@name='email']")
    password_element = driver.find_element("xpath", "//input[@name='password']")
    email_adress_element.clear()
    password_element.clear()
    time.sleep(1)
    email_adress_element.send_keys("john.doe.new.email@gmail.com")
    password_element.send_keys("password123")

    driver.implicitly_wait(10)
    save_changes_button = driver.find_element("xpath", "//button[text()='Save changes']")
    time.sleep(1)
    save_changes_button.click()

    driver.implicitly_wait(10)
    confirm_button = driver.find_element("xpath", "//button[text()='Yes']")
    time.sleep(1)
    confirm_button.click()

    driver.implicitly_wait(10)
    new_mail = driver.find_element("xpath", "//*[@id='edit-form']/tbody/tr[4]/td[2][text()!='']")
    assert "john.doe.new.email@gmail.com" == new_mail.text

    assert "account" in driver.current_url #not final
    print("Editing Account successful!")
except Exception as e:
    print("Sign Up failed.")
finally:
    # Close the browser window
    driver.quit()