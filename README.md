# Logistics  

**Q1:** At what time in the week would your group be available to meet online?  

*Meeting weekly Thursday at 6:45

---

# Timeline: Weekly Meeting Goals  

**Q2:** What is your goals that your group want to achieve in each weekly meeting?  
1. Check off last weeks to-do list
2. Make decisions on problems encountered. 
3. Write to do list for upcoming week


# Communication  

**Q3a:** How can your group communicate when doing the Full Stack Group Project?  
We will use Discord for communication

**Q3b:** What are the usernames of each group member on that platform? 
Usernames:
Maria - mclem6
Ahmad - ahmad9125  
Fernando - fernando4476
Kassandra - ka55andr4

**Q3c:** What is your group’s expected response time to messages?  
Our expected response time will be within 12 hours.


---

# Norms  

**Q4a:** How will your group handle situations when there is conflict in your group?  
1. If its about making a decision, then voting. 
2. Do meeting without missing member, communicate to them their part. Also, record meetings.
3. Give clear tasks and objectives, if person is struggling they need to reach out sooner than later.

**Q4b:** How will your group handle situations when a member is not contributing enough?  
Group mediation then give them resources they need. If not they continue not to contribute enough, have meeting with professor. 


# Roles  

**Q5:** How will your group divide your role in the Group Project?  
Tentative: 
roles needed: project manager, frontend, backend
 Fernando - frontend (experience with react)
 Maria - backend
 Kassandra - frontend/backend
 ahmad - frontend/backend


# Tech Stacks

**Q6:** Which tech stacks will your group use? (Django + React or Flask + React)

We will use django + react

---
# Full Stack Group Project Track  
---

# Track 1: Tackling Generative AI Consequences
**Problem 1:**  (deepfake)

**Solution 1:** (analyze whether or how likely content is fake)

---

# Track 2: Technology for Public Goods 

**Problem 2:** Difficulty finding accessible playgrounds or locations.

**Solution 2:** Develop a tool similar to Google Maps that helps identify accessible locations, such as playgrounds

**Problem 3:**  Difficulty finding community at UIC / emphasis on sustainability 

**Solution 3:**  Build a UIC marketplace where students can sell/ exchnage goods and services

# Track 3: Creative Coding and Cultural Expression

**Idea - Story - Inspiration 4:**  Kassandra was inspired by seeing how Chicago is a true melting pot of diverse ethnic backgrounds. She noticed that many people tend to flock to larger fast-food chains, and she felt it was important to shine a light on family-owned restaurants instead.

**Implementation 4:**

    we will be making a website using html,react,django, API(google maps), database(sql)

**Idea - Story - Inspiration 5:**

**Implementation 5:**


# Idea Finalization

**From 5 project ideas you have above, please choose one of the project that you are going with for the rest of the semester. Explain why you are going with that project**
We are going with Maria's idea of building a UIC marketplace where students can provide services. We picked this project because it will promote community on UIC campus which a lot of students believe we lack being a commuter school


# Extra Credit (Only do this if you are done with Idea Finalization)

## Database Design

**Q1: What database are you using for your project (SQLite, PostgreSQL, noSQL, MongoDB,...), and why do you choose it?**
We will be using PostgreSQL because it is reliable, scalable, and integrates smoothly with Django or Flask. It supports advanced queries, which will be helpful for searching and filtering services by category, price range. PostgreSQL also handles relational data well, which is perfect for linking users, listings, and messages.

**Q2: How will database be helpful to your project? How will you design your database to support your application features?**
The database will store all key marketplace data — such as user accounts, services, categories, and messages between buyers and sellers.
Each service will include details like iname, description, price, seller ID
A users table will hold usernames, contact info, and authentication data.
We may add a messages table to allow direct communication between users.
## Third-Party API Integration

**Q3: Which third-party API(s) will you integrate into your project? What data will you pull from the API(s), and how will you use it in your application?**
Stripe API – We’ll use Stripe to handle secure payments between buyers and sellers. It will allow users to pay for items directly through the marketplace without sharing personal payment information.
**Q4: Does your API key has limitations such as rate limits or downtime? How are you going to deal with that?**
Stripe has usage limits and potential rate restrictions depending on the plan. we will Store all API keys securely in a .env file to prevent exposure
## Authentication and Security

**Q5: What authentication method will you use (e.g., username/password, OAuth, JWT)?**
We will use username and password authentication, taking advantage of Django’s built-in authentication system (or Flask-Login if we choose Flask). We may add UIC email verification to ensure only students can create accounts.
**Q6: How will you store and protect sensitive user data (e.g., passwords, tokens)?**
All passwords will be hashed and salted using Django’s built-in password hasher (or Flask’s Werkzeug hasher).
API keys and database credentials will be stored in a .env file, not in the code.
## Deployment

**Q7: Where will you deploy your project (e.g., Heroku, AWS, Render)? How will you manage environment variables and secrets during deployment?**
We plan to deploy on Heroku, which integrates well with GitHub and PostgreSQL. Environment variables (API keys, DB credentials, secret keys) will be added directly in the Heroku dashboard, so they never appear in our source code.
**Q8: How will you ensure your deployment is reliable and easy to update?**
We will use Github integration with Heroku so that pushing to main automatically updated the deployment. We will run tests locally before pushing. Lastly we will use version control branching to ensure updates don't break the main app
