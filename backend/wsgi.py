# wsgi.py

from flask_migrate import Migrate
from app import create_app, db

# Initialize Flask app and database migrations
app = create_app()
migrate = Migrate(app, db)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
# This file is the entry point for the WSGI server to run the Flask application.