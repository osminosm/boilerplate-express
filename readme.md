# Express Boilerplate

Backend Webservice for Brandt Time Applications Smart TV (Updater).

## System Requirements

1. NodeJS
2. MongoDB Server

## Running the server

0. install dependencies
`npm install`

1. build and run for production:
`npm run build && node ./dist/app.js`

2. run in dev mode:
`npm start`

3. generate data for development and testing
`npm run populatedb` , to remove the generated data :
`npm run cleandb` or an alias to do both `npm run cleanpopulate`

A combined alias of the two previous commands `npm run cleanpopulate`

## Configuration
### The config file:
This is the main server configuration containing:
```
{
  serverConfig: {
    host: 'localhost',
    port: 8080,
    useHttps: false // optional
  },
  dbConfig: { 
    host: 'localhost',
    dbName : 'brandt-db'

    /** optional params **/
    username:'johndoe',
    password:'pass123',
    port: 27017,
    hosts:[ 'host0:port0', 'host1', 'johndoe:pass123@host3' ]
    // more to come dbOptions for replica sets etc...
  },
  jwtSecret: '<app-jwt-secret>', // used for signing and verifying JWTs
  bcryptSaltWorkFactor: 10, // Password Hashing Factor
  morganLogMode: 'dev', // can be 'dev' or 'combined' for apache style or any morgan format
}
```

Note: In production an external json config file can be used to override the above settings
```
node dist/app.js --configFile /home/user/.configs/server.json
```

### Dependencies

|Package Name|Version|License|Description|
|-|-|:-----:|-|
|bcrypt|^2.0.1|MIT|Password hashing and salting|
|body-parser|^1.18.3|MIT|Middleware Used for parsing HTTP Request body|
|cors|^2.8.4|MIT|Middleware to enable CORS|
|express|^4.16.3|MIT|Node JS REST Server framework|
|express-jwt|^5.3.1|MIT|Middleware to parse JWTs into user|
|express-jwt-permissions|^1.2.1|MIT|Middleware to authorize requests with permissions|
|jsonwebtoken|^8.3.0|MIT|Library to handle JWT Signing and validation|
|lodash|^4.17.10|MIT|Utility class|
|mongoose|^5.1.5|[Custom](https://github.com/cesanta/mongoose)|ODM interfacing MongoDB|
|node-args|^2.1.8|MIT|For parsing command line args|

### Dev Dependencies

|Package Name|Version|License|Description|
|-|-|:-----:|-|
|babel-cli|^6.26.0|MIT|Babel Transpiler Command Line|
|babel-core|^6.26.3|MIT|Babel Transpiler (to enable ES6 features)|
|babel-polyfill|^6.26.0|MIT|Babel plugin use async/await syntax and more...|
|babel-preset-env|^1.7.0|MIT|Babel preset|
|babel-preset-es2015|^6.24.1|MIT|Babel preset|
|babel-preset-stage-2|^6.24.1|MIT|Babel preset|
|chai|^4.1.2|MIT|Assertion Library|
|chai-http|^4.0.0|MIT|To make requests to server using chai|
|mocha|^5.2.0|MIT|Testing framework|
|mockgoose|^7.3.5|MIT|Mongoose Mock Library|
|morgan|^1.9.0|MIT|Logging library|
|nodemon|^1.17.5|MIT|Reruns app on save during development|


---
## API Reference
### Authentication
#### With Username and Password

Request:

``` 
> POST /auth/token { username:"user123", password:"12345" }
< 200 {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVHlwZSI6ImFjY291bnQiLCJkYXRhI....."
}
```

### Users Managment 

List Users [ requires permission : `users:read` ]
```
> GET /users
```

Create User [ requires permission : `users:write` ]
``` 
> POST /users { 
    username: "johndoe", 
    password: "abc12345!", 
    permissions: "res0:read res0:write res1:read" // optional
}
```

Edit user by username [ requires permission : `users:write` ]

Note : `username` and `password` fields are not editable.
```
> PUT /users/:username {
    permissions: "res4:read"
}
```

Delete user by username [ requires permission : `users:write` ]

Note : ``username`` and ``confirmUsername`` should be identical as a validation measure
```
> DELETE /users {
    username: 'johndoe',
    confirmUsername: 'johndoe'
}
```


## Error Handling

All errors produced by the server are of the following format:
```
RESPONSE (status=404) {
    "error": {
        "code": "00000",
        "message": "404 Not Found"
    }
}
```

> HTTP Status Code : provides error information about the transport layer.

> Error Code : 5 digit String serving as an identifier for App Layer errors, defaulting to a "00000" in case of unhandled errors.

### Error codes refrence

1. 00000 : Unknown or unhandled errors

2. 01XXX : Authentication

3. 02XXX : App Managment

4. 03XXX : Updates

> Message : a String description of the error.

## Testing 

The project is using Mocha testing framework, and Chai assertion library. The test files are under the ``tests/`` directory, and are devided onto two categories ``tests/integration/`` and ``tests/units/`` respectively for integration and and unit tests.

Run Integration Tests :

```> npm run integration-tests```


Run Unit Tests :

```> npm run unit-tests```

Run Unit Tests in watch mode:

```> npm run unit-tests --watch```