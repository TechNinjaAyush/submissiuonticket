 # Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install
RUN npx prisma generate
# Copy the rest of the files
COPY . .

# Expose the port
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]
