// object that will contain all the possible environements for this application
const environements = {}


// the production environement
environements.production = {
	'port': 5000,
	'mode': 'production'
}

// the developpement environement, we will default to this one
environements.staging = {
	'port': 3000,
	'mode': 'staging'
}

// if it exist in the environement variables, we take it otherwise we put an empty string.
const paramEnv = process.env.NODE_ENV ? process.env.NODE_ENV.toLowerCase() : '';

// if the paramEnv describes an existing environements we choose it, otherwise it defaults to staging
const chosenEnv = environements[paramEnv] ? environements[paramEnv] : environements.staging;


// then we export the choosen environement
module.exports = chosenEnv;
