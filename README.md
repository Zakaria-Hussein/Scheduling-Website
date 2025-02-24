# Schedule Management System
This is a Node.js application built with the Express framework, designed to manage schedules and events. It provides features like login, viewing schedules, and adding events to the schedule. It also integrates with a MySQL database for storing and retrieving schedule data.

Features
User Authentication: Users can log in using their credentials (username and password) stored in a MySQL database.
Schedule Management: After logging in, users can view schedules for specific days and add new events.
Session Management: User sessions are managed using express-session.
Database Integration: MySQL is used for storing user accounts and event information.
Security: Passwords are hashed using bcrypt to ensure secure authentication.
Setup
To get started with the application, follow these steps:

1. Clone the repository
bash
Copy
Edit
git clone <repository-url>
cd <project-directory>
2. Install dependencies
Ensure that you have Node.js and npm installed. Run the following command to install the required packages:

bash
Copy
Edit
npm install
3. Set up MySQL
Ensure that you have access to a MySQL database. Update the database connection information in the code (specifically in the login check and event retrieval routes) to match your own MySQL database credentials.

For example:

javascript
Copy
Edit
const connection = mysql.createConnection({
  host: 'your-mysql-host',
  user: 'your-mysql-username',
  password: 'your-mysql-password',
  database: 'your-database-name',
  port: 3306
});
4. Run the server
Start the server by running the following command:

bash
Copy
Edit
node index.js
The server will be accessible on port 9007. Open your browser and go to http://localhost:9007 to access the application.

Endpoints
/
Method: GET
Description: Returns the welcome page (index.html).
/login
Method: GET
Description: Returns the login page (login.html) or redirects to /schedule if the user is already logged in.
/logincheck
Method: GET
Description: Authenticates the user based on the provided username and password query parameters. Responds with a success or failure message.
/logout
Method: GET
Description: Logs the user out by destroying the session and redirects to the login page.
/schedule
Method: GET
Description: Returns the schedule page (schedule.html) if the user is logged in, otherwise redirects to /login.
/getSchedule
Method: GET
Description: Retrieves schedule events for a specific day (day query parameter). Returns event details in JSON format.
/addEvent
Method: GET
Description: Returns the page (addEvent.html) for adding new events if the user is logged in.
/eventEntry
Method: GET
Description: Adds a new event to the schedule by accepting various event details (e.g., day, event, start, end, etc.) through query parameters.
*
Method: GET
Description: Returns a 404 error for any undefined routes.
Session Management
The application uses express-session to manage user sessions. The session is stored in memory and will expire when the server is restarted. A session is created after a successful login, and the session's loggedIn flag is checked to restrict access to certain pages (like /schedule and /addEvent).

Dependencies
express: A fast, unopinionated web framework for Node.js.
body-parser: Middleware to handle JSON and URL-encoded data.
express-session: Middleware to handle session management.
mysql: MySQL database connector for Node.js.
bcrypt: A library to hash passwords for secure authentication.
Security Considerations
Passwords are hashed using bcrypt before being stored in the database.
For added security, ensure that your MySQL credentials are not stored in the code directly. Use environment variables for sensitive information.
