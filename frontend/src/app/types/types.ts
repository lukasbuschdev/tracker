export type typeBudget = {
    id: string,
    created: Date,
    name: string,
    userId: string,
    amount: number,
    used: number,
    recreate: boolean,
    categories?: typeCategory[],
    expenses?: typeExpense[]
}

export type typeCategory = {
    id: string,
    name: string,
    amount: number,
    used: number,
    recreate: boolean
}

export type typeExpense = {
    id: string,
    name: string,
    category: string,
    amount: number,
    created: number,
    recreate: boolean
}
