Week of 10/09 - Our group decided to create a UIC MarketPlace web app where UIC students can provide services. On today's agenda we will finalize our tech stack and begin our Figma wireframe. We are using PostgreSQL or MySQL for our database, and intend to implement text prediction Trie for the data structure requirement

Notes: Discussed figma wireframe and UML diagram

Name: UIC Marketplace 
Description: 

API:
-payment
-database

Database:
-PostgreSQL or MySQL

Figma Wireframe
Pages needed:
Home page
Search
Recommendations
All services page/directory
Student service provider profile
services
schedule
reviews
provider account
Verification using uic email
information : name, number…etc
Payment accepted
Users account
Verification using uic email
information : name, number…etc
Booking page  and/or payment page(s)
Service provider name/idenitification 
Calendar // availability
location
Payment // price
Services chosen/chose from

UML Diagram: 
Provider
provider_id
schedule
List of services
Ratings
User class
	-user_id
	-add appointments

Service
Description
Price
rating
Booking
Time
Client
User_id
Provider_id

Ratings	
Rate
Comment
Date
Service provided

NICE TO HAVE
Event -> popup shop 