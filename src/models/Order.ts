import { Product } from './Product';
import { Database } from "../database";
let DB = new Database();
export class Order {
    protected id?: string;
    public products?: Product[];
    public id_user?: string;
    public total: number;
    public date: string;
    public status: "cart" | "order" | "packing" | "shipping" | "success" | "canceled";
    constructor(products?: Product[], id_user?: string) {
        this.id_user = id_user;
        this.products = products;
        this.total = 0;
        this.date = new Date().toLocaleString('sv-SE');
        this.status = "cart";
    }
    public static async getCart(idUser: string): Promise<Order | null> {
        let data = await DB.getData(`/orders?id_user=${idUser}&status=cart`) as Order[];
        if (data.length == 0) { // không có cart
            return null;
        } else { // có cart thì trả về và lấy ra phần tử đầu tiên
            return data[0];
        }
    }
    public async createCart(): Promise<void> {
        return await DB.insertData<Order>(`/orders`, this)
    }
    public async updateCart(): Promise<void> {
        return await DB.updateData<Order>(`/orders/${this.id}`, this)
    }
    public async addProduct(product: Product) {
        if (!this.products) {
            this.products = [];
        }
        // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
        const existingProductIndex = this.products.findIndex(p => p.id === product.id);

        if (existingProductIndex !== -1) {
            // Nếu sản phẩm đã tồn tại, cập nhật số lượng của sản phẩm
            this.products[existingProductIndex].quantity += product.quantity;
        } else {
            // Nếu sản phẩm chưa tồn tại, thêm sản phẩm mới vào giỏ hàng
            // Đảm bảo rằng sản phẩm đầu tiên có quantity là 1
            if (this.products.length === 0) {
                product.quantity = 1;
            }
            this.products.push(product);
        }
        // Cập nhật đơn hàng trong cơ sở dữ liệu sau khi thêm sản phẩm
        await DB.updateData<Order>(`/orders/${this.id}`, this);
    }


    public copy(order: Order) {
        this.id = order.id;
        this.products = order.products;
        this.id_user = order.id_user;
        this.total = order.total;
        this.date = order.date;
        this.status = order.status;
    }
    public getProducts(): Product[] | undefined {
        return this.products;
    }

    public static async showOrder() {
        let order = await DB.getData(`/orders?_sort=-date&status_ne=cart`) as Order[];
        return order;
    }


}