export class User {
    public id: number;
    public email: string;
    public username: string;

    public constructor(id: number, email: string, username: string) {
        this.id = id;
        this.email = email;
        this.username = username;
    }
}
