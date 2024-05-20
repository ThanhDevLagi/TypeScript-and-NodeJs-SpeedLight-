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
exports.Category = void 0;
const database_1 = require("../database");
const DB = new database_1.Database();
class Category {
    constructor(id_category, name_category, id) {
        this.id_category = id_category;
        this.name_category = name_category;
    }
    createCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            return DB.insertData('/categories', this);
        });
    }
    static checkIdCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield DB.getData(`/categories/${id}`);
                return category.length > 0 ? true : false;
            }
            catch (error) {
                console.error("Error checking category:", error);
                return false;
            }
        });
    }
    static deleteCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield DB.deleteData(`/categories/${id}`);
            return data;
        });
    }
}
exports.Category = Category;
