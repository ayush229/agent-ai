# --- Stage 1: Builder ---
FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./

# Use npm ci for deterministic installs based on package-lock.json
# If you don't have package-lock.json, use 'npm install'
# If you have peer dependency issues, use 'npm install --legacy-peer-deps'
RUN npm install

COPY . .
RUN npm run build

# --- Stage 2: Runner ---
FROM nginx:alpine

# Install gettext package which provides envsubst utility
# Update apk cache, install gettext, then clean up cache
RUN apk update && apk add --no-cache gettext

COPY --from=builder /app/build /usr/share/nginx/html

# Copy the nginx config template (with the placeholder)
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Remove default Nginx config if it exists (optional, but good practice)
RUN rm -f /etc/nginx/conf.d/default.conf

# EXPOSE the PORT variable Railway will provide (optional, Railway detects automatically)
# EXPOSE $PORT 

# Use envsubst to replace LISTEN_PORT placeholder with the value of $PORT 
# environment variable provided by Railway. Then start Nginx.
# Note: Railway automatically provides the $PORT variable.
CMD /bin/sh -c "envsubst < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
