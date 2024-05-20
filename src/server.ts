import { ProductController } from './controllers/ProductController';
import { UserController } from './controllers/UserController';
import { PageController } from './controllers/PageController';
import { AdminController } from './controllers/AdminController';
import express, { NextFunction } from "express";
import bodyParser from "body-parser";
import { Request, Response } from 'express';
import { LocalStorage } from "node-localstorage";


export class Server {
    private app = express();
    private port: number = 5000;
    public start() {
        global.localStorage = new LocalStorage('./storage');

        this.app.set('view engine', 'ejs')
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use('/public', express.static('public'));

        this.app.use(function (req: Request, res: Response, next: NextFunction) {
            res.locals.user = JSON.parse(localStorage.getItem('user') || '{"id": -1}');
            next()
        })

        this.app.get('/', new PageController().index);
        this.app.get('/shop', new PageController().shop);
        this.app.get('/register', new UserController().register);
        this.app.post('/register', new UserController().register);
        this.app.get('/login', new UserController().login);
        this.app.post('/login', new UserController().login);
        this.app.get('/logout', new UserController().logout);
        this.app.get('/cart', new ProductController().cart);
        this.app.get('/cart/bill', new ProductController().bill);
        this.app.get('/cart/completeCart', new ProductController().completeCart);

        this.app.get('/cart/:id/:action', new ProductController().updateCart);


        this.app.get('/product/detail/:id', new ProductController().detail);
        this.app.post('/product/detail/:id', new ProductController().addToCart);
        this.app.get('/admin', new PageController().admin);
        this.app.get('/admin/products', new AdminController().products);
        this.app.get('/admin/detail/:id', new AdminController().detail);
        this.app.post('/admin/detail/:id', new AdminController().updateProduct);
        this.app.get('/admin/productCreate', new AdminController().createGet);
        this.app.post('/admin/productCreate', new AdminController().productCreate);
        this.app.get('/admin/:id/:action', new AdminController().statusProduct);
        this.app.get('/admin/order/', new AdminController().order);
        this.app.get('/admin/categories/', new AdminController().categories);
        this.app.get('/admin/createCategories', new AdminController().categoriesGet);
        this.app.post('/admin/createCategories', new AdminController().addCategory);
        this.app.get('/admin/categories/:id/:action', new AdminController().statusCategory);
        this.app.get('/admin/categories/:id/', new AdminController().updateCategory);
        this.app.get('/admin/users/', new AdminController().users);



        this.app.listen(this.port, () => {
            console.log(`Server running http://localhost:${this.port}`);
        });
    }
}