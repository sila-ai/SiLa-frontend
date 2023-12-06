FROM public.ecr.aws/docker/library/node:14-alpine as build


RUN apk update && apk add --no-cache nginx

WORKDIR /var/www/html

COPY . ./

# RUN rm -rf node_modules/

RUN npm install -g @angular/cli@11.1.2
RUN npm install
RUN ng build --prod

EXPOSE 8080
COPY config/frontend.conf /etc/nginx/http.d/
# CMD ["ng","serve"]
CMD [ "nginx","-g","daemon off;" ]

