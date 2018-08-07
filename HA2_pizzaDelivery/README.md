# Assignement 2: Pizza delivery

# example of usage:

```sh

# creation of a user:
curl -k -X POST https://localhost:3000/users -d '{"firstname":"Paul", "lastname":"Dumont", "email":"paul.dumont@gmail.com", "password":"1234", "address":"29 St James street, London"}'

# login (take a token)
curl -k -X POST https://localhost:3000/tokens -d '{"email":"paul.dumont@gmail.com", "password":"1234"}'


```
