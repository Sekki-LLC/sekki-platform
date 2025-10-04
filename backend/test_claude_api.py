import requests
import json

# Test the new conversational AI endpoint
try:
    # Start a conversation
    response = requests.post('http://localhost/api/market-iq/conversation/start', 
                           json={'description': 'I want to launch a food delivery app'},
                           headers={'Content-Type': 'application/json'} )
    
    print(f'Start Status: {response.status_code}')
    print(f'Start Response: {response.text}')
    
    if response.status_code == 200:
        data = response.json()
        session_id = data.get('session_id')
        print(f'\nSession ID: {session_id}')
        print(f'AI Message: {data.get("message")}')
        
        # Test continuing the conversation
        continue_response = requests.post('http://localhost/api/market-iq/conversation/continue',
                                        json={
                                            'session_id': session_id,
                                            'message': 'I want to target busy professionals in urban areas'
                                        },
                                        headers={'Content-Type': 'application/json'} )
        
        print(f'\nContinue Status: {continue_response.status_code}')
        print(f'Continue Response: {continue_response.text}')
        
except Exception as e:
    print(f'Error: {e}')
