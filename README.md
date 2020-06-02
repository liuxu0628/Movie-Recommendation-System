
# MRS - a movie recommender system

## Quick Start

```bash
# virtual env
virtualenv venv
source venv/bin/activate

# install backend dependency
pip install -r requirements.txt

# Install dependencies
cd front-end
npm install

# Run for devlopment
npm run start

# Build for production
npm run build

# Serve API on localhost:8000
python manage.py runserver

# Create .env file in root path and set two fields
MYSQL_USERNAME=''
MYSQL_PASSWORD=''

```
