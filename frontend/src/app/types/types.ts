export type BudgetOrCategory = {
    id: string,
    name: string,
    generalAvailable: number,
    used: number,
    currentAvailable: number
}

export type Expense = {
    id: string,
    name: string,
    category: string,
    amount: number
}