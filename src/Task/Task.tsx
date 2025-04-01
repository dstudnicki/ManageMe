export class Task {
    public id: number;
    public name: string;
    public description: string;
    public priority: string;
    public project: string;
    public createdAt: string;
    public status: string;

    public constructor(id: number, name: string, description: string, priority: string, project: string, createdAt: string, status: string) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.priority = priority;
        this.project = project;
        this.createdAt = createdAt;
        this.status = status;
    }
}
