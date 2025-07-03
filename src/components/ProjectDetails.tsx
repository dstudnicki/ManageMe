import { useParams } from "react-router-dom";
import { priorities, statuses } from "../data/data";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "@/components/ui/button";
import { Plus, StickyNote } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/services/api";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface IUserStory {
    _id: string;
    name: string;
    description: string;
    priority: string;
    project: string;
    createdAt: string;
    status: string;
    tasks: object;
    user: {
        _id: string | undefined;
        email: string;
    };
}

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

export default function ProjectDetails() {
    const { slug } = useParams();
    const creationDate = new Date().toISOString();
    const [projects, setProjects] = useState<IProject[]>([]);
    const [userStories, setUserStories] = useState<IUserStory[]>([]);
    const project = projects.find((p: { name: string }) => p.name === slug);
    console.log(userStories);

    const fetchUserStories = async () => {
        try {
            const { data: stories } = await api.get("/stories");
            const sortedStories = stories.sort((a: IUserStory, b: IUserStory) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setUserStories(sortedStories);
        } catch (error) {
            console.error("Error fetching user stories:", error);
        }
    };

    const handleAddUserStory = async (status: string) => {
        try {
            await api.post(
                "/stories",
                {
                    name: "New User Story",
                    description: "lalalla",
                    priority: project?.priority || "low",
                    project: project?._id,
                    createdAt: creationDate,
                    status: status,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            await fetchUserStories();
        } catch (error) {
            console.error("Failed to add user story:", error);
        }
    };

    const deleteStory = async (storyId: string) => {
        try {
            await api.delete(`/stories/${storyId}`);
            setUserStories((prevStories) => prevStories.filter((story) => story._id !== storyId));
        } catch (error) {
            console.error("Failed to delete post:", error);
        }
    };

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data: projects } = await api.get("/projects");
                setProjects(projects);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };

        fetchProjects();
        fetchUserStories();
    }, []);

    const status = statuses.find((status) => status.value === project?.status);

    const notStartedStories = userStories.filter((story) => story.status === "not started");
    const inProgressStories = userStories.filter((story) => story.status === "in progress");
    const doneStories = userStories.filter((story) => story.status === "done");
    const priority = priorities.find((priority) => priority.value === project?.priority);

    // useEffect(() => {
    //     localStorage.setItem("userStories", JSON.stringify(userStories));
    // }, [userStories]);

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
                        <Link to={`${story._id}`} key={index}>
                            <Card className="py-2 gap-4">
                                <CardHeader className="flex-row items-center justify-between px-2.5 pb-1.5">
                                    <CardTitle className="flex text-sm font-normal gap-2">
                                        <StickyNote className="h-5 w-5" /> {story.name}
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
                                            <DropdownMenuItem onClick={() => deleteStory(story._id)}>Delete</DropdownMenuItem>
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
                            <CardHeader className="flex-row items-center justify-between px-2.5 pb-1.5">
                                <CardTitle className="flex text-sm font-normal gap-2">
                                    <StickyNote className="h-5 w-5" /> {story.name}
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
                                        <DropdownMenuItem onClick={() => deleteStory(story._id)}>Delete</DropdownMenuItem>
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
                            <CardHeader className="flex-row items-center justify-between px-2.5 pb-1.5">
                                <CardTitle className="flex text-sm font-normal gap-2">
                                    <StickyNote className="h-5 w-5" /> {story.name}
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
                                        <DropdownMenuItem onClick={() => deleteStory(story._id)}>Delete</DropdownMenuItem>
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
                    <Button onClick={() => handleAddUserStory("done")} className="bg-muted text-muted-foreground border justify-start" variant={"outline"}>
                        <Plus /> New story
                    </Button>
                </Card>
            </section>
        </main>
    );
}
