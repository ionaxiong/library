FROM node:16 as build-and-test-stage

WORKDIR /usr/src/app

COPY . .

RUN npm ci

# ENV REACT_APP_BACKEND_URL=http://localhost:8080/api
# ENV REACT_APP_BACKEND_URL=http://localhost:3000

RUN npm run build

# RUN CI=true npm test

FROM nginx:1.20.1-alpine

COPY --from=build-and-test-stage /usr/src/app/build /usr/share/nginx/html