FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

ADD start.sh /
RUN chmod +x /start.sh

CMD ["/start.sh"]
