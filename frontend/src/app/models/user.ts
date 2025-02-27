import { HttpClient } from "@angular/common/http";
import { typeUser, UpdateData, UploadData } from "../types/types";
import { firstValueFrom } from "rxjs";

export class User {
    id: string;
    created: Date;
    name: string;
    email: string;
    password: string;

    static http: HttpClient

    private constructor(data: typeUser) {
        this.id = data.id;
        this.created = new Date(data.created);
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
    }

    static async create(data: UploadData<typeUser>) {
        const receivedData = await firstValueFrom(this.http.post<typeUser>('/api/users', data));
        return new User(receivedData);
    }

    static async get(userId: string) {
        const receivedData = await firstValueFrom(this.http.get<typeUser>(`/api/users/${ userId }`));
        return new User(receivedData);
    }

    static delete(userId: string) {
        return firstValueFrom(this.http.delete<void>(`/api/users/${ userId }`));
    }

    static async patch(userId: string, data: UpdateData<typeUser>) {
        const receivedData = await firstValueFrom(this.http.patch<typeUser>(`/api/users/${ userId }`, data));
        return new User(receivedData);
    }
}