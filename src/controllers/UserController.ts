import { User } from './../models/User';
import { Database } from './../database';
import express from 'express';
import bodyParser from 'body-parser';
import { Request, Response } from 'express';

let DB = new Database();
export class UserController {
    public async login(req: Request, res: Response) {
        try {
            const email: string = req.body.email;
            const password: string = req.body.password;

            if (email && password) {
                const user = new User(email, password);
                const loggedInUser = await user.login();

                if (loggedInUser) {
                    // Đăng nhập thành công, kiểm tra vai trò của người dùng
                    localStorage.setItem('user', JSON.stringify(user));
                    if (loggedInUser === 'Admin') {
                        // Nếu người dùng là admin, điều hướng đến trang admin
                        res.redirect('/admin');
                    } else {
                        // Nếu người dùng không phải là admin, điều hướng đến trang web
                        res.redirect('/');
                    }

                } else {
                    // Đăng nhập không thành công
                    res.render('user_login', {
                        title: "Đăng nhập",
                        message: "Email hoặc mật khẩu không đúng"
                    });
                }
            } else {
                // Hiển thị trang đăng nhập với thông điệp nếu email hoặc mật khẩu không được cung cấp
                res.render('user_login', { title: "Đăng nhập", message: "" });
            }
        } catch (error) {
            console.error("Error during login:", error);
            res.status(500).send('Error during login');
        }
    }

    public async register(req: Request, res: Response) {
        const { email, name, password, passwordRepeat } = req.body;

        if (!name || !email || !password || !passwordRepeat) {
            return res.render('user_register', { title: "Đăng ký", message: 'xin vui lòng nhập thông tin' });
        }

        let message: string = '';

        if (password !== passwordRepeat) {
            message = "Mật khẩu không khớp";
            return res.render('user_register', { title: "Đăng ký", message });
        }

        const user = new User(email, password, name, 'User');
        const registrationSuccessful = await user.register();

        if (registrationSuccessful) {
            return res.redirect('/login');
        } else {
            message = "Đăng ký thất bại, xin vui lòng thử lại";
            return res.render('user_register', { title: "Đăng ký", message });
        }
    }

    public async logout(req: Request, res: Response) {
        localStorage.removeItem('user');
        res.redirect('/login');
    }

}