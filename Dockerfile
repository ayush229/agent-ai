# --- Stage 1: Builder ---
FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Stage 2: Runner ---
FROM nginx:alpine
RUN apk update && apk add --no-cache gettext

COPY --from=builder /app/build /usr/share/nginx/html

# Copy the nginx config template (with the placeholder)
COPY default.conf.template /etc/nginx/templates/default.conf.template

# Remove default Nginx config
RUN rm -f /etc/nginx/conf.d/default.conf

CMD /bin/sh -c "envsubst < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
