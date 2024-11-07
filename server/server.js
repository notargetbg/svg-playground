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
var db_1 = require("./core/db");
// Add dotenv
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
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
(0, db_1.createConnection)();
// listen to the port
app.listen(port, function () {
    console.log("Server running on port ".concat(port));
});
