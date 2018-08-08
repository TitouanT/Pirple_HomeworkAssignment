/*
*
* Main file of the pizza delivery service
*
*/


//dependencies
const https = require('https');
const url = require('url');
const config = require('config');
const jsonparse = require('jsonparse');
const terminal = require('terminal');
const StringDecoder = require('string_decoder').StringDecoder;
const fs = require('fs');
const debug = require('util').debuglog(__filename.split('/').splice(-1,1)[0].replace('.js', '')); // launch with 'NODE_DEBUG=index node index.js' to see logs
const handlers = require('handlers/handlers');


const router = {
	'ping': handlers.ping,
	'users': handlers.users,
	'tokens': handlers.tokens,
};


// instanciating the https server
const httpsServerOptions = {
	'key'  : fs.readFileSync(`${__dirname}/https/key.pem`),
	'cert' : fs.readFileSync(`${__dirname}/https/cert.pem`)
};
const server = https.createServer(httpsServerOptions, (req, res) => {

	// parse the url and parse the query string
	const parseQueryString = true;
	const parsedUrl = url.parse(req.url, parseQueryString);

	// get the path
	const trimmedPath = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');

	// get the query string (it is already parsed)
	const query = parsedUrl.query;

	// get the http method
	const method = req.method.toLowerCase(); //is it really useful ?

	// get the headers
	const headers = req.headers;

	// get the payload (body of the request)
	const decoder = new StringDecoder('utf8');
	let buffer = '';

	req.on('data', data => buffer += decoder.write(data));

	req.on('end', () => {
		const body = jsonparse(buffer + decoder.end());

		// choose the handler
		const handler = router[trimmedPath] === undefined ? handlers.notFound : router[trimmedPath];

		// data needed by the handler
		const data = {
			method,
			headers,
			trimmedPath,
			query,
			body,
		};
		res.setHeader('Content-Type', 'application/json');


		// handlers.notFound(data).catch(err => {
		// 	res.writeHead(404);
		// 	res.end('hey');
		// 	// res.end(JSON.stringify(err.getClient()));
		// 	console.log(err);
		// 	console.log(err.getClient());
		// });

		handler(data)
		.then((body={}) => {
			body.code = 200;
			const bodyString = JSON.stringify(body) + '\n';

			// return the response
			res.writeHead(body.code);
			res.end(bodyString);

			debug(terminal.escape(`${parsedUrl.path}`, terminal.color.green) + ` -> 200 ${bodyString}`);
		})
		.catch(err => {
			const clientErr = err.getClient();
			const bodyString = JSON.stringify(clientErr);

			res.writeHead(clientErr.code);
			res.end(bodyString);
			debug(terminal.escape('HANDLER ERROR: ', terminal.color.red) + `${parsedUrl.path} -> ${JSON.stringify(err.getSys())}`);
		});
	});
});



// declare the application
const app = {};

// the main is the first function to be executed by the application
app.main = () => {
	console.log(terminal.escape(`application starting in ${config.name} mode`, terminal.color.green));
	server.listen(config.port, () => console.log(terminal.escape(`HTTPS server listening at ${config.port}`, terminal.color.green)));
}

// start the app
app.main();
