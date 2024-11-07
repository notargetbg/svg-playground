// load mysql connection
import mysql from 'mysql';

function logErrorMessage(value: string): void {
	console.log(`Error: ${value} is not set. Aborting and will not attempt to connect to database.`);
}
// create connection to the database
let db: mysql.Connection;

function createConnection() {
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

	try	{
		db = mysql.createConnection({
			host: dbHost,
			user: dbUser,
			password: dbPassword,
			database: dbName
		});
	} catch (err) {
		console.log('Error connecting to database. Aborting');
		throw err;
	}
}

// connect to database
// db.connect((err) => {
// 	if (err) {
// 		console.log('There is an error connecting to database. Aborting');
// 		throw err;
// 	}
// 	console.log('Connected to database');
// });

export { db, createConnection };