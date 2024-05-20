"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const ProductController_1 = require("./controllers/ProductController");
const UserController_1 = require("./controllers/UserController");
const PageController_1 = require("./controllers/PageController");
const AdminController_1 = require("./controllers/AdminController");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const node_localstorage_1 = require("node-localstorage");
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = 5000;
    }
    start() {
        global.localStorage = new node_localstorage_1.LocalStorage('./storage');
        this.app.set('view engine', 'ejs');
        this.app.use(body_parser_1.default.urlencoded({ extended: false }));
        this.app.use('/public', express_1.default.static('public'));
        this.app.use(function (req, res, next) {
            res.locals.user = JSON.parse(localStorage.getItem('user') || '{"id": -1}');
            next();
        });
        this.app.get('/', new PageController_1.PageController().index);
        this.app.get('/shop', new PageController_1.PageController().shop);
        this.app.get('/register', new UserController_1.UserController().register);
        this.app.post('/register', new UserController_1.UserController().register);
        this.app.get('/login', new UserController_1.UserController().login);
        this.app.post('/login', new UserController_1.UserController().login);
        this.app.get('/logout', new UserController_1.UserController().logout);
        this.app.get('/cart', new ProductController_1.ProductController().cart);
        this.app.get('/cart/bill', new ProductController_1.ProductController().bill);
        this.app.get('/cart/completeCart', new ProductController_1.ProductController().completeCart);
        this.app.get('/cart/:id/:action', new ProductController_1.ProductController().updateCart);
        this.app.get('/product/detail/:id', new ProductController_1.ProductController().detail);
        this.app.post('/product/detail/:id', new ProductController_1.ProductController().addToCart);
        this.app.get('/admin', new PageController_1.PageController().admin);
        this.app.get('/admin/products', new AdminController_1.AdminController().products);
        this.app.get('/admin/detail/:id', new AdminController_1.AdminController().detail);
        this.app.post('/admin/detail/:id', new AdminController_1.AdminController().updateProduct);
        this.app.get('/admin/productCreate', new AdminController_1.AdminController().createGet);
        this.app.post('/admin/productCreate', new AdminController_1.AdminController().productCreate);
        this.app.get('/admin/:id/:action', new AdminController_1.AdminController().statusProduct);
        this.app.get('/admin/order/', new AdminController_1.AdminController().order);
        this.app.get('/admin/categories/', new AdminController_1.AdminController().categories);
        this.app.get('/admin/createCategories', new AdminController_1.AdminController().categoriesGet);
        this.app.post('/admin/createCategories', new AdminController_1.AdminController().addCategory);
        this.app.get('/admin/categories/:id/:action', new AdminController_1.AdminController().statusCategory);
        this.app.get('/admin/categories/:id/', new AdminController_1.AdminController().updateCategory);
        this.app.get('/admin/users/', new AdminController_1.AdminController().users);
        this.app.listen(this.port, () => {
            console.log(`Server running http://localhost:${this.port}`);
        });
    }
}
exports.Server = Server;
