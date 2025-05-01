# --- Stage 1: Builder ---
# Use a Node.js image to build the React application
FROM node:20-alpine as builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
# This step is separate to leverage Docker cache if dependencies don't change
COPY package*.json ./

# Install dependencies
# Use --force-orphan to avoid issues with leftover packages if node_modules is cached
RUN npm install --force-orphan

# Copy the rest of your application code
COPY . .

# Build the React application
# This command runs your build script defined in package.json
RUN npm run build

# --- Stage 2: Runner ---
# Use a lightweight web server like Nginx to serve the built static files
FROM nginx:alpine

# Copy the built files from the builder stage into the Nginx default public directory
COPY --from=builder /app/build /usr/share/nginx/html

# Copy a custom nginx configuration if needed (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (the default for Nginx)
EXPOSE 80

# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]

# --- Optional: For Development/Debugging (Less common for production deployment) ---
# If you wanted a Dockerfile for local development with hot-reloading,
# it would look very different, primarily using the node image and running npm start.
# The above is for production build and serving.
