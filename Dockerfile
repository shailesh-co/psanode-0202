# Use official Node.js image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json, package-lock.json, and .env file
COPY package*.json ./
COPY .env ./

# Install dependencies
RUN npm install

# Copy all project files to the container
COPY . .

# Expose port 3001
EXPOSE 3001

# Start the application
CMD ["node", "server.js"]
