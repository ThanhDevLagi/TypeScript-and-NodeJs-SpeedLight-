"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const Order_1 = require("../models/Order");
const Product_1 = require("./../models/Product");
const multer_1 = __importDefault(require("multer"));
const User_1 = require("../models/User");
const Category_1 = require("../models/Category");
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/imges/products');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
var upload = (0, multer_1.default)({ storage: storage });
class AdminController {
    products(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let getAllProducts = yield Product_1.Product.getAllProducts();
            res.render('page_admin_products', { title: "Trang Admin - Sản Phẩm", getAllProducts, currentUrl: '/products' });
        });
    }
    detail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req.params.id;
            let detailProduct = yield Product_1.Product.getProductById(id);
            let categoriesValue = yield Product_1.Product.getAllCategories();
            res.render('page_admin_detail', { title: "Trang Admin - Chi tiết sản phẩm", detailProduct, categoriesValue, currentUrl: '/products' });
        });
    }
    updateProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            let detailProduct = yield Product_1.Product.getProductById(id);
            let categoriesValue = yield Product_1.Product.getAllCategories();
            const updatedProductData = {
                name: req.body.name,
                brand: Number(req.body.brand),
                price: Number(req.body.price),
                description: req.body.description,
            };
            if (req.body.name && req.body.price && req.body.brand && req.body.description) {
                yield Product_1.Product.updateProduct(id, updatedProductData);
                res.redirect('/admin/products');
            }
            else {
                res.render('page_admin_detail', {
                    title: "Trang Admin - Chi tiết sản phẩm",
                    detailProduct,
                    categoriesValue,
                    currentUrl: '/products',
                    message: 'Vui lòng điền đầy đủ thông tin sản phẩm'
                });
            }
        });
    }
    createGet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let categoriesValue = yield Product_1.Product.getAllCategories();
            res.render('page_admin_create-products', {
                title: "Trang Admin - Tạo sản phẩm",
                categoriesValue,
                currentUrl: '/products',
                message: ''
            });
        });
    }
    productCreate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            upload.single('fileImg')(req, res, function (err) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Error uploading file');
                    }
                    let categoriesValue = yield Product_1.Product.getAllCategories();
                    let name = req.body.name;
                    let price = Number(req.body.price);
                    let brand = Number(req.body.brand);
                    let description = req.body.description;
                    let selectedBrand = Number(req.body.brand);
                    let image = req.file ? req.file.filename : '';
                    let product = new Product_1.Product(name, price, selectedBrand, image, description, false);
                    let message = "";
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
                        if (yield product.createProduct()) {
                            return res.redirect('/admin/products');
                        }
                        else {
                            message = "Tạo sản phẩm thất bại";
                        }
                    }
                    catch (error) {
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
            });
        });
    }
    statusProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req.params.id;
            let action = req.params.action;
            if (action === 'delete') {
                try {
                    yield Product_1.Product.deleteProduct(id);
                    res.redirect('/admin/products');
                }
                catch (error) {
                    console.error('Error deleting product:', error);
                    res.status(500).send('Error deleting product');
                }
            }
            else {
                res.status(400).send('Invalid action');
            }
        });
    }
    order(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield Order_1.Order.showOrder();
                for (const order of orders) {
                    const userId = order.id_user || '';
                    const user = yield User_1.User.getUserById(userId);
                    if (user) {
                        order.id_user = user.name;
                    }
                }
                res.render('page_admin_order', { title: 'Trang Admin - Giỏ Hàng', currentUrl: '/order', orders });
            }
            catch (error) {
                console.error('Error fetching orders:', error);
                res.status(500).send('Internal Server Error');
            }
        });
    }
    categories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let getCategories = yield Product_1.Product.getAllCategories();
            let getAllProducts = yield Product_1.Product.getAllProducts();
            res.render('page_admin_categories', { title: "Trang Admin - Danh Mục", currentUrl: '/categories', getCategories, getAllProducts });
        });
    }
    users(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.render('page_admin_categories', { title: "Trang Admin - Users", currentUrl: '/users', });
        });
    }
    categoriesGet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.render('page_admin_categories-add', { title: "Trang Admin - Tạo Danh Mục", currentUrl: '/categories', message: '' });
        });
    }
    addCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let idCategory = Number(req.body.idCategory);
            let name = req.body.name;
            let message = '';
            if (idCategory && name) {
                const existingCategory = yield Category_1.Category.checkIdCategory(idCategory);
                if (existingCategory) {
                    message = "Danh mục này đã tồn tại";
                }
                else {
                    let newCategory = new Category_1.Category(idCategory, name);
                    console.log(newCategory);
                    const category = yield newCategory.createCategory();
                    if (category) {
                        res.redirect('/admin/categories');
                        return;
                    }
                    else {
                        message = "Tạo danh mục thất bại";
                    }
                }
            }
            else {
                message = 'Vui lòng nhập đầy đủ thông tin';
            }
            res.render('page_admin_categories-add', { title: "Trang Admin - Tạo Danh Mục", currentUrl: '/categories', message });
        });
    }
    statusCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req.params.id;
            let action = req.params.action;
            if (action === 'delete') {
                try {
                    yield Category_1.Category.deleteCategory(id);
                    res.redirect('/admin/categories');
                }
                catch (error) {
                    console.error('Error deleting product:', error);
                    res.status(500).send('Error deleting product');
                }
            }
            else {
                res.status(400).send('Invalid action');
            }
        });
    }
    updateCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req.params.id;
        });
    }
}
exports.AdminController = AdminController;
