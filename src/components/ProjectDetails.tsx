import { useParams } from "react-router-dom";
import { priorities, statuses } from "../data/data";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "@/components/ui/button";
import { Plus, StickyNote } from "lucide-react";
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { api } from "@/services/api";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface IUserStory {
    _id: string;
    name: string;
    description: string;
    priority: string;
    project: {
        _id: string | undefined;
    };
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

interface IUser {
    _id: string;
    email: string;
}

export default function ProjectDetails() {
    const { id } = useParams();
    const creationDate = new Date().toISOString();
    const [projects, setProjects] = useState<IProject[]>([]);
    const project = projects.find((p: { _id: string }) => p._id === id);
    const [userStories, setUserStories] = useState<IUserStory[]>([]);
    const [users, setUsers] = useState<IUser[]>([]);
    const [selectedStory, setSelectedStory] = useState<IUserStory | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const notStartedStories = userStories.filter((story) => story.status === "not started");
    const inProgressStories = userStories.filter((story) => story.status === "in progress");
    const doneStories = userStories.filter((story) => story.status === "done");

    const [editName, setEditName] = useState("");
    const [editTitle, setEditTitle] = useState("");
    const [editStatus, setEditStatus] = useState("");
    const [editPriority, setEditPriority] = useState("");

    useEffect(() => {
        if (project) {
            setEditName(project.name);
            setEditTitle(project.title);
            setEditStatus(project.status);
            setEditPriority(project.priority);
        }
    }, [project]);

    const fetchUserStories = async () => {
        try {
            const { data: stories } = await api.get("/stories");
            const filteredStories = stories.filter((story: IUserStory) => story.project && story.project._id === id);
            const sortedStories = filteredStories.sort((a: IUserStory, b: IUserStory) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setUserStories(sortedStories);
        } catch (error) {
            console.error("Error fetching user stories:", error);
        }
    };

    const fetchProjects = async () => {
        try {
            const { data: projects } = await api.get("/projects");
            setProjects(projects);
        } catch (error) {
            console.error("Error fetching projects:", error);
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
        const fetchUsers = async () => {
            try {
                const { data } = await api.get("/user");
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchProjects();
        fetchUserStories();
        fetchUsers();
    }, []);

    const updateProjectField = async (field: keyof IProject, value: string) => {
        if (!project) return;
        try {
            await api.patch(`/projects/${project._id}`, {
                [field]: value,
            });
            await fetchProjects();
        } catch (error) {
            console.error(`Failed to update project ${field}:`, error);
        }
    };

    const handleBlurOrEnter = (field: keyof IProject, value: string) => async (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement> | React.KeyboardEvent) => {
        if ("key" in e && e.key !== "Enter" && e.type === "keydown") {
            return;
        }
        await updateProjectField(field, value);
    };

    const handleOpenSidebar = (story: IUserStory) => {
        setSidebarOpen(true);
        setSelectedStory(story);
    };

    const handleCloseSidebar = () => {
        setSidebarOpen(false);
        setSelectedStory(null);
    };

    const updateStoryUser = async (storyId: string, userId: string) => {
        try {
            await api.patch(`/stories/${storyId}`, {
                user: userId,
            });

            await fetchUserStories();
            const updated = await api.get(`/stories/${storyId}`);
            setSelectedStory(updated.data);
        } catch (error) {
            console.error("Failed to update task user:", error);
        }
    };

    const updateStoryName = async (storyId: string, name: string) => {
        console.log("Updating task:", storyId, "with name:", name);
        try {
            await api.patch(`/stories/${storyId}`, { name });
            await fetchUserStories();
            const updated = await api.get(`/stories/${storyId}`);
            setSelectedStory(updated.data);
        } catch (error) {
            console.error("Failed to update task name :", error);
        }
    };

    const updateStoryDescription = async (storyId: string, description: string) => {
        try {
            await api.patch(`/stories/${storyId}`, { description });
            await fetchUserStories();
            const updated = await api.get(`/stories/${storyId}`);
            setSelectedStory(updated.data);
        } catch (error) {
            console.error("Failed to update task  description:", error);
        }
    };

    const updateStoryPriority = async (storyId: string, priority: string) => {
        try {
            await api.patch(`/stories/${storyId}`, { priority });
            await fetchUserStories();
            const updated = await api.get(`/stories/${storyId}`);
            setSelectedStory(updated.data);
        } catch (error) {
            console.error("Failed to update task priority:", error);
        }
    };

    const updateStoryStatus = async (storyId: string, status: string) => {
        try {
            await api.patch(`/stories/${storyId}`, { status });
            await fetchUserStories();
            const updated = await api.get(`/stories/${storyId}`);
            setSelectedStory(updated.data);
        } catch (error) {
            console.error("Failed to update task status:", error);
        }
    };

    return (
        <main className="flex flex-col px-4 text-xl xl:container sm:px-8 lg:px-12">
            <section className="mt-6 mb-4 rounded-2xl bg-muted/50 p-6 shadow-sm space-y-5">
                <div>
                    <input
                        type="text"
                        className="w-full text-3xl font-bold bg-transparent border-b-2 border-muted-foreground focus:outline-none focus:border-primary transition-colors"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={handleBlurOrEnter("name", editName)}
                        onKeyDown={handleBlurOrEnter("name", editName)}
                        aria-label="Edit project name"
                        placeholder="Project name"
                    />
                </div>

                <div>
                    <input
                        type="text"
                        className="w-full text-base text-muted-foreground bg-transparent border-b border-muted-foreground focus:outline-none focus:border-primary transition-colors"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={handleBlurOrEnter("title", editTitle)}
                        onKeyDown={handleBlurOrEnter("title", editTitle)}
                        aria-label="Edit project title"
                        placeholder="Project subtitle or tagline"
                    />
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <label className="text-sm font-medium text-muted-foreground">Status:</label>
                        <select
                            className="min-w-[140px] px-3 py-1.5 rounded-md border border-muted-foreground bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            value={editStatus}
                            onChange={(e) => {
                                setEditStatus(e.target.value);
                                updateProjectField("status", e.target.value);
                            }}
                            aria-label="Edit project status">
                            {statuses.map((s) => (
                                <option key={s.value} value={s.value}>
                                    {s.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <label className="text-sm font-medium text-muted-foreground">Priority:</label>
                        <select
                            className="min-w-[140px] px-3 py-1.5 rounded-md border border-muted-foreground bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            value={editPriority}
                            onChange={(e) => {
                                setEditPriority(e.target.value);
                                updateProjectField("priority", e.target.value);
                            }}
                            aria-label="Edit project priority">
                            {priorities.map((p) => (
                                <option key={p.value} value={p.value}>
                                    {p.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            <section className="mt-6 grid grid-rows-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="flex flex-col bg-muted gap-2 p-2">
                    <div className="flex items-center gap-[6px] rounded-2xl bg-[#d8d8d8] bg-opacity-25 w-[130px] h-[20px] px-2 my-2">
                        <div className="h-[8px] w-[8px] bg-[#979797] rounded-full"></div>
                        <p className=" text-sm ">Not started</p>
                    </div>
                    {notStartedStories.map((story, index) => (
                        <Card key={index} className="py-2 gap-4" onClick={() => handleOpenSidebar(story)}>
                            <CardHeader className="flex-row items-center justify-between px-2.5 pb-1.5">
                                <CardTitle className="flex text-sm font-normal gap-2">
                                    <StickyNote className="h-5 w-5" /> {story.name}
                                </CardTitle>
                                <CardContent className="flex p-0">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
                                                <MoreHorizontal />
                                                <span className="sr-only">Open menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-[160px]">
                                            <DropdownMenuItem
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteStory(story._id);
                                                }}>
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted" onClick={(e) => e.stopPropagation()}>
                                        <Link to={`/${story.project._id}/${story._id}`}>
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </CardHeader>
                            <CardContent className="text-xs px-2.5 pb-1.5">
                                <div className="flex items-center gap-[6px] rounded-2xl bg-[#d8d8d8] bg-opacity-25 w-[130px] h-[18px] px-2">
                                    <div className="h-[8px] w-[8px] bg-[#979797] rounded-full"></div>
                                    <p className="text-sm">Not Started</p>
                                </div>
                            </CardContent>
                        </Card>
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
                        <Card key={index} className="py-2 gap-4" onClick={() => handleOpenSidebar(story)}>
                            <CardHeader className="flex-row items-center justify-between px-2.5 pb-1.5">
                                <CardTitle className="flex text-sm font-normal gap-2">
                                    <StickyNote className="h-5 w-5" /> {story.name}
                                </CardTitle>
                                <CardContent className="flex p-0">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
                                                <MoreHorizontal />
                                                <span className="sr-only">Open menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-[160px]">
                                            <DropdownMenuItem
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteStory(story._id);
                                                }}>
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted" onClick={(e) => e.stopPropagation()}>
                                        <Link to={`/${story.project._id}/${story._id}`}>
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardContent>
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
                        <Card key={index} className="py-2 gap-4" onClick={() => handleOpenSidebar(story)}>
                            <CardHeader className="flex-row items-center justify-between px-2.5 pb-1.5">
                                <CardTitle className="flex text-sm font-normal gap-2">
                                    <StickyNote className="h-5 w-5" /> {story.name}
                                </CardTitle>
                                <CardContent className="flex p-0">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
                                                <MoreHorizontal />
                                                <span className="sr-only">Open menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-[160px]">
                                            <DropdownMenuItem
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteStory(story._id);
                                                }}>
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted" onClick={(e) => e.stopPropagation()}>
                                        <Link to={`/${story.project._id}/${story._id}`}>
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardContent>
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
            <SidebarProvider>
                {sidebarOpen && selectedStory && (
                    <AppSidebar
                        typeLabel="Task"
                        side="right"
                        entity={selectedStory}
                        close={() => handleCloseSidebar()}
                        users={users}
                        onUpdateName={updateStoryName}
                        onUpdateDescription={updateStoryDescription}
                        onUpdateUser={updateStoryUser}
                        onUpdatePriority={updateStoryPriority}
                        onUpdateStatus={updateStoryStatus}
                    />
                )}
            </SidebarProvider>
        </main>
    );
}
