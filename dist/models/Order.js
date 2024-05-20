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
exports.Order = void 0;
const database_1 = require("../database");
let DB = new database_1.Database();
class Order {
    constructor(products, id_user) {
        this.id_user = id_user;
        this.products = products;
        this.total = 0;
        this.date = new Date().toLocaleString('sv-SE');
        this.status = "cart";
    }
    static getCart(idUser) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield DB.getData(`/orders?id_user=${idUser}&status=cart`);
            if (data.length == 0) {
                return null;
            }
            else {
                return data[0];
            }
        });
    }
    createCart() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB.insertData(`/orders`, this);
        });
    }
    updateCart() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB.updateData(`/orders/${this.id}`, this);
        });
    }
    addProduct(product) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.products) {
                this.products = [];
            }
            const existingProductIndex = this.products.findIndex(p => p.id === product.id);
            if (existingProductIndex !== -1) {
                this.products[existingProductIndex].quantity += product.quantity;
            }
            else {
                if (this.products.length === 0) {
                    product.quantity = 1;
                }
                this.products.push(product);
            }
            yield DB.updateData(`/orders/${this.id}`, this);
        });
    }
    copy(order) {
        this.id = order.id;
        this.products = order.products;
        this.id_user = order.id_user;
        this.total = order.total;
        this.date = order.date;
        this.status = order.status;
    }
    getProducts() {
        return this.products;
    }
    static showOrder() {
        return __awaiter(this, void 0, void 0, function* () {
            let order = yield DB.getData(`/orders?_sort=-date&status_ne=cart`);
            return order;
        });
    }
}
exports.Order = Order;
