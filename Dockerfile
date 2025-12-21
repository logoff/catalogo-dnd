# Development server with hot-reload
FROM node:22-alpine

WORKDIR /app

# Install dependencies first (cached layer)
COPY package*.json ./
RUN npm install

# Source code will be mounted as volume
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
