# development stage
FROM node:14-alpine as base

RUN apk add --no-cache \
    make \
    g++ \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# WORKDIR /app
WORKDIR /usr/src/app

# COPY . .
COPY package.json yarn.lock tsconfig.json ecosystem.config.json ./

COPY ./src ./src

RUN yarn
RUN yarn compile

EXPOSE 4002

RUN ls -l

COPY entrypoint.sh ./

RUN ["chmod", "+x", "./entrypoint.sh"]

ENTRYPOINT [ "sh", "./entrypoint.sh" ]
