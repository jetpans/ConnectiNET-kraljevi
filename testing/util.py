import time

#--------------------------------------------------------------

def login(driver, username="johndoe", password="password123"):

    driver.implicitly_wait(10)
    driver.find_element("xpath", "//h1[text()='Sign in']")

    time.sleep(2)
    driver.implicitly_wait(10)
    username_element = driver.find_element("xpath", "//input[@name='username']")
    password_element = driver.find_element("xpath", "//input[@name='password']")

    username_element.clear()
    password_element.clear()

    username_element.send_keys(username)
    password_element.send_keys(password)

    time.sleep(1)
    sign_in_button = driver.find_element("xpath", "//button[@type='submit']")
    sign_in_button.click()