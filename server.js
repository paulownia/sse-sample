var http = require("http")
http.createServer(handler).listen(8124);

console.log("Started Server on port 8124");

var events = require("events");
var emitter = new events.EventEmitter();

var id = 0;
var data = 'a';
setInterval(function() {
	var chars = "abcdefghijklmnopqrstuvwxyz";
	var pos = Math.floor(Math.random() * 100); 
	if (pos < chars.length) {
		id++;
		data = chars.charAt(pos);

		console.log("emit event, id=" + id + " data=" + data);
		emitter.emit("genNewChar", id, data);
	}
}, 2000);



function handler(req, res) {
	if (req.headers["accept"] && req.headers["accept"] == "text/event-stream") {

		function response(id, data) {
			res.writeHead(200, {
				"Content-type": "text/event-stream",
				"Last-Event-ID": id
			});
			res.write("id:" + id + "\n");
			res.write("data:" + data + "\n");
			res.write("retry: 1000");
			res.end()
		}

		if (!req.headers["last-event-id"] || req.headers["last-event-id"] != id) {
			response(id, data);	
		}
		emitter.on("genNewChar", response);

	} else {
		
		var fs = require("fs");
		var page = fs.readFileSync("index.html");
		res.writeHead(200, {"Content-type": "text/html; charset=utf-8"});
		res.write(page);
		res.end();
	}
}

