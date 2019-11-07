FROM node:8-alpine as base
LABEL maintainer="Thibaut BAYER<bt0r>"
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY . /home/node/app
USER root


FROM base as dev
RUN npm install -g typescript
RUN npm install
RUN npm run-script build
CMD npm start

FROM dev as prod
# Remove unused production files
RUN rm -rf src/
CMD npm start
