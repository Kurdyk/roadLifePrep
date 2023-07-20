#syntax:docker/dockerfile:1
FROM node:18-alpine
WORKDIR $(pwd)
COPY package.json package-lock.json ./
ENV PATH /app/node_modules/.bin:$PATH
RUN npm install --silent
RUN npm install react-scripts -g --silent
COPY . ./
CMD ["npm", "start"]
