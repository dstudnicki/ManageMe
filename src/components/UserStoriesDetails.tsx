import { useParams } from "react-router-dom";
import { priorities, statuses } from "../data/data";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "@/components/ui/button";
import { Plus, StickyNote } from "lucide-react";
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { api } from "@/services/api";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface ITask {
    _id: string;
    name: string;
    description: string;
    priority: string;
    userStory: string;
    createdAt: string;
    status: string;
    user: {
        _id: string | undefined;
        email: string;
    };
}

interface IUserStory {
    _id: string;
    name: string;
    description: string;
    priority: string;
    project: string;
    createdAt: string;
    status: string;
    tasks: object;
}

interface IUser {
    _id: string;
    email: string;
}

export default function UserStoriesDetails() {
    const { id } = useParams();
    const creationDate = new Date().toISOString();
    const [userStories, setUserStories] = useState<IUserStory[]>([]);
    const userStory = userStories.find((u: { _id: string }) => u._id === id);
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [users, setUsers] = useState<IUser[]>([]);
    const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const status = statuses.find((status) => status.value === userStory?.status);
    const notStartedStories = tasks.filter((task) => task.status === "not started");
    const inProgressStories = tasks.filter((task) => task.status === "in progress");
    const doneStories = tasks.filter((task) => task.status === "done");
    const priority = priorities.find((priority) => priority.value === userStory?.priority);

    const fetchTasks = async () => {
        try {
            const { data: tasks } = await api.get("/tasks");
            const sortedTasks = tasks.sort((a: ITask, b: ITask) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setTasks(sortedTasks);
        } catch (error) {
            console.error("Error fetching user stories:", error);
        }
    };

    const handleAddTask = async (status: string) => {
        try {
            await api.post(
                "/tasks",
                {
                    name: "New Task",
                    description: "lalalla",
                    status: status,
                    priority: userStory?.priority || "low",
                    story: userStory?._id,
                    createdAt: creationDate,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            await fetchTasks();
        } catch (error) {
            console.error("Failed to add user story:", error);
        }
    };

    const deleteTask = async (taskId: string) => {
        try {
            await api.delete(`/tasks/${taskId}`);
            setTasks((prevStories) => prevStories.filter((task) => task._id !== taskId));
        } catch (error) {
            console.error("Failed to delete task:", error);
        }
    };

    useEffect(() => {
        const fetchUserStories = async () => {
            try {
                const { data: stories } = await api.get("/stories");
                setUserStories(stories);
            } catch (error) {
                console.error("Error fetching user stories:", error);
            }
        };

        const fetchUsers = async () => {
            try {
                const { data } = await api.get("/user");
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUserStories();
        fetchTasks();
        fetchUsers();
    }, []);

    const handleOpenSidebar = (task: ITask) => {
        setSidebarOpen(true);
        setSelectedTask(task);
    };

    const handleCloseSidebar = () => {
        setSidebarOpen(false);
        setSelectedTask(null);
    };

    const updateTaskUser = async (taskId: string, userId: string) => {
        try {
            await api.patch(`/tasks/${taskId}`, {
                user: userId,
            });

            await fetchTasks();
        } catch (error) {
            console.error("Failed to update task user:", error);
        }
    };

    if (!userStory) return <p>Project not found</p>;

    return (
        <main className="flex flex-col px-4 text-xl xl:container sm:px-8 lg:px-12">
            <div className="flex flex-col md:flex-row md:gap-4">
                <h1>{userStory.name}</h1>
                <h3>{userStory.description}</h3>
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
                            <CardHeader className="flex-row items-center justify-between px-2.5 pb-1.5">
                                <CardTitle className="flex text-sm font-normal gap-2">
                                    <StickyNote className="h-5 w-5" /> {task.name}
                                </CardTitle>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
                                            <MoreHorizontal />
                                            <span className="sr-only">Open menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-[160px]">
                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => deleteTask(task._id)}>Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
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
                    {inProgressStories.map((task, index) => (
                        <Card key={index} className="py-2 gap-4">
                            <CardHeader className="flex-row items-center justify-between px-2.5 pb-1.5">
                                <CardTitle className="flex text-sm font-normal gap-2">
                                    <StickyNote className="h-5 w-5" /> {task.name}
                                </CardTitle>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
                                            <MoreHorizontal />
                                            <span className="sr-only">Open menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-[160px]">
                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => deleteTask(task._id)}>Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
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
                    {doneStories.map((task, index) => (
                        <Card key={index} className="py-2 gap-4">
                            <CardHeader className="flex-row items-center justify-between px-2.5 pb-1.5">
                                <CardTitle className="flex text-sm font-normal gap-2">
                                    <StickyNote className="h-5 w-5" /> {task.name}
                                </CardTitle>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
                                            <MoreHorizontal />
                                            <span className="sr-only">Open menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-[160px]">
                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => deleteTask(task._id)}>Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
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
            <SidebarProvider>
                {sidebarOpen && selectedTask && <AppSidebar side="right" task={selectedTask} close={() => handleCloseSidebar()} users={users} onUpdateUser={updateTaskUser} />}
            </SidebarProvider>
        </main>
    );
}
