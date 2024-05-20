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
exports.User = void 0;
const database_1 = require("../database");
const DB = new database_1.Database();
class User {
    constructor(email, password, name, role) {
        this.email = email;
        this.name = name;
        this.password = password;
        this.role = role;
    }
    login() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield DB.getData(`/users?email=${this.email}&password=${this.password}`);
                if (user.length == 1) {
                    console.log(user);
                    this.id = user[0].id;
                    this.name = user[0].name;
                    this.role = user[0].role;
                    return this.role || '';
                }
                else {
                    return false;
                }
            }
            catch (error) {
                console.error("Error during login:", error);
                return false;
            }
        });
    }
    register() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield DB.insertData(`/users`, this);
            return ('id' in data);
        });
    }
    static getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield DB.getData(`/users/${id}`);
            return user;
        });
    }
}
exports.User = User;
