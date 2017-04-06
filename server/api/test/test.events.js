/**
 * Test model events
 */

'use strict';

import {EventEmitter} from 'events';
var TestEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
TestEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Test) {
  for(var e in events) {
    let event = events[e];
    Test.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    TestEvents.emit(event + ':' + doc._id, doc);
    TestEvents.emit(event, doc);
  };
}

export {registerEvents};
export default TestEvents;
