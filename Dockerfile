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
FROM nginx:alpine

# Copy the built files from the builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# --- IMPORTANT PORT NOTE ---
# Nginx by default listens on port 80. If you need it to listen on 8080,
# you must provide a custom nginx.conf file that includes 'listen 8080;'
# and copy it into the container using a line like:
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# If you are NOT using a custom config, Nginx is still listening on 80.
# If you truly need 8080, ensure your nginx.conf reflects that.
# If you don't need 8080 and default 80 is fine, change EXPOSE back to 80.

# Expose port 8080 (Ensure this matches the port Nginx is listening on inside the container)
EXPOSE 8080

# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]
