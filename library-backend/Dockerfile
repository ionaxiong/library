FROM node:16

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci --only=production

USER node

# EXPOSE 3000

CMD npm start