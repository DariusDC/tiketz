FROM node:alpine
WORKDIR /app
COPY package.json .
run npm i
COPY . .

CMD [ "npm", "run", "dev" ]