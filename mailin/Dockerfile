FROM node:0.12
RUN npm install -g mailin
#RUN mkdir -p /mailin
#WORKDIR /mailin
#ADD package.json /mailin/
#RUN npm install
#ADD . /mailin
CMD mailin --webhook http://tricket:3000/emails
#CMD ["node", "main.js"]
