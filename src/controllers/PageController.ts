import { Request, Response } from 'express';
import { Product } from './../models/Product';

export class PageController {
    public async index(req: Request, res: Response) {
        let productsByDiscountTrue: Product[] = await Product.getAllProductsByDiscountTrue();
        let productsByDiscountFalse: Product[] = await Product.getAllProductsByDiscountFalse(8);
        res.render('page_index', { title: "Trang Chủ", productsByDiscountTrue, productsByDiscountFalse });
    }
    public async shop(req: Request, res: Response) {
        let getAllProducts = await Product.getAllProducts();
        let getAllCategories = await Product.getAllCategories();
        res.render('page_shop', { title: "Trang Shop", getAllProducts, getAllCategories });
    }
    public async admin(req: Request, res: Response) {
        res.render('page_admin', { title: "Trang Admin", currentUrl: '/admin' });
    }

}