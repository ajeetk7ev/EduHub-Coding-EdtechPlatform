FROM node:18-alpine

WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy tsconfig and source code
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript → dist
RUN npm run build

EXPOSE 3000

# Run compiled JS
CMD ["node", "dist/server.js"]
