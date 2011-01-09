var http = require("http")
http.createServer(handler).listen(8124);

console.log("Started Server on port 8124");

var generator = require("./generator");
generator.on("generated", function(id, data) {
	console.log("emit event, id=" + id + " data=" + data);
});
generator.start();

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

		if (!req.headers["last-event-id"] || req.headers["last-event-id"] != generator.id) {
			response(generator.id, generator.data);	
		}
		generator.on("generated", response);

	} else {
		
		var fs = require("fs");
		var page = fs.readFileSync("index.html");
		res.writeHead(200, {"Content-type": "text/html; charset=utf-8"});
		res.write(page);
		res.end();
	}
}

