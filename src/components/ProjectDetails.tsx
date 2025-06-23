import { useParams } from "react-router-dom";
import { priorities, statuses } from "../data/data";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "@/components/ui/button";
import { Plus, StickyNote } from "lucide-react";
import { UserStory } from "@/UserStory/UserStory";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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

export default function ProjectDetails() {
    const { slug } = useParams();
    const creationDate = new Date().toISOString();
    const projects = JSON.parse(localStorage.getItem("formValues") || "[]");
    const project = projects.find((p: { name: string }) => p.name === slug);

    const [userStories, setUserStories] = useState<IUserStory[]>([]);

    const status = statuses.find((status) => status.value === project.status);

    const notStartedStories = userStories.filter((story) => story.status === "not started");
    const inProgressStories = userStories.filter((story) => story.status === "in progress");
    const doneStories = userStories.filter((story) => story.status === "done");

    const priority = priorities.find((priority) => priority.value === project.priority);

    const handleAddUserStory = (status: string) => {
        const newUserStory = new UserStory(Date.now(), "User Story", "", "", project?.name || "", creationDate, status, {});
        setUserStories((prev) => [...prev, newUserStory]);
    };

    useEffect(() => {
        localStorage.setItem("userStories", JSON.stringify(userStories));
    }, [userStories]);

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
                    <div className="flex items-center gap-[6px] rounded-2xl bg-[#d8d8d8] bg-opacity-25 w-[130px] h-[20px] px-2 my-2">
                        <div className="h-[8px] w-[8px] bg-[#979797] rounded-full"></div>
                        <p className=" text-sm ">Not started</p>
                    </div>
                    {notStartedStories.map((story, index) => (
                        <Link to={`${story.id}`} key={index}>
                            <Card className="py-2 gap-4">
                                <CardHeader className="px-2.5 pb-1.5">
                                    <CardTitle className="flex text-sm font-normal gap-2">
                                        <StickyNote className="h-5 w-5" /> {story.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-xs px-2.5 pb-1.5">
                                    <div className="flex items-center gap-[6px] rounded-2xl bg-[#d8d8d8] bg-opacity-25 w-[130px] h-[18px] px-2">
                                        <div className="h-[8px] w-[8px] bg-[#979797] rounded-full"></div>
                                        <p className="text-sm">Not Started</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                    <Button onClick={() => handleAddUserStory("not started")} className="bg-muted text-muted-foreground border justify-start" variant={"outline"}>
                        <Plus /> New story
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
                    <Button onClick={() => handleAddUserStory("in progress")} className="bg-muted text-muted-foreground border justify-start" variant={"outline"}>
                        <Plus /> New story
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
                    <Button onClick={() => handleAddUserStory("done")} className="bg-muted text-muted-foreground border justify-start" variant={"outline"}>
                        <Plus /> New story
                    </Button>
                </Card>
            </section>
        </main>
    );
}
