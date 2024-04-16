FROM node:20-alpine
WORKDIR /srv
RUN chown -R node:node /srv
COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .
USER node
EXPOSE 3000
