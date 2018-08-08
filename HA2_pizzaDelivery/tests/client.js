const https = require('https');
const StringDecoder = require('string_decoder').StringDecoder;
const jsonparse = require('../node_modules/jsonparse');


function Request(body={}) {
	this.bodyString = JSON.stringify(body);
	this.setDetail = function ({method, endpoint, headers={}, token=''}) {
		headers['Content-Type'] = 'application/json';
		headers.token = token;
		headers['Content-Length'] = this.bodyString.length;

		this.detail = {
			hostname: 'localhost',
			rejectUnauthorized: false,
			port:3000,
			method,
			path: '/' + endpoint,
			headers
		}
		// console.log('Request: ', this.detail, this.bodyString);
		return this;
	}

	this.end = function(cb) {
		const req = https.request(this.detail, res => {
			const decoder = new StringDecoder('utf-8');
			let buffer = '';
			res.on('data', data => {
				buffer += decoder.write(data)
			});
			res.on('end', () => {
				buffer += decoder.end();
				cb(jsonparse(buffer));
			});
			// console.log(res.statusCode, buffer);
			// cb(buffer)
			// console.log('Response: ', res);
		});

		req.on('error', err => console.log('Response error: ', err));
		req.write(this.bodyString);
		req.end();
	}
}

// function detail

const m_user = {
	post: function post_user({email, password, firstname, lastname, address}) {
		return new Promise(function(resolve, reject) {
			new Request({email, password, firstname, lastname, address}).setDetail({
				method: 'POST',
				endpoint: 'users',
			}).end(resolve);

		});
	},

	get: function get_user(token) {
		return new Promise(function(resolve, reject) {
			new Request().setDetail({
				method: 'GET',
				endpoint: 'users',
				token,
			}).end(resolve);

		});
	},

	put: function put_user(token, {firstname, lastname, address, password}) {
		return new Promise(function(resolve, reject) {
			new Request({firstname, lastname, address, password}).setDetail({
				method: 'PUT',
				endpoint: 'users',
				token,
			}).end(resolve);

		});
	},

	delete: function delete_user(token) {
		return new Promise(function(resolve, reject) {
			new Request().setDetail({
				method: 'DELETE',
				endpoint: 'users',
				token,
			}).end(resolve);

		});
	},

};

const m_token = {
	post: function post_token({email, password}) {
		return new Promise(function(resolve, reject) {
			new Request({email, password}).setDetail({
				method: 'POST',
				endpoint: 'tokens',
			}).end(resolve);

		});
	},

	get: function get_token(token) {
		return new Promise(function(resolve, reject) {
			new Request().setDetail({
				method: 'GET',
				endpoint: 'tokens',
				token,
			}).end(resolve);

		});
	},

	put: function put_token(token) {
		return new Promise(function(resolve, reject) {
			new Request().setDetail({
				method: 'PUT',
				endpoint: 'tokens',
				token,
			}).end(resolve);

		});
	},

	delete: function delete_token(token) {
		return new Promise(function(resolve, reject) {
			new Request().setDetail({
				method: 'DELETE',
				endpoint: 'tokens',
				token,
			}).end(resolve);

		});
	},

};




function sleep(ms) {
	return new Promise(function(resolve, reject) {
		setTimeout(resolve, ms);
	});
}

async function request(f, ...args) {
	const rep = await f(...args);
	console.log(f.name, rep);
	await sleep(2000);
	return rep;
}


async function test() {
	const userdata = {
		email:'hy.pepito@kddk.comm',
		password: 'azerty',
		firstname: 'toto',
		lastname:'foo',
		address: '204, bar street',
	}
	let token;

	//user post
	await request(m_user.post, userdata);

	// token post (login)
	({token} = await request(m_token.post, userdata));

	// token get
	await request(m_token.get, token);

	// user get
	await request(m_user.get, token);

	// token get (to see that any action push the expiration date forward)
	await request(m_token.get, token);

	// token delete (logout)
	await request(m_token.delete, token);

	// user put (should get an error)
	await request(m_user.put, token, {firstname:'titou'});

	// token post ((re)login)
	({token} = await request(m_token.post, userdata));

	// user put (ok this time)
	await request(m_user.put, token, {firstname:'titou'});

	// token put (just push the expiration date)
	await request(m_token.put, token);

	// user get
	await request(m_user.get, token);

	// token get
	await request(m_token.get, token);

	// user delete
	await request(m_user.delete, token);

	// token get (should return an error)
	await request(m_token.get, token);

}

test();
