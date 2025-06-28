import { useEffect, useState } from "react";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { UserNav } from "./components/user-nav";
import { api } from "./services/api";

interface IProject {
    _id: string;
    name: string;
    title: string;
    status: string;
    priority: string;
    user: {
        _id: string | undefined;
        email: string;
    };
    createdAt: string;
}

export default function App() {
    // const rawData = localStorage.getItem("formValues");
    // const data = rawData ? JSON.parse(rawData) : [];
    const [projects, setProjects] = useState<IProject[]>([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data: projects } = await api.get("/projects");
                const sortedProjects = projects.sort((a: IProject, b: IProject) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setProjects(sortedProjects);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };

        fetchProjects();
    }, []);

    return (
        <>
            <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
                        <p className="text-muted-foreground">Here&apos;s a list of your projects!</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <UserNav />
                    </div>
                </div>
                <DataTable data={projects} columns={columns} />
            </div>
        </>
    );
}
