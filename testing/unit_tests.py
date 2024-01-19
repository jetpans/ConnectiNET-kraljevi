import requests
import unittest

class TestApp(unittest.TestCase):
  def setUp(self):
    self.base_url = 'http://127.0.0.1:5000'
    
  def test_login(self, username, password):
    response = requests.post(self.base_url + '/login', json={'username': username, 'password': password})
    self.assertEqual(response.status_code, 200, 'Status code is not 200')
    self.assertIn('access_token', response.json()['data'], 'Response does not contain access_token')
    print('Test Login Passed')
    return response.json()

  def test_get_events(self, token):
    response = requests.get(self.base_url + '/getEvents', headers={'Authorization': 'Bearer ' + token})
    self.assertEqual(response.status_code, 200, 'Status code is not 200')
    self.assertIsInstance(response.json()['data'], list, 'Response data is not a list')
    print('Test Get Events Passed')
    return response.json()
  
  def test_get_events_without_token(self):
    response = requests.get(self.base_url + '/getEvents')
    self.assertEqual(response.status_code, 401, 'Status code is not 401')
    self.assertIn('msg', response.json(), 'Response does not contain msg')
    print('Test Get Events Without jwt failed, as expected')
    return response.json()
  
  def test_create_event(self, token):
    response = requests.post(
      self.base_url + '/api/createEvent', 
      headers={'Authorization': 'Bearer ' + token}, 
      json={
        'title':'EventName',
        'description':'Description',
        'city':'City',
        'location':'Place',
        'countryCode':'CCK',
        'eventType':'Concert',
        'dateTime':'2024-01-26T12:00',
        'duration':'2024-01-29T12:00',
        'price':'1'
      })
    self.assertEqual(response.status_code, 200, 'Status code is not 200')
    self.assertIn('eventId', response.json()['data'], 'Response does not contain eventId')
    print('Test Edit Event Passed')
    return response.json()
  
  def test_edit_event(self, token, id):
    response = requests.put(
      self.base_url + '/api/editEvent/62', 
      headers={'Authorization': 'Bearer ' + token},
      json={
        'title':'NewEventName',
        'description':'New Description',
        'city':'New City',
        'location':'New Place',
        'countryCode':'HRV',
        'eventType':'Community',
        'dateTime':'2025-01-26T12:00',
        'duration':'2025-02-29T12:00',
        'price':'20'
      })
    self.assertEqual(response.status_code, 200, 'Status code is not 200')
    self.assertIn('success', response.json(), 'Response does not contain success')
    print('Test Edit Event Passed')
    return response.json()
  
  def test_delete_account(self, token):
    response = requests.delete(self.base_url + '/api/deleteAccount', headers={'Authorization': 'Bearer ' + token})
    self.assertEqual(response.status_code, 200, 'Status code is not 200')
    self.assertIn('success', response.json(), 'Response does not contain success')
    print('Test Delete Account Passed')
    return response.json()
  
  

# Instantiate the test class
test_app = TestApp()
test_app.setUp()

# Login
jwt = test_app.test_login('kraljevi', 'pass123kraljevi')['data']['access_token']

# Attempt to get events
test_app.test_get_events(jwt)
test_app.test_get_events_without_token()

# Create and edit an event
new_event_id = test_app.test_create_event(jwt)['data']['eventId']
test_app.test_edit_event(jwt, new_event_id)

# Delete a user
jwt = test_app.test_login('testuser', 'password123')['data']['access_token']
test_app.test_delete_account(jwt)
