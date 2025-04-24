export class Task {
    public id: number;
    public name: string;
    public description: string;
    public priority: string;
    public userStory: string;
    public createdAt: string;
    public status: string;
    public user: string;

    public constructor(id: number, name: string, description: string, priority: string, userStory: string, createdAt: string, status: string, user: string) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.priority = priority;
        this.userStory = userStory;
        this.createdAt = createdAt;
        this.status = status;
        this.user = user;
    }
}
