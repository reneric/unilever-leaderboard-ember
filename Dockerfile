FROM reneric/basenode:latest
MAINTAINER Ren Simmons <rsimmo4@gmail.com>
# PhantomJS dependencies
RUN apt-get update \
  && apt-get install -y libfontconfig \
  && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR /usr/src/app
RUN echo "prefix=~/.npm" > /home/app/.npmrc
RUN sudo chown -R app /usr/src/app
USER app

# PhantomJS needs to be installed globally
RUN npm install -g phantomjs-prebuilt@2.1.5
COPY package.json .npmrc* /usr/src/app/
RUN npm install
ENV PATH /usr/src/app/node_modules/.bin:/home/app/.npm/bin:$PATH

COPY bower.json .bowerrc* /usr/src/app/
RUN bower install

COPY . /usr/src/app
RUN sudo chown -R app /usr/src/app
EXPOSE 4200 49152 7357

CMD ["npm", "start"]
