export type typeBudget = {
    id: string,
    created: Date,
    name: string,
    userId: string,
    amount: number,
    used: number,
    recreate: boolean,
    isArchived: boolean
}

export type typeCategory = {
    id: string,
    name: string,
    amount: number,
    used: number,
    recreate: boolean,
    budgetId: string,
    isArchived: boolean
}

export type typeExpense = {
    id: string,
    name: string,
    category: string,
    amount: number,
    created: Date,
    recreate: boolean,
    budgetId: string,
    isArchived: boolean
}

export type typeUser = {
    id: string,
    created: Date,
    name: string,
    email: string,
    password: string,
    isVerified: boolean,
    verificationCode: string
}

export type typeDialogData = {
    name: string,
    amount: number,
    recreate: boolean
}

export type UploadData<Type> = Omit<Type, 'id' | 'created'>;
export type UpdateData<Type> = Partial<UploadData<Type>>;
