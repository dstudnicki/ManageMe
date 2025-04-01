import { useParams } from "react-router-dom";
import { priorities, statuses } from "../data/data";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "@/components/ui/button";
import { Plus, StickyNote } from "lucide-react";
import { Task } from "@/Task/Task";
import { useEffect, useState } from "react";

interface ITask {
    id: number;
    name: string;
    description: string;
    priority: string;
    project: string;
    createdAt: string;
    status: string;
}

export default function ProjectDetails() {
    const { slug } = useParams();
    const creationDate = new Date().toISOString();
    const projects = JSON.parse(localStorage.getItem("formValues") || "[]");
    const project = projects.find((p: { name: string }) => p.name === slug);
    const initialValues: ITask = {
        id: Date.now(),
        name: "Task",
        description: "",
        priority: "",
        project: project.name,
        createdAt: creationDate,
        status: "",
    };
    const [taskNotStarted, setTaskNotStarted] = useState<ITask[]>([]);
    console.log(taskNotStarted);
    const [taskInProgress, setTaskInProgress] = useState<ITask[]>([]);
    const [taskDone, setTaskDone] = useState<ITask[]>([]);
    const status = statuses.find((status) => status.value === project.status);
    const taskStatusNotStarted = statuses.find((status) => taskNotStarted.some((task) => task.status === status.value));
    const taskStatusInProgress = statuses.find((status) => taskInProgress.some((task) => task.status === status.value));
    const taskStatusDone = statuses.find((status) => taskDone.some((task) => task.status === status.value));
    const priority = priorities.find((priority) => priority.value === project.priority);
    const taskBuilder = new Task(initialValues.id, initialValues.name, initialValues.description, initialValues.priority, initialValues.project, initialValues.createdAt, initialValues.status);

    const handleAddTaskNotStarted = () => {
        setTaskNotStarted([{ ...taskBuilder, status: "not started" }]);
    };

    const handleAddTaskInProgress = () => {
        setTaskInProgress([{ ...taskBuilder, status: "in progress" }]);
    };

    const handleAddTaskDone = () => {
        setTaskDone([{ ...taskBuilder, status: "done" }]);
    };

    useEffect(() => {
        localStorage.setItem("task", JSON.stringify({ taskNotStarted, taskInProgress, taskDone }));
    }, [taskNotStarted, taskInProgress, taskDone]);

    if (!project) return <p>Project not found</p>;

    return (
        <main className="flex flex-col px-4 text-xl xl:container sm:px-8 lg:px-12">
            <div className="flex flex-col md:flex-row md:gap-4">
                <h1>{project.name}</h1>
                <h3>{project.title}</h3>
                <span>{status?.label}</span>
                <span>{priority?.label}</span>
            </div>
            <section className="mt-6 grid grid-rows-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="flex flex-col bg-muted gap-2 p-2">
                    <div className="flex items-center gap-[6px] rounded-2xl bg-[#d8d8d8] bg-opacity-25 w-[110px] h-[20px] px-2 my-2">
                        <div className="h-[8px] w-[8px] bg-[#979797] rounded-full"></div>
                        <p className=" text-sm ">Not started</p>
                    </div>
                    {taskNotStarted.map((task, index) => (
                        <Card key={index} className="py-2 gap-4">
                            <CardHeader className="px-2.5 pb-1.5">
                                <CardTitle className="flex text-sm font-normal gap-2">
                                    <StickyNote className="h-5 w-5" /> {task.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs px-2.5 pb-1.5">
                                <div className="flex items-center gap-[6px] rounded-2xl bg-[#d8d8d8] bg-opacity-25 w-[110px] h-[18px] px-2">
                                    <div className="h-[8px] w-[8px] bg-[#979797] rounded-full"></div>
                                    <p className="text-sm">{taskStatusNotStarted?.label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    <Button onClick={handleAddTaskNotStarted} className="bg-muted text-muted-foreground border justify-start" variant={"outline"}>
                        <Plus /> New task
                    </Button>
                </Card>
                <Card className="flex flex-col bg-[#d7f6fd] gap-2 p-2 ">
                    <div className="flex items-center gap-[6px] rounded-2xl bg-[#adefff] bg-opacity-25 w-[110px] h-[20px] px-2 my-2">
                        <div className="h-[8px] w-[8px] bg-[#5ed0ec] rounded-full"></div>
                        <p className=" text-sm text-[#092f38]">In progress</p>
                    </div>
                    {taskInProgress.map((task, index) => (
                        <Card key={index} className="py-2 gap-4">
                            <CardHeader className="px-2.5 pb-1.5">
                                <CardTitle className="flex text-sm font-normal gap-2">
                                    <StickyNote className="h-5 w-5" /> {task.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs px-2.5 pb-1.5">
                                <div className="flex items-center gap-[6px] rounded-2xl bg-[#adefff] bg-opacity-25 w-[110px] h-[18px] px-2">
                                    <div className="h-[8px] w-[8px] bg-[#5ed0ec] rounded-full"></div>
                                    <p className=" text-sm text-[#092f38]">{taskStatusInProgress?.label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    <Button onClick={handleAddTaskInProgress} className="bg-muted text-muted-foreground border justify-start" variant={"outline"}>
                        <Plus /> New task
                    </Button>
                </Card>
                <Card className="flex flex-col bg-[#d5ffec] gap-2 p-2">
                    <div className="flex items-center gap-[6px] rounded-2xl bg-[#acffda] bg-opacity-25 w-[110px] h-[20px] px-2 my-2">
                        <div className="h-[8px] w-[8px] bg-[#28C780] rounded-full"></div>
                        <p className=" text-sm text-[#053821] ">Done</p>
                    </div>
                    {taskDone.map((task, index) => (
                        <Card key={index} className="py-2 gap-4">
                            <CardHeader className="px-2.5 pb-1.5">
                                <CardTitle className="flex text-sm font-normal gap-2">
                                    <StickyNote className="h-5 w-5" /> {task.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs px-2.5 pb-1.5">
                                <div className="flex items-center gap-[6px] rounded-2xl bg-[#acffda] bg-opacity-25 w-[110px] h-[18px] px-2">
                                    <div className="h-[8px] w-[8px] bg-[#28C780] rounded-full"></div>
                                    <p className=" text-sm">{taskStatusDone?.label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    <Button onClick={handleAddTaskDone} className="bg-muted text-muted-foreground border justify-start" variant={"outline"}>
                        <Plus /> New task
                    </Button>
                </Card>
            </section>
        </main>
    );
}
