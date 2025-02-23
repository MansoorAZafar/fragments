##############################################################################

# Stage 0: 	Installing Alpine Linux + Node


# Set the parent/base image to use as a starting point
#   - Based on an existing Docker Image Node
# Using node version 22.12.0
FROM node:20.17.0-alpine3.20@sha256:2d07db07a2df6830718ae2a47db6fedce6745f5bcd174c398f2acdda90a11c03


##############################################################################

# Stage 1:	Setup of Environment Variables + Work Directory


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

# Ensure Only production dependencies will be installed 
ENV NODE_ENV=production


# Define the working directory
#   - Use the /app as our working directory
WORKDIR /app


##############################################################################

# Stage 2:	Installing Dependencies


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

# Explicit filenames: Copy the package.json and package-lock.json
# files into the working dir (/app), using full paths and multiple source
# files.  All of the files will be copied into the working dir `./app`
COPY package.json package-lock.json ./


# Install dependencies 
# - executes a command and caches this layer
#   - can re-use if package*.json haven't changed
# Install node dependencies defined in package-lock.json
# 	- Ensure production only is installed by having a double ensurance
RUN npm ci --only=production  


##############################################################################

# Stage 3: 	Copy Source Code 


# Copy server's source code into the image
# - Copy src to /app/src/
COPY --chown=node:node ./src ./src

# Copy our HTPASSWD file
COPY --chown=node:node ./tests/.htpasswd ./tests/.htpasswd


##############################################################################

# Stage 4: 	Metadata


# Defining Metadata
# Add arbitrary data about the maintainer and author
LABEL maintainer="Mansoor Zafar <mzafar15@myseneca.ca>"
LABEL description="Fragments node.js microservice"


##############################################################################

# Stage 5: 	Build the microservice 


# Indicate the port a server will listen when ran
# We run our service on port 8080
EXPOSE 8080


# Switch the User 
USER node


# Setup the Health Check
HEALTHCHECK --interval=3m \
	CMD wget --no-verbose --tries=1 --spider http://localhost:8080 || exit 1


# Define the command to start our container
# - Start the container by running our server
CMD ["npm", "start"]	
