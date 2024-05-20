import { log } from "console";
import { Database } from "../database";
let DB = new Database();
export class Product {
    public id?: string;
    protected name?: string;
    public price?: number;
    protected brand?: number;
    protected image?: string;
    protected description?: string;
    protected discount?: boolean;
    public quantity: number = 0;

    public constructor(name?: string, price?: number, brand?: number, image?: string, description?: string, discount?: boolean) {
        this.name = name;
        this.price = price;
        this.brand = brand;
        this.image = image;
        this.description = description;
        this.discount = discount;
    }
    public copy(product: Product) {
        this.id = product.id;
        this.name = product.name;
        this.price = product.price;
        this.brand = product.brand;
        this.image = product.image;
        this.description = product.description;
        this.discount = product.discount;
        this.quantity = product.quantity;
    }
    public static async getAllProducts() {
        let products: Product[] = await DB.getData(`/products`);
        return products;
    }
    public static async getAllProductsByDiscountTrue() {
        const products = await DB.getData('/products');
        const productsWithDiscount = products.filter((product: Product) => product.discount === true);
        return productsWithDiscount.sort(() => Math.random() - 0.5);
    }
    public static async getAllProductsByDiscountFalse(limit: number) {
        const products = await DB.getData('/products');
        const productsWithoutDiscount = products.filter((product: Product) => product.discount === false);
        const shuffledProducts = productsWithoutDiscount.sort(() => Math.random() - 0.5);
        return shuffledProducts.slice(0, limit);
    }
    public static async getProductById(id: string) {
        const product = await DB.getData(`/products/${id}`);
        return product;
    }

    public static async getAllCategories() {
        let categories: string[] = await DB.getData(`/categories`);
        return categories;
    }

    public async createProduct() {
        let data =  await DB.insertData(`/products`, this);
        console.log(data);
        return data;
    }

    public static async deleteProduct(id:string){
        let data =  await DB.deleteData(`/products/${id}`);
        return data;
    }
    
    public static async updateProduct(id:string, obj:any) {
        let data =  await DB.updateData(`/products/${id}`, obj);
        console.log(data);
        return data;
    }

}