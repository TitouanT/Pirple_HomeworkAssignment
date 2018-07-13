// dependencies
const http = require('http');
const url = require('url');
const config = require('./config');

// creation of the server
const server = http.createServer((req, res) => {
	// parsing of the url
	const parseQueryString = false; // queryString parameters are not needed
	const parsedURL = url.parse(req.url, parseQueryString);

	// extracting and cleaning the path of unwanted '/'
	const path = parsedURL.pathname.replace(/^\/+|\/+$/g,'');

	// extraction of the http method
	const method = req.method.toLowerCase();

	// choice of the handler and construction of the data object that we will pass to it
	const choosenHandler = router[path] ? router[path] : handlers.notFound;
	const data = {method, path};

	choosenHandler(data, (code=200, payload={}) => {
		// creation of the json string equivalent to the payload
		const payloadStr = JSON.stringify(payload) + '\n'; // the end of line is there so it is well displayed on every terminal

		// return the response
		res.setHeader('Content-Type', 'application/json');
		res.writeHead(code);
		res.end(payloadStr);

		//we log the communication in the server console
		console.log(`${method} request on '${path}' -> (${code})`, payload);
	});
});

// launching of the server
server.listen(config.port, () => console.log(`Http server listening on port ${config.port} in ${config.mode} mode`));

// this function choose how to greet the user
function greetUser() {
	const myMessageURL = 'https://pirple.thinkific.com/courses/take/the-nodejs-master-class/discussion/question/50095'
	const user = process.env.USER;

	if (user == 'root') return 'Hi! I must warn you that this server isn\'t intended to be executed as root, and therefor it shouldn\'t';
	else return `Hi ${user}! How are you today ? you can tell me there: ${myMessageURL}`;
}

// handlers obj
const handlers = {};


// the hello handler greet the user only if the post method is used
handlers.hello = (data, cb) => {
	if (data.method == "post") cb(200, {
		'handler_name' : 'hello',
		'responseCode' : '200',
		'message' : greetUser()
	});
	else handlers.notFound(data, cb);
}

// the error 404 landing handler
handlers.notFound = (data, cb) => {
	cb(404);
}

// the router is there to route the different paths to the corresponding handler
const router = {
	'hello' : handlers.hello
}
