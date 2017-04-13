import cmd from 'node-cmd';
import Test from './test.model';

/**
 * Parse the bandwidth from the results
 * @param results - the results from the performance test
 */
function parseBandwidth(results) {
    //parse bandwidth from results
    let bandwidth = results.match(/ (\d{0,9}(?:\.*\d{0,9})? Mbits\/sec) .*/);

    if(!Array.isArray(bandwidth)) {
        return false;
    }

    return bandwidth[1];
}

/**
 * save results data from performance test
 * @param forwardBandwidth - bandwidth from client to server
 * @param reverseBandwidth - bandwidth from server to client
 * @param clientIp - ip address for client
 * @param serverIp - ip address for server
 */
function saveResults(forwardBandwidth, reverseBandwidth, clientIp, serverIp, protocol){
    Test.create({
        server_ip: serverIp,
        client_ip: clientIp,
        forward_bandwidth: forwardBandwidth,
        reverse_bandwidth: reverseBandwidth,
        success: true,
        timestamp: getDateTime(),
        message: 'Test ran successfully',
        protocol: protocol
    });
}


/**
 * Get the the current timestamp
 */
function getDateTime(){
    let newDate = new Date();
    return newDate.toDateString() + " " + newDate.toLocaleTimeString();
}

/**
 * save a performance test that failed to execute
 * @param clientIp - the client ip address
 * @param serverIp - the server ip address
 * @param message - the message to save with the failure
 */
function saveFailure(clientIp, serverIp, message, protocol) {
    Test.create({
        server_ip: serverIp,
        client_ip: clientIp,
        success: false,
        timestamp: getDateTime(),
        message: message,
        protocol: protocol
    });
    console.log(message);
}

/**
 * perform performance test
 * @param serverIp - the server ip address
 * @param clientIp - the server ip address
 * @param protocol - transport layer protocol
 */
export default function runTest(clientIp, serverIp, protocol) {
    //run the forward (client to server) performance test command
    let forwardTestCommand = null;
    if(protocol == 'tcp') {
        forwardTestCommand = 'iperf3 -c ' + serverIp + ' -B ' + clientIp + ' -f m -t 10 -i 30 -N -S 0x08 -w 223k';
    } else { //run UDP test
        forwardTestCommand = 'iperf3 -c ' + serverIp + ' -B ' + clientIp + ' -f m -t 10 -S 0x08 -w 223k -b 200m -u';
    }
    console.log('running forward performance test: ' + forwardTestCommand);
    cmd.get(
        forwardTestCommand,
        function(forwardTestResults) {
            if(!forwardTestResults) {
                saveFailure(clientIp, serverIp, 'Test did not run. Please verify the IP addresses are accessible from the web server.', protocol);
                return;
            }

            let forwardBandwidth = parseBandwidth(forwardTestResults);
            if(!forwardBandwidth) {
                saveFailure(clientIp, serverIp, 'Client to Server test did not return results correctly. Please try again.', protocol);
                return;
            }

            let reverseTestCommand = forwardTestCommand + " -R";
            console.log('running reverse performance test: ' + reverseTestCommand);
            cmd.get(
                reverseTestCommand,
                function(reverseTestResults) {
                    let reverseBandwidth = parseBandwidth(reverseTestResults);
                    if(!reverseBandwidth) {
                        saveFailure(clientIp, serverIp, 'Server to Client test did not return results correctly. Please try again.', protocol);
                        return;
                    }
                    saveResults(forwardBandwidth, reverseBandwidth, clientIp, serverIp, protocol);
                    console.log('test ran successfully');
                }
            )
        }
    );
}