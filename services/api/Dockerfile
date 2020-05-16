# specify the node base image with your desired version node:<version>
FROM node:12

# Create app directory
RUN mkdir -p /api
WORKDIR /api

# Install dependencies
COPY package.json .
RUN npm install
RUN npm install --save -g nodemon

# Bundle app source
COPY . .

# Bundle
CMD [ "npm", "run", "server" ]
