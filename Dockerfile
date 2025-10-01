FROM quay.io/qasimtech/mega-bot:latest

RUN git clone https://github.com/BobbyX208/AUTOBOB /root/mega && \
    rm -rf /root/mega/.git

WORKDIR /root/mega
RUN npm install || yarn install

EXPOSE 5000
CMD ["npm", "start"]
