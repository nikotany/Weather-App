FROM nginx:1.21.0-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY index.html /usr/share/nginx/html
COPY src/ /usr/share/nginx/html
COPY icons/ /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]