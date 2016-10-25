'use strict';

const Hapi = require('hapi');
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '/data');

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

  console.log('KEYS ==>',Object.keys(obj)[0]);
  return obj[Object.keys(obj)[0]];
}

const find = (obj, item) => {
  console.log('==> find', obj, item);
  let match = obj.filter(function(item){
      return obj.empID === item;
  });

  return match;
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

          //console.log('employees==>', employees);
          //console.log(request.params.id, employees);

          if (request.params.id) {
            if (employees.length <= request.params.id) {
              return reply('No quote found.').code(404);
            }
            return reply(employees[request.params.id]);
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

          let employees = readJSON('./data/employees.json');
          let projects = readJSON('./data/projects.json');

          console.log('returned ==>', find(employees, request.params.id));

          //console.log('employees==>', employees);
          //console.log('projects==>', projects);
          //console.log(request.params.id, employees);

          if (request.params.id) {
            if (employees.length <= request.params.id) {
              return reply('No quote found.').code(404);
            }
            return reply(employees[request.params.id]);
          }
        }
    });
});

// start the server //
server.start((err) => {
    if (err) throw err;
    console.log(`Server running at: ${server.info.uri}`);
});
