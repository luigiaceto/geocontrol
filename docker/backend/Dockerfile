# Use official Node.js image
FROM node:latest

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./

RUN npm install

# Copy the rest of the application code
COPY src/ ./src/
COPY scripts/ ./scripts/
COPY tsconfig.json ./
COPY doc/ ./doc/

# Install TypeScript globally and ts-node for running TypeScript files
RUN npm install -g typescript ts-node

# Install tsconfig-paths for path alias resolution
RUN npm install -g tsconfig-paths

# Build the application
RUN npm run build

# Expose backend port
EXPOSE 5000

# Create a startup script that runs create-root-user first, then starts the server
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "Starting backend service..."' >> /app/start.sh && \
    echo 'echo "Running create-root-user script..."' >> /app/start.sh && \
    echo 'ts-node -r tsconfig-paths/register --project tsconfig.json scripts/create-root-user.ts' >> /app/start.sh && \
    echo 'echo "Starting backend server..."' >> /app/start.sh && \
    echo 'npm start' >> /app/start.sh && \
    chmod +x /app/start.sh

# Use the startup script as the entry point
CMD ["/app/start.sh"]
