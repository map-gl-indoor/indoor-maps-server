FROM node:14 as builder

WORKDIR /indoor-maps-server

COPY . .
RUN npm install

EXPOSE 80
CMD ["node", "src/server.js", "--folder", "/maps", "--port", "80"]
