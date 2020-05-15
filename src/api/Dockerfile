# specify the node base image with your desired version node:<version>
FROM node:12


ADD package.json package-lock.json /
RUN npm i
ADD src $HOME/src

CMD [ "node", "./src/index.js" ]
