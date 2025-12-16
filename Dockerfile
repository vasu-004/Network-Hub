# ==========================================
# Stage 1: Build the React Client
# ==========================================
FROM node:lts-alpine AS client-build
WORKDIR /usr/src/app

# Copy client package files and install dependencies
# We copy only package files first to leverage Docker cache
COPY client/package*.json ./client/
RUN cd client && npm ci

# Copy the rest of the client source code
COPY client/ ./client/

# Build the React application
RUN cd client && npm run build

# ==========================================
# Stage 2: Production Server
# ==========================================
FROM node:lts-alpine
WORKDIR /usr/src/app

# Copy server package files and install production dependencies
COPY server/package*.json ./server/
RUN cd server && npm ci --only=production

# Copy Server Source Code
COPY server/ ./server/

# Copy Built Client Assets from the Builder Stage
# We maintain the ../client/dist structure expected by server.js
COPY --from=client-build /usr/src/app/client/dist ./client/dist

# Expose the API Port
EXPOSE 8000

# Set environment variables if needed
ENV NODE_ENV=production
ENV PORT=8000

# Start the Node.js server
CMD ["node", "server/server.js"]
