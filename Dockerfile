# Use the official Node.js 16 image.
# https://hub.docker.com/_/node
FROM node:16

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./

# Install production dependencies.
RUN npm install

# Copy local code to the container image.
COPY . .

# Express server uses port 3000 by default and EXPOSE instruction informs Docker
# that the container listens on the specified network ports at runtime.
EXPOSE 3001

# Run the web service on container startup.
CMD [ "node", "index.js" ]
