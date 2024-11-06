"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// load express server
var express_1 = __importDefault(require("express"));
// load body-parser
var body_parser_1 = __importDefault(require("body-parser"));
// load cors
var cors_1 = __importDefault(require("cors"));
// load mysql
var mysql_1 = __importDefault(require("mysql"));
// create express app
var app = (0, express_1.default)();
// setup the server port
var port = process.env.PORT || 5000;
// parse request data content type application/x-www-form-rulencoded
app.use(body_parser_1.default.urlencoded({ extended: false }));
// parse request data content type application/json
app.use(body_parser_1.default.json());
// enable cors
app.use((0, cors_1.default)());
// define root route
app.get('/', function (req, res) {
    res.send('Hello World!');
});
// listen to the port
app.listen(port, function () {
    console.log("Server running on port ".concat(port));
});
// create connection to the database
var db = mysql_1.default.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'snake_game' // use from .env file
});
// connect to database
db.connect(function (err) {
    if (err) {
        console.log('There is an error connecting to database. Aborting');
        throw err;
    }
    console.log('Connected to database');
});
