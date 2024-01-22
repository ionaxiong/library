FROM node:16

WORKDIR /usr/src/app

COPY . .

# Change npm ci to npm install since we are going to be in development mode
RUN npm install

# ENV REACT_APP_BACKEND_URL=http://localhost:8000
ENV REACT_APP_SERVER_URI=/api
# ENV REACT_APP_SERVER_WS_URI=/api

# ENV REACT_APP_SERVER_WS_URI=ws://localhost:4000

# npm start is the command to start the application in development mode
CMD ["npm", "start"]