import { HttpClient } from "@angular/common/http";
import { typeCategory, UpdateData, UploadData } from "../types/types";
import { firstValueFrom } from "rxjs";

export class Category {
    id: string;
    name: string;
    amount: number;
    used: number;
    recreate: boolean;
    budgetId: string;

    static http: HttpClient

    constructor(data: typeCategory) {
        this.id = data.id;
        this.name = data.name;
        this.amount = data.amount;
        this.used = 0;
        this.recreate = data.recreate;
        this.budgetId = data.budgetId;
    }

    public static async create(data: UploadData<typeCategory>) {
        const receivedData = await firstValueFrom(this.http.post<typeCategory>('/api/categories', data));
        return new Category(receivedData);
    }

    public static async get(budgetId: string) {
        const receivedData = await firstValueFrom(this.http.get<typeCategory[]>(`/api/categories/${ budgetId }`));
        return receivedData.map(category => new Category(category));
    }

    public static delete(categoryId: string) {
        return firstValueFrom(this.http.delete<void>(`/api/categories/${ categoryId }`));
    }

    public static async patch(categoryId: string, data: UpdateData<typeCategory>) {
        const receivedData = await firstValueFrom(this.http.patch<typeCategory>(`/api/categories/${ categoryId }`, data));
        return new Category(receivedData);
    }
}