const users = require('user');

const userdata = {
	email:'alib@ba.com',
	firstname:'ali',
	lastname:'baba',
	password:'qsdf',
	address:'disney',
}

function logtest(err, user) {
	console.log('error:');
	console.log(err);
	console.log(user.data());
}

async function test() {
	// creation test
	try {
		const user = await users.create(userdata);
		console.log(user);
	}
	catch (err) {console.log('ERROR: ', err);}
	console.log('m1');

	// auth test
	try {
		const token = await users.login(userdata.email, userdata.password);
		console.log(token.data(), token.id());
	}
	catch (err) {console.log('ERROR: ', err);}
	console.log('m2');

	//lookup test
	// try {
	// 	console.log(userdata.email);
	// 	const user = await users.lookup(userdata.email);
	// 	console.log(user);
	// }
	// catch (err) {console.log('ERROR: ', err);}
	// console.log('m3');

}

test();
