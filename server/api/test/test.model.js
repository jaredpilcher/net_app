'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './test.events';

var TestSchema = new mongoose.Schema({
  client_ip: String,
  server_ip: String,
  forward_bandwidth: String,
  reverse_bandwidth: String,
  success:   Boolean,
  timestamp: String,
  message: String
});

registerEvents(TestSchema);
export default mongoose.model('Test', TestSchema);
