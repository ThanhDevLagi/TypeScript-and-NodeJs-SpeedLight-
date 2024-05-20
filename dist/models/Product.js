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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const database_1 = require("../database");
let DB = new database_1.Database();
class Product {
    constructor(name, price, brand, image, description, discount) {
        this.quantity = 0;
        this.name = name;
        this.price = price;
        this.brand = brand;
        this.image = image;
        this.description = description;
        this.discount = discount;
    }
    copy(product) {
        this.id = product.id;
        this.name = product.name;
        this.price = product.price;
        this.brand = product.brand;
        this.image = product.image;
        this.description = product.description;
        this.discount = product.discount;
        this.quantity = product.quantity;
    }
    static getAllProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            let products = yield DB.getData(`/products`);
            return products;
        });
    }
    static getAllProductsByDiscountTrue() {
        return __awaiter(this, void 0, void 0, function* () {
            const products = yield DB.getData('/products');
            const productsWithDiscount = products.filter((product) => product.discount === true);
            return productsWithDiscount.sort(() => Math.random() - 0.5);
        });
    }
    static getAllProductsByDiscountFalse(limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const products = yield DB.getData('/products');
            const productsWithoutDiscount = products.filter((product) => product.discount === false);
            const shuffledProducts = productsWithoutDiscount.sort(() => Math.random() - 0.5);
            return shuffledProducts.slice(0, limit);
        });
    }
    static getProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield DB.getData(`/products/${id}`);
            return product;
        });
    }
    static getAllCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            let categories = yield DB.getData(`/categories`);
            return categories;
        });
    }
    createProduct() {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield DB.insertData(`/products`, this);
            console.log(data);
            return data;
        });
    }
    static deleteProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield DB.deleteData(`/products/${id}`);
            return data;
        });
    }
    static updateProduct(id, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield DB.updateData(`/products/${id}`, obj);
            console.log(data);
            return data;
        });
    }
}
exports.Product = Product;