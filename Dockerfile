FROM nginx

LABEL AUTHOR="yunit"

ENV TimeZone=Asia/Shanghai

COPY ./dist/  /usr/share/nginx/html/

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

