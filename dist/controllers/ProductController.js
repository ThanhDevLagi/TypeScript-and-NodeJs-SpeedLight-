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
exports.ProductController = void 0;
const Order_1 = require("../models/Order");
const Product_1 = require("./../models/Product");
class ProductController {
    detail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req.params.id;
            let detailProduct = yield Product_1.Product.getProductById(id);
            res.render('product_detail', { title: "Chi tiết sản phẩm#" + id, detailProduct });
        });
    }
    addToCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const productCart = yield Product_1.Product.getProductById(id);
                productCart.quantity = Number(req.body.quantity);
                const idUser = JSON.parse(localStorage.getItem('user') || "{'id':-1}").id;
                let cart = yield Order_1.Order.getCart(idUser);
                var total = 0;
                if (!cart) {
                    cart = new Order_1.Order([productCart], idUser);
                    yield cart.createCart();
                }
                else {
                    const cartCopy = new Order_1.Order();
                    cartCopy.copy(cart);
                    cart = cartCopy;
                    cart.addProduct(productCart);
                }
                res.render('product_cart', { title: "Trang Giỏ Hàng", cart, total });
            }
            catch (error) {
                console.error("Error adding to cart:", error);
                res.status(500).send('Error adding to cart');
            }
        });
    }
    cart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let idUser = JSON.parse(localStorage.getItem('user') || "{'id':-1}").id;
            let cartData = yield Order_1.Order.getCart(idUser);
            let total = 0;
            let cart = new Order_1.Order([]);
            if (cartData) {
                cart.copy(cartData);
                if (cart.products) {
                    for (const product of cart.products) {
                        total += (product.price || 0) * (product.quantity || 0);
                    }
                }
            }
            res.render('product_cart', { title: "Trang Giỏ Hàng", cart, total });
        });
    }
    updateCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let idUser = JSON.parse(localStorage.getItem('user') || "{'id':-1}").id;
            let cartData = yield Order_1.Order.getCart(idUser);
            let cart = new Order_1.Order([]);
            if (cartData) {
                cart.copy(cartData);
            }
            let idSP = req.params.id;
            let i = 0;
            (_a = cart.products) === null || _a === void 0 ? void 0 : _a.forEach((item, index) => {
                var _a, _b;
                if (item.id == idSP) {
                    if (req.params.action == 'up') {
                        item.quantity++;
                    }
                    else if (req.params.action == 'down') {
                        item.quantity--;
                        if (item.quantity === 0) {
                            (_a = cart.products) === null || _a === void 0 ? void 0 : _a.splice(index, 1);
                        }
                    }
                    else if (req.params.action == 'delete') {
                        (_b = cart.products) === null || _b === void 0 ? void 0 : _b.splice(i, 1);
                    }
                }
                ;
                i++;
            });
            yield cart.updateCart();
            res.redirect('/cart');
        });
    }
    bill(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let idUser = JSON.parse(localStorage.getItem('user') || "{'id':-1}").id;
            if (idUser) {
                let cartData = yield Order_1.Order.getCart(idUser);
                let cart = new Order_1.Order([]);
                if (cartData) {
                    cart.copy(cartData);
                    let products = cart.products;
                    let total = 0;
                    if (products) {
                        for (const product of products) {
                            total += (product.price || 0) * (product.quantity || 0);
                        }
                    }
                    res.render('product_cart-bill', { title: "Trang Thanh Toán", products, total });
                }
            }
            else {
                res.send('Bạn cần phải đăng nhập trước khi đặt hàng');
            }
        });
    }
    completeCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let idUser = JSON.parse(localStorage.getItem('user') || "{'id':-1}").id;
            let cartData = yield Order_1.Order.getCart(idUser);
            let total = 0;
            let order = new Order_1.Order();
            if (cartData) {
                order.copy(cartData);
                (_a = order.products) === null || _a === void 0 ? void 0 : _a.forEach(item => {
                    let price = 0;
                    if (item.price) {
                        price += item.price;
                    }
                    total += price * item.quantity;
                });
                order.total = total;
                order.date = new Date().toLocaleDateString('sv-SE');
                order.status = "order";
                yield order.updateCart();
                res.send('Đặt hàng thành công');
            }
        });
    }
}
exports.ProductController = ProductController;
