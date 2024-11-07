// load express server
import express from 'express';
// load body-parser
import bodyParser from 'body-parser';
// load cors
import cors from 'cors';

import { db, createConnection } from './core/db';
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

createConnection();

// listen to the port
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});

