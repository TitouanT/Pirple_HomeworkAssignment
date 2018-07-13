# Hello World API

This is the first assignement, we have to build a REST API that returns a message in JSON format when ones *posts* a message to the route `/hello`

Since the server is intended to run on localhost, I will greet the user that runs it.

## you can test it with curl

we will first test it with POST and then with GET.

To test it you will need to launch it: `node index.js`

### POST requests

1. on /hello

`curl  -X POST http://localhost:3000/hello`

OR

`curl  -X POST http://localhost:3000/hello/`

should return a greeting message

2. on somthing else

`curl -X POST http://localhost:3000/foo`

should return code 404 (empty object on the client side)


### GET requests
on any path it should return an empty object

`curl  -X GET http://localhost:3000/hello`

OR

`curl  -X GET http://localhost:3000/hello/`

OR

`curl  -X GET http://localhost:3000/foo`
