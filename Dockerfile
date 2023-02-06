FROM node:12.22.3
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
#Copy everything in the current folder, to the WORKDIR
COPY . .
EXPOSE 8080
CMD [ "npm", "start" ]