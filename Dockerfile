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
# Make sure your package.json build script is compatible with Unix shells (e.g., uses NODE_OPTIONS=... command)
RUN npm run build

# --- Stage 2: Runner ---
# Use a lightweight web server like Nginx to serve the built static files
FROM nginx:alpine

# Copy the built files from the builder stage into the Nginx default public directory
COPY --from=builder /app/build /usr/share/nginx/html

# --- IMPORTANT NGINX CONFIG & PORT NOTE ---
# To make Nginx listen on port 8080, you MUST provide a custom nginx.conf file
# that includes 'listen 8080;' in its server block and copy it into the container.
# The default Nginx config listens on 80.
# Ensure the 'nginx.conf' file exists in the same directory as your Dockerfile.

# Copy the custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080 (Ensure this matches the port Nginx is listening on inside the container)
EXPOSE 8080

# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]
