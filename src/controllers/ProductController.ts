import { title } from 'process';
import { Order } from '../models/Order';
import { Product } from './../models/Product';
import { Request, Response } from 'express';
export class ProductController {
    public async detail(req: Request, res: Response) {
        let id: string = req.params.id;
        let detailProduct = await Product.getProductById(id);
        res.render('product_detail', { title: "Chi tiết sản phẩm#" + id, detailProduct });
    }
    public async addToCart(req: Request, res: Response) {
        try {
            const id: string = req.params.id;
            const productCart: Product = await Product.getProductById(id) as Product;
            productCart.quantity = Number(req.body.quantity);

            const idUser: string = JSON.parse(localStorage.getItem('user') || "{'id':-1}").id;
            let cart: Order | null = await Order.getCart(idUser) as Order;
            var total: number = 0;
            if (!cart) {
                // Tạo đơn hàng mới và thêm sản phẩm vào đó
                cart = new Order([productCart], idUser);
                await cart.createCart();
            } else {
                // Nếu đã có đơn hàng, chỉ cần thêm sản phẩm vào đó
                const cartCopy: Order = new Order();
                cartCopy.copy(cart);
                cart = cartCopy;
                cart.addProduct(productCart);

            }

            res.render('product_cart', { title: "Trang Giỏ Hàng", cart, total });
        } catch (error) {
            console.error("Error adding to cart:", error);
            res.status(500).send('Error adding to cart');
        }
    }

    public async cart(req: Request, res: Response) {
        let idUser: string = JSON.parse(localStorage.getItem('user') || "{'id':-1}").id;
        let cartData = await Order.getCart(idUser);
        let total = 0;
        let cart = new Order([]); // tạo đơn hàng mới chưa có sản phẩm
        if (cartData) {
            cart.copy(cartData);
            // Tính tổng tiền của tất cả sản phẩm trong giỏ hàng
            if (cart.products) {
                for (const product of cart.products) {
                    total += (product.price || 0) * (product.quantity || 0);
                }
            }
        }
        res.render('product_cart', { title: "Trang Giỏ Hàng", cart, total });
    }
    public async updateCart(req: Request, res: Response) {
        let idUser: string = JSON.parse(localStorage.getItem('user') || "{'id':-1}").id;
        let cartData = await Order.getCart(idUser)
        let cart = new Order([])
        if (cartData) {
            cart.copy(cartData);
        }
        let idSP = req.params.id
        let i: number = 0
        cart.products?.forEach((item, index) => {
            if (item.id == idSP) {
                if (req.params.action == 'up') {
                    item.quantity++;
                } else if (req.params.action == 'down') {
                    item.quantity--;
                    if (item.quantity === 0) {
                        cart.products?.splice(index, 1);
                    }
                } else if (req.params.action == 'delete') {
                    cart.products?.splice(i, 1);
                }
            };
            i++
        });
        await cart.updateCart();
        res.redirect('/cart');
    }

    public async bill(req: Request, res: Response) {
        let idUser: string = JSON.parse(localStorage.getItem('user') || "{'id':-1}").id;
        if (idUser) {
            let cartData = await Order.getCart(idUser);
            let cart = new Order([]);
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
        } else {
            res.send('Bạn cần phải đăng nhập trước khi đặt hàng');
        }
    }


    public async completeCart(req: Request, res: Response) {
        let idUser: string = JSON.parse(localStorage.getItem('user') || "{'id':-1}").id;
        let cartData = await Order.getCart(idUser);
        let total: number = 0;
        let order = new Order();
        if (cartData) {
            order.copy(cartData);
            order.products?.forEach(item => {
                let price: number = 0;
                if (item.price) {
                    price += item.price
                }
                total += price * item.quantity;
            })
            order.total = total;
            order.date = new Date().toLocaleDateString('sv-SE');
            order.status = "order";
            await order.updateCart()
            res.send('Đặt hàng thành công')
        }
    }
}