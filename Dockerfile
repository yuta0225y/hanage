FROM node:18.17.1-alpine
WORKDIR /app/
COPY ./package.json /app/
RUN npm install