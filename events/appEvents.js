const EventEmitter = require('events');
const appEvents = new EventEmitter();

appEvents.on('userRegistered', (user) => {
  console.log(`[event] New user registered: ${user.username}`);
});
appEvents.on('userLoggedIn', (user) => {
  console.log(`[event] User logged in: ${user.email}`);
});
appEvents.on('noteCreated', (note) => {
  console.log(`[event] Note created: "${note.title}"`);
});

module.exports = appEvents;