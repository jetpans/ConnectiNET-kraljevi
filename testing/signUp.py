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
    driver.maximize_window()
    driver.get("http://localhost:3000")

    time.sleep(2)
    driver.implicitly_wait(10)
    register_link = driver.find_element("xpath", "//a[@href='/register']")
    register_link.click()

    time.sleep(2)
    driver.implicitly_wait(10)
    first_name_element = driver.find_element("xpath", "//input[@name='firstName']")
    last_name_element = driver.find_element("xpath", "//input[@name='lastName']")
    username_element = driver.find_element("xpath", "//input[@name='username']")
    email_adress_element = driver.find_element("xpath", "//input[@name='email']")
    password_element = driver.find_element("xpath", "//input[@name='password']")
    country_selector_element = driver.find_element("xpath", "//div[@id='country']")

    first_name_element.clear()
    last_name_element.clear()
    username_element.clear()
    email_adress_element.clear()
    password_element.clear()

    first_name_element.send_keys("John")
    last_name_element.send_keys("Doe")
    username_element.send_keys("johndoe"*10)
    email_adress_element.send_keys("john.doe@gmail.com")
    password_element.send_keys("password123")

    country_selector_element.click()
    driver.implicitly_wait(10)
    country_element = driver.find_element("xpath", "//li[@data-value='HRV']")
    wait.until(lambda d : country_element.is_displayed())
    actions.move_to_element(country_element).perform()
    country_element.click()

    time.sleep(2)
    sign_up_button = driver.find_element("xpath", "//button[@type='submit']")
    sign_up_button.click()


    time.sleep(2)
    username_element.clear()
    username_element.send_keys("johndoe")

    time.sleep(2)
    sign_up_button = driver.find_element("xpath", "//button[@type='submit']")
    sign_up_button.click()

    driver.implicitly_wait(10)
    sign_in_text = driver.find_element("xpath", "//h1[text()='Sign in']")
    
    # Check if signup was successful
    assert "login" in driver.current_url

    login(driver)
    driver.implicitly_wait(10)
    events_text = driver.find_element("xpath", "//*[@id='root']/div[1]/div[1]/header/div/h5[text()='Events']")
    assert "events" in driver.current_url
    time.sleep(2)

    print("Sign Up successful!")
except Exception as e:
    print("Sign Up failed.")
finally:
    # Close the browser window
    driver.quit()