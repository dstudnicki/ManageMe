import { useParams } from "react-router-dom";
import { priorities, statuses } from "../data/data";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "@/components/ui/button";
import { Plus, StickyNote } from "lucide-react";

export default function ProjectDetails() {
    const { slug } = useParams();
    const projects = JSON.parse(localStorage.getItem("formValues") || "[]");
    const project = projects.find((p: { name: string }) => p.name === slug);
    const status = statuses.find((status) => status.value === project.status);
    const priority = priorities.find((priority) => priority.value === project.priority);

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
                        <p className="hidden text-sm md:block">Not started</p>
                    </div>
                    {/* map not started */}
                    <Card className="py-2 gap-4">
                        <CardHeader className="px-2.5 pb-1.5">
                            <CardTitle className="flex text-sm font-normal gap-2">
                                <StickyNote className="h-5 w-5" /> Dodac profile postaci (2 lub 3 darmowe a reszta platna
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs px-2.5 pb-1.5">
                            <div className="flex items-center gap-[6px] rounded-2xl bg-[#d8d8d8] bg-opacity-25 w-[90px] h-[18px] px-2">
                                <div className="h-[8px] w-[8px] bg-[#979797] rounded-full"></div>
                                <p className="hidden md:block">{status?.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Button className="bg-muted text-muted-foreground border justify-start" variant={"outline"}>
                        <Plus /> New task
                    </Button>
                </Card>
                <Card className="flex flex-col bg-muted gap-2 p-2">
                    <div className="flex items-center gap-[6px] rounded-2xl bg-[#adefff] bg-opacity-25 w-[110px] h-[20px] px-2 my-2">
                        <div className="h-[8px] w-[8px] bg-[#5ed0ec] rounded-full"></div>
                        <p className="hidden text-sm text-[#092f38]  md:block">In progress</p>
                    </div>
                    {/* map progress */}
                    <Card className="py-2 gap-4">
                        <CardHeader className="px-2.5 pb-1.5">
                            <CardTitle className="flex text-sm font-normal gap-2">
                                <StickyNote className="h-5 w-5" /> Dodac profile postaci (2 lub 3 darmowe a reszta platna
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs px-2.5 pb-1.5">
                            <div className="flex items-center gap-[6px] rounded-2xl bg-[#adefff] bg-opacity-25 w-[90px] h-[18px] px-2">
                                <div className="h-[8px] w-[8px] bg-[#5ed0ec]  rounded-full"></div>
                                <p className="hidden text-[#092f38] md:block">{status?.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Button className="bg-muted text-muted-foreground border justify-start" variant={"outline"}>
                        <Plus /> New task
                    </Button>
                </Card>
                <Card className="flex flex-col bg-muted gap-2 p-2">
                    <div className="flex items-center gap-[6px] rounded-2xl bg-[#acffda] bg-opacity-25 w-[110px] h-[20px] px-2 my-2">
                        <div className="h-[8px] w-[8px] bg-[#28C780] rounded-full"></div>
                        <p className="hidden text-sm text-[#053821] md:block">Done</p>
                    </div>
                    {/* map done */}
                    <Card className="py-2 gap-4">
                        <CardHeader className="px-2.5 pb-1.5">
                            <CardTitle className="flex text-sm font-normal gap-2">
                                <StickyNote className="h-5 w-5" /> Dodac profile postaci (2 lub 3 darmowe a reszta platna
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs px-2.5 pb-1.5">
                            <div className="flex items-center gap-[6px] rounded-2xl bg-[#acffda]  bg-opacity-25 w-[90px] h-[18px] px-2">
                                <div className="h-[8px] w-[8px] bg-[#28C780] rounded-full"></div>
                                <p className="hidden text-[#053821] md:block">{status?.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Button className="bg-muted text-muted-foreground border justify-start" variant={"outline"}>
                        <Plus /> New task
                    </Button>
                </Card>
            </section>
        </main>
    );
}
