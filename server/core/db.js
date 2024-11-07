"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConnection = exports.db = void 0;
// load mysql connection
var mysql_1 = __importDefault(require("mysql"));
function logErrorMessage(value) {
    console.log("Error: ".concat(value, " is not set. Aborting and will not attempt to connect to database."));
}
// create connection to the database
var db;
exports.db = db;
function createConnection() {
    var dbHost = process.env.DB_HOST;
    var dbUser = process.env.DB_USER;
    var dbPassword = process.env.DB_PASSWORD;
    var dbName = process.env.DB_NAME;
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
    try {
        exports.db = db = mysql_1.default.createConnection({
            host: dbHost,
            user: dbUser,
            password: dbPassword,
            database: dbName
        });
    }
    catch (err) {
        console.log('Error connecting to database. Aborting');
        throw err;
    }
}
exports.createConnection = createConnection;
