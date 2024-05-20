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
exports.PageController = void 0;
const Product_1 = require("./../models/Product");
class PageController {
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let productsByDiscountTrue = yield Product_1.Product.getAllProductsByDiscountTrue();
            let productsByDiscountFalse = yield Product_1.Product.getAllProductsByDiscountFalse(8);
            res.render('page_index', { title: "Trang Chủ", productsByDiscountTrue, productsByDiscountFalse });
        });
    }
    shop(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let getAllProducts = yield Product_1.Product.getAllProducts();
            let getAllCategories = yield Product_1.Product.getAllCategories();
            res.render('page_shop', { title: "Trang Shop", getAllProducts, getAllCategories });
        });
    }
    admin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.render('page_admin', { title: "Trang Admin", currentUrl: '/admin' });
        });
    }
}
exports.PageController = PageController;
