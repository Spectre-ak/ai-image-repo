FROM node:alpine as builder
WORKDIR /app-ui
COPY package.json .
RUN npm install
COPY ./ ./
RUN npm run build


FROM nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
COPY --from=builder /app/build /usr/share/nginx/html