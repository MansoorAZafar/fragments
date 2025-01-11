# Fragments

A Backend Microservices Project for DPS955 Cloud Computing For Programmers.

### Table of Contents

1. Installation & Running - Getting the project - Running the project
2. Routes
3. Project Structure
4. File Purpose's

## Installation

1. Clone the repository

```bash
https://github.com/MansoorAZafar/fragments.git
```

2. Install all dependencies

```bash
npm i
```

2.5 **(Optional)** Run ESlint

```bash
npm run lint
```

- Should not print any errors

### Run the Project

3. Run the project

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
</ul>
</details>

### src/

This is where all the source files will exist.

<details>
<summary>Files</summary>
<ul>
    <li>app.js</li>
    <li>configuration.js</li>
    <li>logger.js</li>
    <li>server.js</li>
</ul>
</details>

## Files

### Server.js

- The 'Main' of the microservice
- Defines the PORT and runs the server

### App.js

- Defines the libraries used
- Defines the Routes and middleware

### Logger.js

- Defines the custom logger
