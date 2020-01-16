FROM node:13

WORKDIR /Affirm

COPY large ./large
COPY .babelrc ./
COPY package-lock.json ./
COPY package.json ./
COPY src ./src
COPY index.js index.js

RUN npm install

CMD ["npm", "start"]
