import sys
sys.path.append('.')

from app import create_app
import json

app = create_app()

with app.test_client() as client:
    try:
        response = client.post('/api/market-iq/intake/start', 
                             json={'description': 'test project'},
                             headers={'Content-Type': 'application/json'})
        print(f'Status: {response.status_code}')
        print(f'Response: {response.get_data(as_text=True)}')
    except Exception as e:
        print(f'Error: {e}')
        import traceback
        traceback.print_exc()
