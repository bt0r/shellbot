FROM node:8-alpine
LABEL maintainer="Thibaut BAYER<bt0r>"
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app

USER node

CMD npm start