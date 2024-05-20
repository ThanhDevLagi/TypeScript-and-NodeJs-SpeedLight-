import axios from 'axios';

export class Database {
    protected ApiURL: string = "http://localhost:3000";
    public async getData(url: string) {
        const response = await axios.get(`${this.ApiURL}${url}`);
        return response.data;
    }
    public async insertData<T>(url: string, data: T) {
        const response = await axios.post(`${this.ApiURL}${url}`, data);
        return response.data;
    }
    public async updateData<T>(url: string, data: T) {
        const response = await axios.patch(`${this.ApiURL}${url}`, data);
        return response.data;
    }
    public async deleteData(url: string,) {
        const response = await axios.delete(`${this.ApiURL}${url}`);
        return response.data;
    }
}