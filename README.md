# node-auth-api

This is a simple template for a REST-API which provides basic authentication functionality. It uses the JWT login strategy. ExpressJS is used for handling the API calls, BCryptJS and PassportJS provide authentication and MongoDB is used for storing user data.

Refer `routes.js` to check and modify the API endpoints.

## Usage
* Create a file name `db.js` in the `config` folder.
* Add the following code to the file
```javascript
module.exports = {
	database: '', //paste your MongoDB URI here.
	secret: '' //paste your db secret here.
}
```
* To start the server, run `npm start`

## Libraries
* [Express](https://expressjs.com)
* [Mongoose](https://mongoosejs.com)
* [BCryptJS](https://www.npmjs.com/package/bcryptjs)
* [PassportJS](https://passportjs.org)
* [JSONWebToken](https://jwt.io)

## License
This project is licensed under the [MIT License](https://github.com/MJ10/node-auth-api/blob/master/LICENSE.md).
