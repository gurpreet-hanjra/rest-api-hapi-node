'use strict';

const Hapi = require('hapi');
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '/data');

// smiliyes
const smile = '\uD83D\uDE00';

// create a new server //
const server = new Hapi.Server();
server.connection({
    port: 9090, routes: {
    cors: {
      origin: ['*']
    }
  }});

// read json files, returns the data //
const readJSON = (file) => {
  console.log('file to read', file);
  var obj = JSON.parse(fs.readFileSync(file, 'utf8'));
  //console.log('KEYS ==>',Object.keys(obj)[0]);
  return obj[Object.keys(obj)[0]];
}

const find = (obj, id, key) => {
  console.log('==> find', obj, id, key);
  return obj.filter(function(item){
      if (id == item[key]) {
        console.log('matched ==> ', id, item[key]);
        return item;
      }
  });
}

// define the routes //
server.register(require('inert'), (err) => {

    if (err) {
        throw err;
    }

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            reply('Welcome to employees app');
        }
    });

    server.route({
        method: 'GET',
        path: '/employee',
        handler: function (request, reply) {
            reply.file('./data/employees.json');
        }
    });

    server.route({
        method: 'GET',
        path: '/employee/{id}',
        handler: function (request, reply) {

          let employees = readJSON('./data/employees.json');

          let result = find(employees, request.params.id, 'empID');

          console.log('result ==> ', result);

          if (request.params.id) {
            return reply(result);
          }
        }
    });

    server.route({
        method: 'GET',
        path: '/project',
        handler: function (request, reply) {
            reply.file('./data/projects.json');
        }
    });

    server.route({
        method: 'GET',
        path: '/project/{id}',
        handler: function (request, reply) {

          let projects = readJSON('./data/projects.json');

          let result = find(projects, request.params.id, 'projectID');

          //console.log('result ==> ', result);

          if (request.params.id) {
            return reply(result);
          }
        }
    });

    server.route({
        method: 'GET',
        path: '/budget',
        handler: function (request, reply) {
            reply.file('./data/budget.json');
        }
    });

    server.route({
        method: 'GET',
        path: '/budget/{id}',
        handler: function (request, reply) {

          let projects = readJSON('./data/budget.json');

          let result = find(projects, request.params.id, 'code');

          //console.log('result ==> ', result);

          if (request.params.id) {
            return reply(result);
          }
        }
    });
});

// start the server //
server.start((err) => {
    if (err) throw err;
    console.log(`Server running at: ${server.info.uri} ${smile}`);
});
