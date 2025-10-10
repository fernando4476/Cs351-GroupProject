# Logistics  

**Q1:** At what time in the week would your group be available to meet online?  

*Meeting weekly Thursday at 6:45

---

# Timeline: Weekly Meeting Goals  

**Q2:** What is your goals that your group want to achieve in each weekly meeting?  
**Example:**  
*Week of 9/30 - pick our project track and topic, and complete Milestone 2
Week of 10/09 - split up responsibility of the group, and research our tech stack
Week of 11/27 - make sure project is fully functional 
12/01 - complete and submit project *  

---

# Communication  

**Q3a:** How can your group communicate when doing the Full Stack Group Project?  
**Q3b:** What are the usernames of each group member on that platform?  
**Q3c:** What is your group’s expected response time to messages?  

**Example:**  
*We will use Discord for communication*  

*Usernames:*  
*Maria - mclem6*  
*Ahmad - ahmad9125 *  
*Fernando - fernando4476* 
*Kassandra - ka55andr4* 
*Our expected response time will be within 12 hours.*  

---

# Norms  

**Q4a:** How will your group handle situations when there is conflict in your group?  
- If its about making a decision, then voting. 
- Do meeting without missing member, communicate to them their part. Also, record meetings.
- Give clear tasks and objectives, if person is struggling they need to reach out sooner than later.

**Q4b:** How will your group handle situations when a member is not contributing enough?  
- Group mediation then give them resources they need. If not they continue not to contribute enough, have meeting with professor. 


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

    we will use django + react

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

**Problem 3:**  Lack of interactive tools in classrooms

**Solution 3:**  Build an interactive, real-time map builder for classroom use

# Track 3: Creative Coding and Cultural Expression

**Idea - Story - Inspiration 4:**  Kassandra was inspired by seeing how Chicago is a true melting pot of diverse ethnic backgrounds. She noticed that many people tend to flock to larger fast-food chains, and she felt it was important to shine a light on family-owned restaurants instead.

**Implementation 4:**

    we will be making a website using html,react,django, API(google maps), database(sql)

**Idea - Story - Inspiration 5:**

**Implementation 5:**


# Idea Finalization

**From 5 project ideas you have above, please choose one of the project that you are going with for the rest of the semester. Explain why you are going with that project**
We are going with Kassandra's idea of finding ethnic restaurants to create a more diverse experience. This'll help people not settle on fast food chains and actually give the spotlight to family owned and culturally diverse restaurants, which will in return help them gain visibility and preserving chicago's food identity.


# Extra Credit (Only do this if you are done with Idea Finalization)

## Database Design

**Q1: What database are you using for your project (SQLite, PostgreSQL, noSQL, MongoDB,...), and why do you choose it?**
We will be using PostgreSQL because it's reliable, scalable and integrates well with django/flask. it also supports advanced queries which will be useful for filtering restaurants by cuisine,rating and the neighborhood.
**Q2: How will database be helpful to your project? How will you design your database to support your application features?**
The database will store restaurant information such as the address,name and cuisine. It'll also hold the user reviews and ratings.We can also use api's such from yelp and google reviews.
## Third-Party API Integration

**Q3: Which third-party API(s) will you integrate into your project? What data will you pull from the API(s), and how will you use it in your application?**
We'll incorporate google maps api and Yelp api. The google map api will show the restaurants on an interactive map and the yelp api will get business hours, contact info and extra reviews that google might not have.
**Q4: Does your API key has limitations such as rate limits or downtime? How are you going to deal with that?**
They do have limitations for example google map api has daily request limits but to deal with this we'll cache api results in our database so we dont get repeated calls. We'll also use environment variables to store the api key securely.
## Authentication and Security

**Q5: What authentication method will you use (e.g., username/password, OAuth, JWT)?**
We will be using username/password authetication using djangos built in auth or even using the flask login.
**Q6: How will you store and protect sensitive user data (e.g., passwords, tokens)?**
Passwords will be hashed and salted using django's built in hasher. we'll also store api keys and tokens in a .env file. Database connections will use environment variables for credentials
## Deployment

**Q7: Where will you deploy your project (e.g., Heroku, AWS, Render)? How will you manage environment variables and secrets during deployment?**
We will deploy our project on Heroku. environment variables will be configured directly in the Heroku dashboard.
**Q8: How will you ensure your deployment is reliable and easy to update?**
We will use Github integration with Heroku so that pushing to main automatically updated the deployment. We will run tests locally before pushing. Lastly we will use version control branching to ensure updates don't break the main app
