"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryNameById = void 0;
const api = "http://localhost:3000";
const getCategoryNameById = async (categoryId) => {
    const categoriesResponse = await fetch(api + "/categories");
    const categories = await categoriesResponse.json();
    const category = categories.find((cat) => cat.id_category === categoryId);
    return category ? category.name_category : "Unknown Category";
};
exports.getCategoryNameById = getCategoryNameById;
