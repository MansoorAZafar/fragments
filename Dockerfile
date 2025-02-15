# Set the parent/base image to use as a starting point
#   - Based on an existing Docker Image Node
# Using node version 22.12.0
FROM node:20.17.0

# Defining Metadata
# Add arbitrary data about the maintainer and author
LABEL maintainer="Mansoor Zafar <mzafar15@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# Defining Environment Variables
# - These environment variables should not be secrets 
#   - So nothing too important i.e don't include AWS_COGNITO_POOL_ID

# Set the default port to 8080
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false# 

# Define the working directory
#   - Use the /app as our working directory
WORKDIR /app

# Copy the dependencies 
# - copies from the build context (src) to a path inside the image (dest)

# Explicit path
#  - Copy the package.json and package-lock.json
#    files into /app. NOTE: the trailing `/` on `/app/`, which tells Docker
#    that `app` is a directory and not a file.
# ( Not using this but showing it exists )
# COPY package*.json /app/

# Option 2: relative path - Copy the package.json and package-lock.json
# files into the working dir (/app).  NOTE: this requires that we have
# already set our WORKDIR in a previous step.
# COPY package*.json ./
# ( Not using this but showing it exists )

# Option 3: explicit filenames - Copy the package.json and package-lock.json
# files into the working dir (/app), using full paths and multiple source
# files.  All of the files will be copied into the working dir `./app`
COPY package.json package-lock.json ./

# Install dependencies 
# - executes a command and caches this layer
#   - can re-use if package*.json haven't changed
# Install node dependencies defined in package-lock.json
RUN npm install

# Copy server's source code into the image
# - Copy src to /app/src/
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Define the command to start our container
# - Start the container by running our server
CMD npm start

# Indicate the port a server will listen when ran
# We run our service on port 8080
EXPOSE 8080
