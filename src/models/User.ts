import { Database } from "../database";
const DB = new Database();
export class User {
    protected id?: string;
    protected email: string;
    protected name?: string;
    protected password: string;
    protected role?: "Admin" | "User";

    constructor(email: string, password: string, name?: string, role?: "Admin" | "User") {
        this.email = email;
        this.name = name;
        this.password = password;
        this.role = role;
    }

    public async login() {
        try {
            const user = await DB.getData(`/users?email=${this.email}&password=${this.password}`);
            if (user.length == 1) {
                console.log(user);
                this.id = user[0].id;
                this.name = user[0].name;
                this.role = user[0].role;
                return this.role || '';
            } else {
                return false;
            }
        } catch (error) {
            console.error("Error during login:", error);
            return false;
        }
    }

    public async register() {
        const data = await DB.insertData(`/users`, this);
        return ('id' in data);
    }
    public static async getUserById(id: string) {
        const user = await DB.getData(`/users/${id}`);
        return user;
    }
}