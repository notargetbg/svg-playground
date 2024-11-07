// load express server
import express from 'express';
// load body-parser
import bodyParser from 'body-parser';
// load cors
import cors from 'cors';
// load mysql
import mysql from 'mysql';
// Add dotenv
import dotenv from 'dotenv';
dotenv.config();

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

function logErrorMessage(value: string): void {
	console.log(`Error: ${value} is not set. Aborting and will not attempt to connect to database.`);
}

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;


if (!dbHost) {
	logErrorMessage('DB_HOST');
	process.exit(1);
}

if (!dbUser) {
	logErrorMessage('DB_USER');
	process.exit(1);
}

if (!dbName) {
	logErrorMessage('DB_NAME');
	process.exit(1);
}

// create connection to the database
const db = mysql.createConnection({
	host: dbHost,
	user: dbUser,
	password: dbPassword,
	database: dbName
});

// connect to database
db.connect((err) => {
	if (err) {
		console.log('There is an error connecting to database. Aborting');
		throw err;
	}
	console.log('Connected to database');
});



