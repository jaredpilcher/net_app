# net_app - Network Throughput Performance App
This app is used to test the network throughput performance between the web server and another network connected device.

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js and npm](nodejs.org) Node >= 4.x.x, npm >= 2.x.x
- [Gulp](http://gulpjs.com/) (`npm install --global gulp`)
- [MongoDB](https://www.mongodb.org/) - Keep a running daemon with `mongod`
- [iperf3](https://iperf.fr/iperf-download.php) - Iperf3 server installed on web server and iperf3 server 

## Running a throughput performance test
You will need two laptops to execute a throughput performance test. Do the following:
1. On th first laptop, connect it to the network via ethernet. Run `iperf3 -s` to start the iperf3 server. 
2. On the second laptop, connect it via wifi to an access point. Inside the app, run `npm install; gulp serve` to build and deploy the app. This will open a browser tab, pointed to the app.
3. In the app, specify a client IP address, using the laptop from step 2. This will be one of the the web server's wifi network interfaces' IP addresses. Then specify a server IP address, using the laptop from step 1.
4. Click Start Test
5. The results from the test will appear after 10 seconds at the top of the table.

### Developing

1. Run `npm install` to install server dependencies.

2. Run `mongod` in a separate shell to keep an instance of the MongoDB Daemon running

3. Run `gulp serve` to start the development server. It should automatically open the client in your browser when ready.
