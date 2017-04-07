import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './main.routes';

export class MainController {

  client = null;
  server = null;

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
  }

    /**
     * retrieve tests from the tests api
     */
  retrieveTests() {
      console.log('retreiving tests');
      this.$http.get('/api/tests')
        .then(response => {
            this.tests = response.data;
            if(this.tests) {
                this.tests.reverse(); //to order in descending order
            }
      });
  }

    /**
     * Start a throughput performance test via tests api
     */
  startTest() {
    if(this.client && this.server) {
      this.$http.post('/api/tests', {
        client: this.client,
        server: this.server
      });
      this.client = '';
      this.server = '';
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
