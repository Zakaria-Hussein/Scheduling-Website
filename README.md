# Schedule Management System
This is a Node.js application built with the Express framework, designed to manage schedules and events. It provides features like login, viewing schedules, and adding new events to the schedule. It also integrates with a MySQL database for storing and retrieving schedule data.

Features
The application allows users to log in using their credentials (username and password) stored in a MySQL database. After logging in, users can view schedules for specific days and add new events. User sessions are managed using express-session, and the application uses bcrypt to securely hash passwords for authentication.

Setup
To get started with the application, follow these steps:

First, clone the repository by running the command:

bash
Copy
Edit
git clone <repository-url>
cd <project-directory>
Make sure you have Node.js and npm installed. Then, run the following command to install the required packages:
npm install

Next, you need to set up MySQL. Ensure you have access to a MySQL database. Update the connection details in the code, especially in the login check and event retrieval routes, to match your MySQL credentials.

After setting up your database, run the server with the following command:
node index.js

The server will be accessible at http://localhost:9007. You can open this in your browser to start using the application.

Endpoints
/: This endpoint returns the welcome page (index.html).
/login: This endpoint returns the login page (login.html) or redirects to /schedule if the user is already logged in.
/logincheck: This endpoint authenticates the user based on the provided username and password query parameters. It responds with a success or failure message.
/logout: This endpoint logs the user out by destroying the session and redirects to the login page.
/schedule: This endpoint returns the schedule page (schedule.html) if the user is logged in, or redirects to /login if the user is not logged in.
/getSchedule: This endpoint retrieves schedule events for a specific day, based on the day query parameter, and returns event details in JSON format.
/addEvent: This endpoint returns the page (addEvent.html) for adding new events if the user is logged in. If the user is not logged in, they are redirected to the login page.
/eventEntry: This endpoint adds a new event to the schedule. It accepts various event details (e.g., day, event, start, end, etc.) as query parameters and inserts them into the database.
*: This endpoint returns a 404 error for any undefined routes.

Session Management
The application uses express-session to manage user sessions. The session is stored in memory and will expire when the server is restarted. A session is created after a successful login, and the session’s loggedIn flag is checked to restrict access to certain pages like /schedule and /addEvent.

Dependencies
The application relies on several dependencies including express, body-parser, express-session, mysql, and bcrypt. These libraries enable functionality such as routing, parsing request data, session management, connecting to the database, and secure password authentication.

Security Considerations
Passwords are hashed using bcrypt before being stored in the database to ensure they are not saved in plain text. It is recommended that you do not store MySQL credentials directly in the code for production environments. Instead, use environment variables or a configuration management solution to securely store sensitive information.

