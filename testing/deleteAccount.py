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
    driver.get("http://localhost:3000")
    driver.maximize_window()

    login(driver)
    driver.implicitly_wait(10)
    events_text = driver.find_element("xpath", "//*[@id='root']/div[1]/div[1]/header/div/h5[text()='Events']")
    assert "events" in driver.current_url
    time.sleep(2)

    driver.implicitly_wait(10)
    profile_button = driver.find_element("xpath", "//*[@id='profile-image']")
    profile_button.click()

    driver.implicitly_wait(10)
    account_button = driver.find_element("xpath", "//*[@id='profile-menu']/div[3]/ul/li[1]/p[text()='Account']")
    account_button.click()

    driver.implicitly_wait(10)
    delete_account_button = driver.find_element("xpath", "//*[@id='edit-form']/tbody/tr[1]/td[2]/button")
    time.sleep(1.5)
    delete_account_button.click()

    driver.implicitly_wait(10)
    confirm_button = driver.find_element("xpath", "//button[text()='Yes']")
    time.sleep(1.5)
    confirm_button.click()

    login(driver)
    driver.implicitly_wait(10)
    #login_failed_text = driver.find_element("xpath", ###)

    assert "login" in driver.current_url
    print("Deleting Account successful!")
except Exception as e:
    print("Sign Up failed.")
finally:
    # Close the browser window
    driver.quit()