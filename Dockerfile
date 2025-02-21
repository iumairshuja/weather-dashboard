# Use an official lightweight Node.js image as the base
FROM node:lts-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json if present
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port Vite uses for development (default is 5173)
EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev"]