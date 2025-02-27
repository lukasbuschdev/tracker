import { HttpClient } from "@angular/common/http";
import { typeExpense, UpdateData, UploadData } from "../types/types";
import { firstValueFrom } from "rxjs";

export class Expense {
    id: string;
    name: string;
    category: string;
    amount: number;
    created: Date;
    recreate: boolean;

    static http: HttpClient

    constructor(data: typeExpense) {
        this.id = data.id;
        this.name = data.name;
        this.category = data.category;
        this.amount = data.amount;
        this.created = new Date(data.created);
        this.recreate = data.recreate;
    }

    static async create(data: UploadData<typeExpense>) {
        const receivedData = await firstValueFrom(this.http.post<typeExpense>('/api/expenses', data));
        return new Expense(receivedData);
    }

    static async get(budgetId: string) {
        const receivedData = await firstValueFrom(this.http.get<typeExpense[]>(`/api/expenses/${ budgetId }`));
        return receivedData.map(expense => new Expense(expense));
    }

    static delete(expenseId: string) {
        return firstValueFrom(this.http.delete<void>(`/api/expenses/${ expenseId }`));
    }

    static async patch(expenseId: string, data: UpdateData<typeExpense>) {
        const receivedData = await firstValueFrom(this.http.patch<typeExpense>(`/api/expenses/${ expenseId }`, data));
        return new Expense(receivedData);
    }
}