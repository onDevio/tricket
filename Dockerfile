FROM node:4.2.3
RUN npm install -g bower
RUN mkdir -p /web
WORKDIR /web
ADD package.json /web/
ADD modules /web/modules
RUN npm install
ADD bower.json /web/
RUN bower install --allow-root
ADD . /web
EXPOSE 3000
ENV DEBUG=*
VOLUME ["/web/storage", "/web/uploads"]
CMD ["node", "bin/www"]
