"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = require("express");
const body_parser_1 = require("body-parser");
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = 5000;
    }
    start() {
        this.app.set('view engine', 'ejs');
        this.app.use(body_parser_1.default.urlencoded({ extends: false }));
        this.app.use('/public', express_1.default.static('public'));
        this.app.get('/', new PageController().index);
        this.app.get('/register', new UserController().register);
        this.app.get('/login', new UserController().login);
        this.app.post('/login', new UserController().login);
        this.app.get('/product/:id', new ProductController().index);
        this.app.listen(this.port, () => {
            console.log(`Server running https://localhost:${this.port}`);
        });
    }
}
exports.Server = Server;
