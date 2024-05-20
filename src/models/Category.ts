import { Database } from "../database";
const DB = new Database();
export class Category {
    protected id_category?: number;
    protected name_category?: string;
    protected id?: string;
    constructor(id_category: number, name_category: string, id?: string) {
        this.id_category = id_category;
        this.name_category = name_category;
    }

    public async createCategory() {
        return DB.insertData('/categories', this)
    }
    public static async checkIdCategory(id: number): Promise<boolean> {
        try {
            const category = await DB.getData(`/categories/${id}`);
            return category.length > 0? true : false;
        } catch (error) {
            console.error("Error checking category:", error);
            return false;
        }
    }
    public static async deleteCategory(id:string){
        let data =  await DB.deleteData(`/categories/${id}`);
        return data;
    }

}