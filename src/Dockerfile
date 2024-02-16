FROM --platform=linux/amd64 node:18
WORKDIR /backend
COPY package*.json ./
RUN npm install
COPY backend/ . 
EXPOSE 8094
CMD ["node", "index.js"]