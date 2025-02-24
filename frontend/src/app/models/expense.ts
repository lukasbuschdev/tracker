import { typeExpense } from "../types/types";

export class Expense {
    id: string;
    name: string;
    category: string;
    amount: number;
    created: number;
    recreate: boolean;

    constructor(data: typeExpense) {
        this.id = data.id;
        this.name = data.name;
        this.category = data.category;
        this.amount = data.amount;
        this.created = data.created;
        this.recreate = data.recreate;
    }

    static create(data: Omit<typeExpense, 'id' | 'created'>) {

        const id = 'agskdj';
        const created = 1298768732;
        return new Expense({...data, id, created});
    }
}