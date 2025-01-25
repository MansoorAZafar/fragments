# Fragments

A Backend Microservices Project for DPS955 Cloud Computing For Programmers.

### Table of Contents

1. Installation & Running
   - Getting the project
   - Running the project
2. Routes
3. Project Structure
4. File Purpose's

## Installation

1. Clone the repository

```bash
git clone https://github.com/MansoorAZafar/fragments.git
```


1.5 **(Optional)** Add Environment Variables
- Add a .env file in the root of the project 
   1. PORT **(Optional)**
      - The port the server will be started on
   2. LOG_LEVEL **(Optional)**
      - The level that logs will be displayed at
   3. AWS_COGNITO_POOL_ID **(Mandatory)**
      - The User Pool ID
   4. AWS_COGNITO_CLIENT_ID **(Mandatory)**
      - The ID of the web app for your User Pool


2. Install all dependencies

```bash
npm i
```


2.3 **(Optional)** Run ESlint

```bash
npm run lint
```

- Should not print any errors

2.6 **(Optional)** Run Unit Tests
```bash
npm test
npm run coverage
```

### Run the Project
```bash
npm start      # Run the project in production mode
npm run dev    # Run the project in developer mode
npm run debug  # Run the project in debug mode
```

## Routes

### Root/Home: /

- The root of the application
- Requires no headers or any body
- Acts as a health check
  - Returns 200 if OK
  - Returns anything else if Error
- Sample Output

```json
{
  "status": "ok",
  "author": "Mansoor Zafar",
  "githubUrl": "https://github.com/MansoorAZafar/fragments",
  "version": "0.0.1"
}
```

### v1/fragments

- Returns the main data format of this API
- Requires Authorization (Not every user is allowed here)
   - Returns 401 if not authorized
   - Returns 200 if OK
- Sample Output
   - Bad Output
```txt
HTTP/1.1 401 Unauthorized
...
```
   - Good Output
```json
"status": "ok",
"fragments": []
```

## Project Structure

### / ( Root )

This is where all configuration files and directories will exist.

<details>
<summary>Files</summary>
<ul>
    <li>package.json</li>
    <li>package-lock.json</li>
    <li>eslint.config.mjs</li>
    <li>.prettierrc</li>
    <li>.gitignore</li>
    <li>.vscode/</li>
    <li>src/</li>
    <li>env.jest</li>
    <li>jest.config.js</li>
    <li>.github</li>
</ul>
</details>

### src/

This is where all the source files will exist.

<details>
<summary>Files</summary>
<ul>
    <li>app.js</li>
    <li>response.js</li>
    <li>index.js</li>
    <li>logger.js</li>
    <li>server.js</li>
    <li>routes/</li>
    <li>auth/</li>
</ul>
</details>

### src/routes/
This is where the routes will be handled

<details>
<summary>Files</summary>
<ul>
    <li>index.js</li>
    <li>api/</li>
</ul>
</details>

### src/routes/api
This is where the implementation logic for the actual routes will be handled

<details>
<summary>Files</summary>
<ul>
    <li>get.js</li>
    <li>index.js</li>
</ul>
</details>

### src/auth

This is where all the authentication files will exist.

<details>
<summary>Files</summary>
<ul>
    <li>basic-auth.js</li>
    <li>cognito.js</li>
    <li>index.js</li>
</ul>
</details>

### tests

This is where all the test files are organized.

<details>
<summary>Files</summary>
<ul>
    <li>unit</li>
    <li>.htpasswd</li>
</ul>
</details>

### tests/unit

This is where all the test files will exist.

<details>
<summary>Files</summary>
<ul>
    <li>app.test.js</li>
    <li>get.test.js</li>
    <li>health.test.js</li>
    <li>response.test.js</li>
</ul>
</details>

## Files
   1. Files in src/
   2. Files in src/routes
   3. Files in src/routes/api
   4. Files in src/auth
   5. Files in test/units

### src/Server.js

- The 'Main' (Not Entry point) of the microservice
- Defines the PORT and runs the server

### src/App.js

- Defines the libraries used
- Defines the Routes and middleware

### src/index.js
- defines the dotenv for all other files
- Allows for a fallback if the process's fail
- Starts the server.js
- The Entry point of the server

### src/Logger.js

- Defines the custom logger

### src/Response.js
- Defines the template for a successful response
- Defines the template for an error response

### src/routes/index.js
- Defines the health check
- Enables and setup all other routes

### src/routes/api/index.js
- Main entry point for the api
- defines the router and declares the get route

### src/routes/api/get.js
- defines the implementation for Getting the Fragments

### src/auth/basic-auth.js
- defines the authentication for a basic HTTP authentication with Apache htpasswd

### src/auth/cognito.js
- Defines the authentication for amazon cognito

### src/auth/index.js
- defines at run-time which authentication to use

### tests/unit/app.test.js
- defines the testing for the 404 middleware for the app.js

### tests/unit/get.test.js
- tests the authentication for unauthenticated and authenticated users
- tests the respective output

### tests/unit/health.test.js
- tests the basic health check
- tests the reponse item & headers
- ensures correct version and github url

### tests/unit/response.test.js
- tests the format and return type of the successful response
- tests the format and return type for the error response


