import { HttpClient } from "@angular/common/http";
import { typeBudget, typeCategory, typeExpense, UpdateData, UploadData } from "../types/types";
import { firstValueFrom } from "rxjs";

export class Budget {
    id: string;
    created: Date;
    name: string;
    userId: string;
    amount: number;
    used: number;
    recreate: boolean;

    static http: HttpClient

    private constructor(data: typeBudget) {
        this.id = data.id;
        this.created = new Date(data.created);
        this.name = data.name;
        this.userId = data.userId;
        this.amount = data.amount;
        this.used = data.used ?? 0;
        this.recreate = data.recreate;
    }

    public static async create(data: UploadData<typeBudget>) {
        const receivedData = await firstValueFrom(this.http.post<typeBudget>('/api/budgets', data));
        return new Budget(receivedData);
    }

    public static async get(userId: string) {
        const receivedData = await firstValueFrom(this.http.get<typeBudget[]>(`/api/budgets/${ userId }`));
        return receivedData.map(budget => new Budget(budget));
    }

    public static delete(budgetId: string) {
        return firstValueFrom(this.http.delete<void>(`/api/budgets/${ budgetId }`)); 
    }

    public static async patch(budgetId: string, data: UpdateData<typeBudget>) {
        const receivedData = await firstValueFrom(this.http.patch<typeBudget>(`/api/budgets/${ budgetId }`, data));
        return new Budget(receivedData);
    }
}