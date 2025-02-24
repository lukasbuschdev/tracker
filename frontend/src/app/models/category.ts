import { typeCategory } from "../types/types";

export class Category {
    id: string;
    name: string;
    amount: number;
    used: number;

    constructor(data: typeCategory) {
        this.id = data.id;
        this.name = data.name;
        this.amount = data.amount;
        this.used = data.used ?? 0;
    }

    static create(data: Omit<typeCategory, 'id'>) {
        const id = '0sakd'
        return new Category({...data, id});
    }
}