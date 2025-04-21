  # Use the official Node.js LTS image
  #backend dockerfile

FROM node:18-alpine

# Set working directory

WORKDIR /app

# Copy package.json and lock files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose the port your app runs on
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]

