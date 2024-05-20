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
exports.UserController = void 0;
const User_1 = require("./../models/User");
const database_1 = require("./../database");
let DB = new database_1.Database();
class UserController {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                const password = req.body.password;
                if (email && password) {
                    const user = new User_1.User(email, password);
                    const loggedInUser = yield user.login();
                    if (loggedInUser) {
                        localStorage.setItem('user', JSON.stringify(user));
                        if (loggedInUser === 'Admin') {
                            res.redirect('/admin');
                        }
                        else {
                            res.redirect('/');
                        }
                    }
                    else {
                        res.render('user_login', {
                            title: "Đăng nhập",
                            message: "Email hoặc mật khẩu không đúng"
                        });
                    }
                }
                else {
                    res.render('user_login', { title: "Đăng nhập", message: "" });
                }
            }
            catch (error) {
                console.error("Error during login:", error);
                res.status(500).send('Error during login');
            }
        });
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, name, password, passwordRepeat } = req.body;
            if (!name || !email || !password || !passwordRepeat) {
                return res.render('user_register', { title: "Đăng ký", message: 'xin vui lòng nhập thông tin' });
            }
            let message = '';
            if (password !== passwordRepeat) {
                message = "Mật khẩu không khớp";
                return res.render('user_register', { title: "Đăng ký", message });
            }
            const user = new User_1.User(email, password, name, 'User');
            const registrationSuccessful = yield user.register();
            if (registrationSuccessful) {
                return res.redirect('/login');
            }
            else {
                message = "Đăng ký thất bại, xin vui lòng thử lại";
                return res.render('user_register', { title: "Đăng ký", message });
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            localStorage.removeItem('user');
            res.redirect('/login');
        });
    }
}
exports.UserController = UserController;
