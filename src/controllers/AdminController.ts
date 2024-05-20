import { log } from 'console';
import { Order } from '../models/Order';
import { Product } from './../models/Product';
import { Request, Response } from 'express';

import multer from 'multer';
import { User } from '../models/User';
import { Category } from '../models/Category';
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/imges/products')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
var upload = multer({ storage: storage })
export class AdminController {
    public async products(req: Request, res: Response) {
        let getAllProducts = await Product.getAllProducts();

        res.render('page_admin_products', { title: "Trang Admin - Sản Phẩm", getAllProducts, currentUrl: '/products' });
    }

    public async detail(req: Request, res: Response) {
        let id: string = req.params.id;
        let detailProduct = await Product.getProductById(id);
        let categoriesValue = await Product.getAllCategories();
        res.render('page_admin_detail', { title: "Trang Admin - Chi tiết sản phẩm", detailProduct, categoriesValue, currentUrl: '/products' });
    }

    public async updateProduct(req: Request, res: Response) {
        const id: string = req.params.id;
        let detailProduct = await Product.getProductById(id);
        let categoriesValue = await Product.getAllCategories();

        const updatedProductData = {
            name: req.body.name,
            brand: Number(req.body.brand),
            price: Number(req.body.price),
            description: req.body.description,
        };

        // Kiểm tra xem các trường dữ liệu có tồn tại không
        if (req.body.name && req.body.price && req.body.brand && req.body.description) {
            await Product.updateProduct(id, updatedProductData);
            res.redirect('/admin/products');
        } else {
            res.render('page_admin_detail', {
                title: "Trang Admin - Chi tiết sản phẩm",
                detailProduct,
                categoriesValue,
                currentUrl: '/products',
                message: 'Vui lòng điền đầy đủ thông tin sản phẩm'
            });
        }
    }


    public async createGet(req: Request, res: Response) {
        let categoriesValue = await Product.getAllCategories();
        res.render('page_admin_create-products', {
            title: "Trang Admin - Tạo sản phẩm",
            categoriesValue,
            currentUrl: '/products',
            message: ''
        });
    }
    public async productCreate(req: Request, res: Response) {
        upload.single('fileImg')(req, res, async function (err: any) {
            if (err) {
                console.error(err);
                return res.status(500).send('Error uploading file');
            }
            let categoriesValue = await Product.getAllCategories();
            let name: string = req.body.name
            let price: number = Number(req.body.price);
            let brand: number = Number(req.body.brand);
            let description: string = req.body.description;
            let selectedBrand: number = Number(req.body.brand);
            let image = req.file ? req.file.filename : '';
            let product = new Product(name, price, selectedBrand, image, description, false);
            let message: string = "";
            
            if (!name || !price || !description || isNaN(brand)) { 
                message = "Vui lòng nhập đầy đủ thông tin";
                return res.render('page_admin_create-products', {
                    title: "Trang Admin - Tạo sản phẩm",
                    categoriesValue,
                    currentUrl: '/products',
                    message
                });
            }
    
            try {
                if (await product.createProduct()) {
                    return res.redirect('/admin/products');
                } else {
                    message = "Tạo sản phẩm thất bại";
                }
            } catch (error) {
                console.error("Error creating product:", error);
                message = "Đã xảy ra lỗi khi tạo sản phẩm";
            }
    
            res.render('page_admin_create-products', {
                title: "Trang Admin - Tạo sản phẩm",
                categoriesValue,
                currentUrl: '/products',
                message
            });
        });
    }
    
    public async statusProduct(req: Request, res: Response) {
        let id = req.params.id;
        let action = req.params.action;

        if (action === 'delete') {
            try {
                await Product.deleteProduct(id);
                res.redirect('/admin/products');
            } catch (error) {
                console.error('Error deleting product:', error);
                res.status(500).send('Error deleting product');
            }
        } else {
            res.status(400).send('Invalid action');
        }
    }

    public async order(req: Request, res: Response) {
        try {
            const orders = await Order.showOrder(); 
            for (const order of orders) {
                const userId: string = order.id_user || ''; 
                const user = await User.getUserById(userId); 
                if (user) {
                    order.id_user = user.name; 
                }
            }
    
            res.render('page_admin_order', { title: 'Trang Admin - Giỏ Hàng', currentUrl: '/order', orders });
        } catch (error) {
            console.error('Error fetching orders:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    public async categories(req: Request, res: Response) {
        let getCategories = await Product.getAllCategories();
        let getAllProducts = await Product.getAllProducts();
        res.render('page_admin_categories', { title: "Trang Admin - Danh Mục", currentUrl: '/categories', getCategories, getAllProducts });
    }
    public async users(req: Request, res: Response) {
        res.render('page_admin_categories', { title: "Trang Admin - Users", currentUrl: '/users', });
    }

    public async categoriesGet(req: Request, res: Response) {
        res.render('page_admin_categories-add', { title: "Trang Admin - Tạo Danh Mục", currentUrl: '/categories', message: '' })
    }

    public async addCategory(req: Request, res: Response) {
        let idCategory: number = Number(req.body.idCategory);
        let name: string = req.body.name;
        let message: string = '';

        if (idCategory && name) {
            const existingCategory = await Category.checkIdCategory(idCategory);
            if (existingCategory) {
                message = "Danh mục này đã tồn tại";
            } else {
                let newCategory = new Category(idCategory, name)
                console.log(newCategory);
                const category = await newCategory.createCategory();
                if (category) {
                    res.redirect('/admin/categories');
                    return;
                } else {
                    message = "Tạo danh mục thất bại";
                }
            }
        } else {
            message = 'Vui lòng nhập đầy đủ thông tin';
        }

        res.render('page_admin_categories-add', { title: "Trang Admin - Tạo Danh Mục", currentUrl: '/categories', message });
    }

    public async statusCategory(req: Request, res: Response) {
        let id = req.params.id;
        let action = req.params.action;
        if (action === 'delete') {
            try {
                await Category.deleteCategory(id);
                res.redirect('/admin/categories');
            } catch (error) {
                console.error('Error deleting product:', error);
                res.status(500).send('Error deleting product');
            }
        } else {
            res.status(400).send('Invalid action');
        }
    }

    public async updateCategory(req: Request, res: Response) {
        let id: string = req.params.id;

    }
}



