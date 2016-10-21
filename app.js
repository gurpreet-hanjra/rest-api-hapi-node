'use strict';

const Hapi = require('hapi');
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '/data');

const server = new Hapi.Server();
server.connection({
    port: 9090, routes: {
    cors: {
      origin: ['*']
    }
  }});
//
// server.route({
//   method: 'GET',
//   path: '/employees',
//   handler: function (request, reply) {
//     //console.log()
//     reply.file('data/employees.json');
//   }
// });
//

const readJSON = (file) => {
  console.log('file to read', file);

  // fs.readFile(file, 'utf8', (err, data) => {
  //   if (err) throw err;
  //
  //   //console.log(JSON.parse(data));
  //
  //   var obj = JSON.parse(data);
  //   //console.log('obj==>', obj.EmployeesList);
  //
  //   return obj.EmployeesList;
  // });

  var obj = JSON.parse(fs.readFileSync(file, 'utf8'));
  return obj.EmployeesList;
}

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
        path: '/project/{id}',
        handler: function (request, reply) {

          let employees = readJSON('./data/employees.json');
          let projects = readJSON('./data/projects.json');

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
});
server.start((err) => {
    if (err) throw err;
    console.log(`Server running at: ${server.info.uri}`);
});
