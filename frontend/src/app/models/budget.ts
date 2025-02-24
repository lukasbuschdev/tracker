import { HttpClient } from "@angular/common/http";
import { typeBudget, typeCategory, typeExpense } from "../types/types";
import { firstValueFrom } from "rxjs";

export class Budget {
    id: string;
    created: Date;
    name: string;
    userId: string;
    amount: number;
    used: number;
    recreate: boolean;
    categories: typeCategory[];
    expenses: typeExpense[];

    static http: HttpClient

    private constructor(data: typeBudget) {
        this.id = data.id;
        this.created = new Date(data.created);
        this.name = data.name;
        this.userId = data.userId;
        this.amount = data.amount;
        this.used = data.used ?? 0;
        this.recreate = data.recreate;
        this.categories = data.categories ?? [];
        this.expenses = data.expenses ?? [];
    }

    static async create(data: Omit<typeBudget, 'id' | 'created'>) {
        const receivedData = await firstValueFrom(this.http.post<typeBudget>('/api/budgets', data));

        return new Budget(receivedData);
    }

    static async get(userId: string) {
        const receivedData = await firstValueFrom(this.http.get<typeBudget[]>(`/api/budgets/${userId}`));

        return receivedData.map(budget => new Budget(budget));
    }


}