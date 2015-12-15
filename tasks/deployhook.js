const http = require('http'),
	exec = require('child_process').exec,
	PORT=7373; 

var deploylock = false;

function handleRequest(req, res){
	var fullBody = '';
    req.on('data', (chunk) => {
      fullBody += chunk.toString();
    });   
    req.on('end', () => {
	    var body = JSON.parse(fullBody);
	    console.log(body);
	    if ( !deploylock && body["ref"] == "refs/heads/master" ) {
			deploylock = true;
			exec('./tasks/deploy.sh', (error, stdio, stderr) => {
				if (error) console.log(error);
				console.log("IO:", stdio, "\nERR:", stderr);
				setTimeout( () => {
					deploylock = false;
				}, 1000);
			});
		}	    
    });
	res.end('ok');
}
var server = http
	.createServer(handleRequest)
	.listen(PORT, () => {
	    console.log("Server listening on: http://localhost:%s", PORT);
	});