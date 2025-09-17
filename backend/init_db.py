# scripts/create_db.py (deprecated)

# This script is no longer needed. Use Flask-Migrate for database schema management:
#   flask db init
#   flask db migrate -m "<message>"
#   flask db upgrade

if __name__ == '__main__':
    print("Deprecated: Database schema is managed by Flask-Migrate. Run 'flask db upgrade'.")
