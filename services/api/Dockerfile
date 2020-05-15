# specify the node base image with your desired version node:<version>
FROM node:12


ADD package.json package-lock.json /
RUN npm i
ADD src $HOME/src

VOLUME ./src
RUN npm install --save -g nodemon

CMD [ "npm", "run", "server" ]
