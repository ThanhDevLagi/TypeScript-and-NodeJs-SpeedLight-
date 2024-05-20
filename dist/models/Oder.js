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
    constructor(products, id_user, user_Name) {
        this.id_user = id_user;
        this.products = products;
        this.user_name = user_Name;
        this.total = 0;
        this.date = new Date().toLocaleString('sv-SE');
        this.status = "Đang chờ xác nhận";
    }
    static hasCart(idUser) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield DB.getData(`/orders?id_user=${idUser}&status=Đang chờ xác nhận`);
            if (data.length == 0) {
                return false;
            }
            else {
                return data[0];
            }
        });
    }
}
exports.Order = Order;
