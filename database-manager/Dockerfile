FROM node:18-alpine
WORKDIR /database-manager
COPY . .
RUN npm install
CMD ["node", "app.js"]
EXPOSE 5050