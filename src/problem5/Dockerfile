FROM node:lts-alpine as builder
WORKDIR /app
COPY package.json .
RUN npm install

FROM node:lts-alpine
WORKDIR /app
VOLUME /app/public
COPY --from=builder /app .
COPY . .
RUN apk add --no-cache libstdc++
RUN apk add --no-cache ffmpeg
RUN npx tsc

CMD [ "node", "--max-old-space-size=4096", "server.js" ]
