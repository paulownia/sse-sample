var events = require("events");

var emitter = new events.EventEmitter();

emitter.id = 0;
emitter.data = "";
emitter.start = function() {
	var self = this;
	setInterval(function() {
		var chars = "abcdefghijklmnopqrstuvwxyz";
		var pos = Math.floor(Math.random() * 100); 
		if (pos < chars.length) {
			self.id++;
			self.data = chars.charAt(pos);
			self.emit("generated", self.id, self.data);
		}
	}, 2000);
};

module.exports = emitter; 
