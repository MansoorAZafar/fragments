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
   5. USE_IN_MEMORY **(Maybe Optional)**
      - IFF USE_AWS_MEMORY is defined, cannot define this.
      - Defines to use the in memory database
   6. USE_AWS_MEMORY **(Maybe Optional)**
      - IFF USE_IN_MEMORY is defined, cannot define this (only 1 can be defined).
      - Defines the microservice to use AWS memory strategy.


2. Install all dependencies

```bash
npm install
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

# Or running with docker
docker build -t fragments:latest .                                                                         # Build the docker image
docker run --rm --name fragments --env-file .env -p 8080:8080 fragments:latest                             # Run and delete the image afterwords
docker run --rm --name fragments --env-file env.jest -e LOG_LEVEL=debug -p 8080:8080 -d fragments:latest   # Run the docker as a detached daemon

docker logs [id]      # Check the logs for the container
docker logs -f [id]   # Follow the logs for the container
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
- GET:
   - GET ALL
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
   - GET:ID
      - Returns the fragment for this ID
      - Requires Authorization (Not every user is allowed here)
         - Returns 401 if not authorized
         - Returns 200 if OK
      - Sample Output:
     ```text
        HTTP/1.1 200 OK
        Content-Type: text/plain
        Content-Length: 18
     ```
- POST:
   - Creates a fragment for the reuqested user
   - Requires Authorization (Not every user is allowed here)
      - Returns 401 if not authorized
      - Returns 415 if invalid context
      - Returns 201 if successfully created fragment
   - Sample Output
     ```json
      {
        "status": "ok",
        "fragment": {
          "id": "30a84843-0cd4-4975-95ba-b96112aea189",
          "ownerId": "11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a",
          "created": "2025-01-10T15:09:50.403Z",
          "updated": "2025-01-10T15:09:50.403Z",
          "type": "text/plain",
          "size": 256
        }
      }
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
    <li>hash.js</li>
    <li>routes/</li>
    <li>auth/</li>
    <li>model</li>
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
    <li>get/</li>
    <li>post/</li>
    <li>index.js</li>
</ul>
</details>

### src/routes/api/get
This is where the implementation logic for the GET routes will be handled

<details>
<summary>Files</summary>
<ul>
    <li>get.js</li>
    <li>getFragmentsById.js</li>
</ul>
</details>

### src/routes/api/post
This is where the implementation logic for the POST routes will be handled

<details>
<summary>Files</summary>
<ul>
    <li>post.js</li>
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

### src/model

This is where all the models files will exist.

<details>
<summary>Files</summary>
<ul>
    <li>fragment.js</li>
    <li>data/</li>
</ul>
</details>

### src/model/data

This is where all the specific memory strategy will be chosen.

<details>
<summary>Files</summary>
<ul>
    <li>index.js</li>
    <li>memory/</li>
</ul>
</details>

### src/model/data/memory

This is where all the specific memory strategy implementations will be defined & the client interface to the memory.

<details>
<summary>Files</summary>
<ul>
    <li>index.js</li>
    <li>memory-db.js</li>
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
    <li>fragment.test.js</li>
    <li>getFragmentsById.test.js</li>
    <li>hash.test.js</li>
    <li>memory-db.test.js</li>
    <li>memory.test.js</li>
    <li>post.test.js</li>    
</ul>
</details>

## Files
   1. Files in src/
   2. Files in src/routes
   3. Files in src/routes/api
   4. Files in src/routes/api/get
   5. Files in src/routes/api/post
   6. Files in src/auth
   7. Files in src/model
   8. Files in src/model/data
   9. Files in src/model/data/memory
   10. Files in test/units

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

### src/hash.js
- Hashing user information to help with privacy & security

### src/routes/index.js
- Defines the health check
- Enables and setup all other routes

### src/routes/api/index.js
- Main entry point for the api
- defines the router and declares the get route

### src/routes/api/get/get.js
- defines the implementation for Getting the Fragments

### src/routes/api/get/getFragmentsById.js
- defines the implementation for getting a fragment based on the ID in the url parameters
- returns 1 fragment respective to the given ID

### src/routes/api/post/post.js
- defines the implementation for creating and adding a fragment into the memory strategy.
- Requires the user to give a allowed buffer type

### src/auth/basic-auth.js
- defines the authentication for a basic HTTP authentication with Apache htpasswd

### src/auth/cognito.js
- Defines the authentication for amazon cognito

### src/auth/index.js
- defines at run-time which authentication to use

### src/model/fragment.js
- Defines the fragment structure/skeleton
- Defines its capabilities and how to add, get, delete, update a fragment.

### src/model/data/index.js
- Defines the memory strategy that is desired to be used. Based on the .env or for tests the jest.env

### src/model/data/memory/index.js
- defines creating, writing, deleting and listing operations for fragments into a in memory database.
- Client interface for interacting with the database

### src/model/data/memory/memory-db.js
- Defines the structure and algorithms for interacting with an in memory database

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

### tests/unit/fragment.test.js
- tests the creation, seting of data, deletion of a fragment
- Tests how the data is handled and how to create them

### tests/unit/getFragmentsById.test.js
- tests the resulting fragments returned
- tests for bad inputs and catching any errors

### tests/unit/hash.test.js
- tests the hashing algorithm to ensure it hashs fine

### tests/unit/memory-db.test.js
- tests the creating, reading, updating, deleting of fragments
- Tests invalid and catches errors

### tests/unit/memory.test.js
- tests the client interface for interacting with the memory database
- ensures throws as needed
- tests creating, listing, deleting and adding data to fragments

### tests/unit/post.test.js
- tests creating the fragment
- tests errors being thrown if bad information given


