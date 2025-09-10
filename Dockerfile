FROM node:18
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .
EXPOSE 4001
CMD ["node", "index.js"]

