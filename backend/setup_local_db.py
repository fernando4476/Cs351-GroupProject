import os
import sys
import subprocess
import platform

# Configuration
DB_NAME = os.environ.get("DB_NAME", "localdb")
DB_USER = os.environ.get("DB_USER", "postgres")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "")
FIXTURE_FILE = "seed_data.json"  # make sure path is correct relative to backend/

def run_command(command, env=None):
    print(f"Running: {command}")
    result = subprocess.run(command, shell=True, env=env)
    if result.returncode != 0:
        print(f"Command failed: {command}")
        sys.exit(1)

def drop_database():
    system = platform.system()
    if system == "Windows":
        run_command(f'psql -U {DB_USER} -c "DROP DATABASE IF EXISTS {DB_NAME};"')
    else:
        run_command(f'dropdb -U {DB_USER} --if-exists {DB_NAME}')

def create_database():
    system = platform.system()
    if system == "Windows":
        run_command(f'psql -U {DB_USER} -c "CREATE DATABASE {DB_NAME};"')
    else:
        run_command(f'createdb -U {DB_USER} {DB_NAME}')

def apply_migrations():
    run_command("python manage.py migrate")

def load_fixtures():
    run_command(f"python manage.py loaddata {FIXTURE_FILE}")

def main():
    print("Setting up local PostgreSQL database...")

    # Drop old DB
    drop_database()

    # Create fresh DB
    create_database()
    
    # Apply migrations
    apply_migrations()
    
    # Load fixtures
    load_fixtures()

    print("✅ Local database setup complete!")

if __name__ == "__main__":
    main()
