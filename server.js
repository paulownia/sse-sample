var http = require("http")
http.createServer(handler).listen(8124);

console.log("Started Server on port 8124");

var counter = 0;

function handler(req, res) {
	var url = require("url").parse(req.url);
	console.log(url);

	switch (url.pathname) {
		case "/":
			var fs = require("fs");
			var page = fs.readFileSync("index.html");
			res.writeHead(200, {"Content-type": "text/html; charset=utf-8"});
			res.write(page);
			res.end();
			break;

		case "/count":
			res.writeHead(200, {
					"Content-type": "text/event-stream"
			});
			setTimeout(function() {	
				res.write("data:" + counter++);
				res.end();
			}, (Math.random() * 9 + 1) * 1000);
			break;

		default:
			res.writeHead(404, {"Content-type": "text/plain"});
			res.write("Not Found");
			res.end();
			break;
	}
}

