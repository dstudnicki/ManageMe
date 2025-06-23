import { useParams } from "react-router-dom";
import { priorities, statuses } from "../data/data";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "@/components/ui/button";
import { Plus, StickyNote } from "lucide-react";
import { Task } from "@/Task/Task";
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface ITask {
    id: number;
    name: string;
    description: string;
    priority: string;
    userStory: string;
    createdAt: string;
    status: string;
    user: string;
}

interface IUserStory {
    id: number;
    name: string;
    description: string;
    priority: string;
    project: string;
    createdAt: string;
    status: string;
    tasks: object;
}

export default function UserStoriesDetails() {
    const { id } = useParams();
    const idToNumber = id ? Number(id) : null;
    const creationDate = new Date().toISOString();
    const userStories = JSON.parse(localStorage.getItem("userStories") || "[]");
    const userStory = userStories.find((u: { id: number }) => u.id === idToNumber);

    const [tasks, setTasks] = useState<ITask[]>([]);
    const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const status = statuses.find((status) => status.value === userStory.status);
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const notStartedStories = tasks.filter((task) => task.status === "not started");
    const inProgressStories = tasks.filter((task) => task.status === "in progress");
    const doneStories = tasks.filter((task) => task.status === "done");

    const priority = priorities.find((priority) => priority.value === userStory.priority);

    const handleAddTask = (status: string) => {
        const newTask = new Task(Date.now(), "Task", "", "", userStory?.name || "", creationDate, status, "");
        setTasks((prev) => [...prev, newTask]);
    };

    const handleOpenSidebar = (task: ITask) => {
        setSidebarOpen(true);
        setSelectedTask(task);
    };

    const handleCloseSidebar = () => {
        setSidebarOpen(false);
        setSelectedTask(null);
    };

    useEffect(() => {
        const updatedUserStories = userStories.map((story: IUserStory) => {
            if (story.id === idToNumber) {
                return {
                    ...story,
                    tasks: {
                        notStarted: tasks.filter((t) => t.status === "not started"),
                        inProgress: tasks.filter((t) => t.status === "in progress"),
                        done: tasks.filter((t) => t.status === "done"),
                    },
                };
            }
            return story;
        });

        localStorage.setItem("userStories", JSON.stringify(updatedUserStories));
    }, [tasks, userStories, idToNumber]);

    if (!userStory) return <p>Project not found</p>;

    return (
        <main className="flex flex-col px-4 text-xl xl:container sm:px-8 lg:px-12">
            <div className="flex flex-col md:flex-row md:gap-4">
                <h1>{userStory.name}</h1>
                <h3>{userStory.title}</h3>
                <span>{status?.label}</span>
                <span>{priority?.label}</span>
            </div>
            <section className="mt-6 grid grid-rows-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="flex flex-col bg-muted gap-2 p-2">
                    <div className="flex items-center gap-[6px] rounded-2xl bg-[#d8d8d8] bg-opacity-25 w-[130px] h-[20px] px-2 my-2">
                        <div className="h-[8px] w-[8px] bg-[#979797] rounded-full"></div>
                        <p className=" text-sm ">Not started</p>
                    </div>
                    {notStartedStories.map((task, index) => (
                        <Card key={index} className="py-2 gap-4" onClick={() => handleOpenSidebar(task)}>
                            <CardHeader className="px-2.5 pb-1.5">
                                <CardTitle className="flex text-sm font-normal gap-2">
                                    <StickyNote className="h-5 w-5" /> {task.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs px-2.5 pb-1.5">
                                <div className="flex items-center gap-[6px] rounded-2xl bg-[#d8d8d8] bg-opacity-25 w-[130px] h-[18px] px-2">
                                    <div className="h-[8px] w-[8px] bg-[#979797] rounded-full"></div>
                                    <p className="text-sm">Not Started</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    <Button onClick={() => handleAddTask("not started")} className="bg-muted text-muted-foreground border justify-start" variant={"outline"}>
                        <Plus /> New task
                    </Button>
                </Card>
                <Card className="flex flex-col bg-[#d7f6fd] gap-2 p-2 ">
                    <div className="flex items-center gap-[6px] rounded-2xl bg-[#adefff] bg-opacity-25 w-[130px] h-[20px] px-2 my-2">
                        <div className="h-[8px] w-[8px] bg-[#5ed0ec] rounded-full"></div>
                        <p className=" text-sm text-[#092f38]">In progress</p>
                    </div>
                    {inProgressStories.map((story, index) => (
                        <Card key={index} className="py-2 gap-4">
                            <CardHeader className="px-2.5 pb-1.5">
                                <CardTitle className="flex text-sm font-normal gap-2">
                                    <StickyNote className="h-5 w-5" /> {story.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs px-2.5 pb-1.5">
                                <div className="flex items-center gap-[6px] rounded-2xl bg-[#adefff] bg-opacity-25 w-[130px] h-[18px] px-2">
                                    <div className="h-[8px] w-[8px] bg-[#5ed0ec] rounded-full"></div>
                                    <p className=" text-sm text-[#092f38]">In Progress</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    <Button onClick={() => handleAddTask("in progress")} className="bg-muted text-muted-foreground border justify-start" variant={"outline"}>
                        <Plus /> New task
                    </Button>
                </Card>
                <Card className="flex flex-col bg-[#d5ffec] gap-2 p-2">
                    <div className="flex items-center gap-[6px] rounded-2xl bg-[#acffda] bg-opacity-25 w-[130px] h-[20px] px-2 my-2">
                        <div className="h-[8px] w-[8px] bg-[#28C780] rounded-full"></div>
                        <p className=" text-sm text-[#053821] ">Done</p>
                    </div>
                    {doneStories.map((story, index) => (
                        <Card key={index} className="py-2 gap-4">
                            <CardHeader className="px-2.5 pb-1.5">
                                <CardTitle className="flex text-sm font-normal gap-2">
                                    <StickyNote className="h-5 w-5" /> {story.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs px-2.5 pb-1.5">
                                <div className="flex items-center gap-[6px] rounded-2xl bg-[#acffda] bg-opacity-25 w-[130px] h-[18px] px-2">
                                    <div className="h-[8px] w-[8px] bg-[#28C780] rounded-full"></div>
                                    <p className=" text-sm">Done</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    <Button onClick={() => handleAddTask("done")} className="bg-muted text-muted-foreground border justify-start" variant={"outline"}>
                        <Plus /> New task
                    </Button>
                </Card>
            </section>
            <SidebarProvider>{sidebarOpen && selectedTask && <AppSidebar side="right" task={selectedTask} close={() => handleCloseSidebar()} users={users} />}</SidebarProvider>
        </main>
    );
}
