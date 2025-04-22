export class User {
    public id: number;
    public email: string;
    public username: string;
    public role: string;

    public constructor(id: number, email: string, username: string, role: "admin" | "devops" | "developer") {
        this.id = id;
        this.email = email;
        this.username = username;
        this.role = role;
    }
}

export const Users = [new User(1, "user@gmail.com", "testUser", "admin"), new User(2, "user1@gmail.com", "user1", "devops"), new User(3, "user2@gmail.com", "user2", "developer")];
