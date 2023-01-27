#Install dependecies and build static files
ARG nodeVersion=18.12.1
ARG cypresVersion=10.11.0

FROM node:$nodeVersion as build-stage

ENV JQ_VERSION=1.6
RUN wget --no-check-certificate https://github.com/stedolan/jq/releases/download/jq-${JQ_VERSION}/jq-linux64 -O /tmp/jq-linux64
RUN cp /tmp/jq-linux64 /usr/bin/jq
RUN chmod +x /usr/bin/jq

WORKDIR /app

COPY package*.json ./
RUN npm install 

COPY . .
RUN jq 'to_entries | map_values({ (.key) : ("_" + .key) }) | reduce .[] as $item ({}; . + $item)' ./src/config.json > ./src/config.tmp.json && mv ./src/config.tmp.json ./src/config.json

RUN npm run build-only

ARG nodeVersion
ARG cypresVersion

#Run unit test
FROM node:$nodeVersion as unit-test-stage
WORKDIR /app
COPY --from=build-stage /app .
RUN npm run test:unit:coverage

#Run e2e tests
FROM cypress/included:$cypresVersion as e2e-test-stage
WORKDIR /app
COPY --from=build-stage /app .
RUN npm run test:e2e:ci

#Run sonar qube tests
FROM node:$nodeVersion as sonarqube-stage
ARG sonarProjectKey 
ARG sonarToken
ARG sonarHost

WORKDIR /app
COPY --from=build-stage /app .
COPY --from=unit-test-stage /app/coverage/lcov.info ./coverage/lcov.info

RUN npm install -g sonarqube-scanner
RUN sonar-scanner \
  -Dsonar.login=$sonarToken\
  -Dsonar.projectKey=$sonarProjectKey \
  -Dsonar.javascript.lcov.reportPaths=./coverage/lcov.info \
  -Dsonar.sources=. \
  -Dsonar.projectName=$sonarProjectKey \
  -Dsonar.host.url=http://$sonarHost 
  

#Creating final artifact
FROM nginx:1.17 as artifact-stage

ENV JSFOLDER=/usr/share/nginx/html/assets/*.js

ENV VITE_SERVER_ADDRESS=https://bs-dev.demo.think-it.work

RUN echo "#!/usr/bin/env bash \nfor file in $JSFOLDER;\ndo\n  sed -i s#_serverAddress#\$VITE_SERVER_ADDRESS#g \$file\ndone\nnginx -g 'daemon off;'">/usr/bin/start-nginx.sh

RUN chmod +x /usr/bin/start-nginx.sh
WORKDIR /usr/share/nginx/html

COPY --from=build-stage /app/dist .

ENTRYPOINT [ "/usr/bin/start-nginx.sh" ]