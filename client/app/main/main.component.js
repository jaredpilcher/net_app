import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './main.routes';

export class MainController {

  client = null;
  server = null;
  protocol = 'tcp';
  interfaces = [];

  /*@ngInject*/
  constructor($http, $interval) {
    this.$http = $http;
    this.$interval = $interval;
  }

  $onInit() {
      //retrieve tests every second
      let self = this;
      this.$interval( function() {
          self.retrieveTests();
        },
          1000);

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
     * retrieve tests from the tests api
     */
  retrieveTests() {
      console.log('retreiving tests');
      let self = this;
      this.$http.get('/api/tests')
        .then(response => {
            self.tests = response.data;
            if(self.tests) {
                self.tests.reverse(); //to order in descending order
            }
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
