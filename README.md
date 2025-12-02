App: UBOOK  - service marketplace for UIC students
By: Kassandra Acosta, Fernanado Dominguez, Ahamad Suleiman, Maria Clement 

About:
A React/Django app built for Fall 2025 CS351 Adv. Data Structure & Algorithm Course group project. 
Inspired by the desire to connect the UIC student community by encouraging students to exchange services within a trusted environment
while earning money, honing their craft, and building practical business management skills.



How to run: After cloning the repository, do the following steps

____________________________________________________________________________________________________________________________

1.  Create a virtual environment
____________________________________________________________________________________________________________________________
      Objective:  
      This installs Django, DRF, psycopg2-binary, and any other dependencies.
      Everyone will get the same versions, ensuring a consistent development environment.

      Check your python version: Make sure you are running Python 3.11 or older, newer releases have issues with installing psycopg2-binary 

      Create a virtual environment in the project root (.../Cs351-GroupProject)
      ‘’’
       # macOS/Linux
      python3.11 -m venv venv
      source venv/bin/activate
      
      # Windows
      py -3.11 -m venv venv
      .\venv\Scripts\activate
      
      ‘’’
      
      Install dependencies from your requirements.txt:
      ‘’’
      pip install --upgrade pip setuptools wheel
      pip install -r requirements.txt
      
      ‘’’

      Need to activate the virtual environment (source venv/bin/activate), possibly every time you reopen the project.
      
      If plans to modify on git, don’t commit your venv/ folder to Git — add it to .gitignore.
       
____________________________________________________________________________________________________________________________

2. Set up environment variables
____________________________________________________________________________________________________________________________


    In your backend folder (.../Cs351-GroupProject/backend), create a file named .env:
    Paste the following code 
    ‘’’
    # Secret key for Django signing (shared for development)
    SECRET_KEY=7+1!p$wz&9u=2*3o!b0q#4r5@l!v6x^z9%y&8k
    
    # Debug mode
    DEBUG=True
    
    # Local Postgres (for running locally), feel free to change variable values
    DB_NAME=localdb 
    DB_USER=postgres
    DB_PASSWORD=group14
    DB_HOST=localhost
    DB_PORT=5432


____________________________________________________________________________________________________________________________

3. Run backend server, run web server
____________________________________________________________________________________________________________________________


     backend server
       cd to backend folder
       then run 'python manage.py runserver'

     web server
       cd to frontend folder
       then run 'npm run dev'


How to use:

  Must have a UIC email to sign up 
      You will get an email to your UIC account to verify your account. Without verification, you will not be able to sign in or book services
    
  Everyone starts with a customer profile and then gains authorization to create a provider profile
      Upon verification, you will have a customer profile in which you are now authorized to book services and leave reviews
      You will gain access to your profile where you can upload a profile photo, view and update account details, view/edit/cancel your appointments, 
      view and modify reviews you have left, contact app owners for technical help.

  Become a Provider
      On the customer profile, click the 'Provider Profile' to create (once created, use the same button to switch to your provider profile). Fill out form
      and add a service to get started. Once created, in your provider profile you can view appointments booked with you, add and delete service(s), and upload 
      a profile photo.
      
  Providers create service(s)
      In the provider profile, you can add services that will appear on the homepage and be available for all users to search and book.
    
  Browse available services
      Use the homepage search bar to find services currently available. As you type, the search bar will help with autocompletion, showing you 
      all services that contain your typed word (both in title and description). Click on a recommended service button and this will customize 
      your homepage to show those types of services first (can we say personalization!)
      
  Book appointments
      Click on a service, and you will be taken to the service page where you can pick a time and create an appointment with the provider
      
  Leave reviews
      Users can leave reviews with rating on service page. The rating will be used to update the provider's average rating
      across all their services. This will help other students find great services and avoid bad ones. 


Demo Video
![Demo Video](https://github.com/user-attachments/assets/9e943de1-306a-4f06-827d-1c11142f4fbc)
      



