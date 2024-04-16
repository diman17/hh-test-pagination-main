FROM node:20-alpine
WORKDIR /web
RUN chown -R node:node /web
COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .
USER node
# RUN npm run build
EXPOSE 3001
