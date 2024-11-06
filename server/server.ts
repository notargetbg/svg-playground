// load express server
import express from 'express';
// load body-parser
import bodyParser from 'body-parser';
// load cors
import cors from 'cors';
// load mysql
import mysql from 'mysql';

// create express app
const app = express();
// setup the server port
const port = process.env.PORT || 5000;

// parse request data content type application/x-www-form-rulencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse request data content type application/json
app.use(bodyParser.json());
// enable cors
app.use(cors());

// define root route
app.get('/', (req, res) => {
	res.send('Hello World!');
});

// listen to the port
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});

// create connection to the database
const db = mysql.createConnection({
	host: 'localhost', // use from .env file
	user: 'root', // use from .env file
	password: '', // use from .env file
	database: 'snake_game' // use from .env file
});

// connect to database
db.connect((err) => {
	if (err) {
		console.log('There is an error connecting to database. Aborting');
		throw err;
	}
	console.log('Connected to database');
});



