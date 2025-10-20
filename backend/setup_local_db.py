import os
import sys
import subprocess
import platform

# Configuration
DB_NAME = "localdb"
DB_USER = "postgres"
DB_PASSWORD = "postgres"  # update if you use a different password
FIXTURE_FILE = "seed_data.json"  # make sure path is correct relative to backend/

def run_command(command, env=None):
    print(f"Running: {command}")
    result = subprocess.run(command, shell=True, env=env)
    if result.returncode != 0:
        print(f"Command failed: {command}")
        sys.exit(1)

def create_database():
    system = platform.system()
    if system == "Windows":
        # Windows
        create_db_cmd = f'psql -U {DB_USER} -c "CREATE DATABASE {DB_NAME};"'
        run_command(create_db_cmd)
    else:
        # macOS / Linux
        run_command(f'createdb -U {DB_USER} {DB_NAME}')

def apply_migrations():
    run_command(f'python manage.py migrate')

def load_fixtures():
    run_command(f'python manage.py loaddata {FIXTURE_FILE}')

def main():
    print("Setting up local PostgreSQL database...")
    
    # Check if DB exists
    try:
        run_command(f'psql -U {DB_USER} -d {DB_NAME} -c "\q"')
        print(f"Database {DB_NAME} already exists.")
    except:
        create_database()
    
    apply_migrations()
    load_fixtures()
    print("✅ Local database setup complete!")

if __name__ == "__main__":
    main()