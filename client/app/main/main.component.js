import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './main.routes';

export class MainController {

  client = null;
  server = null;
  protocol = 'tcp';
  interfaces = [];
  socket;

  /*@ngInject*/
  constructor($http, socket, $scope) {
    this.$http = $http;
    this.socket = socket;

    $scope.$on('$destroy', function() {
        socket.unsyncUpdates('test');
    });

  }

  $onInit() {
      console.log('retreiving tests');
      let self = this;
      this.$http.get('/api/tests')
          .then(response => {
              self.tests = response.data;
              if(self.tests) {
                  self.tests.reverse(); //to order in descending order
              }
              this.socket.syncUpdates('test', this.tests); //sync any additions to the tests in the db
          });

      //todo: reimplement, but use a list of suggesting interfaces instead
      // this.interfaces = this.retrieveClientInterfaces();
  }

    /**
     * Retrieve Interfaces
     */
  retrieveClientInterfaces() {
    console.log('retreiving interfaces');
    let self = this;
    this.$http.get('/api/interfaces')
        .then(response => {
            self.interfaces = response.data;
        });
  }



    /**
     * Start a throughput performance test via tests api
     */
  startTest() {
    if(this.client && this.server && this.protocol) {
      this.$http.post('/api/tests', {
        client: this.client,
        server: this.server,
        protocol: this.protocol
      });
      this.client = '';
      this.server = '';
      this.protocol = 'tcp';
    }
  }
}

export default angular.module('netTestAppApp.main', [ngRoute])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
