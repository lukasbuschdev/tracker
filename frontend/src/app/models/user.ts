import { HttpClient } from "@angular/common/http";
import { typeUser, UpdateData, UploadData } from "../types/types";
import { firstValueFrom } from "rxjs";

export class User {
    id: string;
    created: Date;
    name: string;
    email: string;
    password: string;
    isVerified: boolean;
    verificationCode: string;

    static http: HttpClient

    private constructor(data: typeUser) {
        this.id = data.id;
        this.created = new Date(data.created);
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
        this.isVerified = data.isVerified;
        this.verificationCode = data.verificationCode;
    }

    public static async create(data: UploadData<typeUser>) {
        const receivedData = await firstValueFrom(this.http.post<typeUser>('/api/users', data));
        return new User(receivedData);
    }

    public static async get(userId: string) {
        const receivedData = await firstValueFrom(this.http.get<typeUser>(`/api/users/${ userId }`));
        return new User(receivedData);
    }

    public static delete(userId: string) {
        return firstValueFrom(this.http.delete<void>(`/api/users/${ userId }`));
    }

    public static async patch(userId: string, data: UpdateData<typeUser>) {
        const receivedData = await firstValueFrom(this.http.patch<typeUser>(`/api/users/${ userId }`, data));
        return new User(receivedData);
    }

    public static async getUserWithEmailOrNameAndPassword(emailOrName: string, password: string) {
        const receivedData = await firstValueFrom(this.http.get<typeUser>(`/api/users?emailOrName=${emailOrName}&password=${password}`));
        return new User(receivedData);
    }

    public static async getUserWithEmail(email: string) {
        const receivedData = await firstValueFrom(this.http.get<typeUser>(`/api/users/byEmail?email=${email}`));
        return new User(receivedData);
    }
}