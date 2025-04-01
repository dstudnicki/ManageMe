import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface Project {
    name: string;
    title: string;
    status: string;
    priority: string;
}

export default function CreateProject() {
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState<Project>({
        name: "",
        title: "",
        status: "",
        priority: "",
    });
    const [formValues, setFormValues] = useState<Project[]>([]);

    const handleFormSubmit = () => {
        setFormValues((prevFormValues) => [...prevFormValues, initialValues]);
        navigate("/");
    };

    useEffect(() => {
        localStorage.setItem("formValues", JSON.stringify(formValues));
    }, [formValues]);

    return (
        <Card className="w-[500px]">
            <CardHeader>
                <CardTitle>Create project</CardTitle>
                <CardDescription>Deploy your new project in one-click.</CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">Project name</Label>
                            <Input onChange={(e) => setInitialValues({ ...initialValues, name: e.target.value })} id="name" value={initialValues.name} placeholder="Name of your project" />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="title">Project title</Label>
                            <Input onChange={(e) => setInitialValues({ ...initialValues, title: e.target.value })} id="title" value={initialValues.title} placeholder="Title of your project" />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="status">Status</Label>
                            <Select onValueChange={(value) => setInitialValues({ ...initialValues, status: value })} value={initialValues.status}>
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    <SelectItem value="backlog">Backlog</SelectItem>
                                    <SelectItem value="todo">Todo</SelectItem>
                                    <SelectItem value="in progress">In Progress</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="priority">Priority</Label>
                            <Select onValueChange={(value) => setInitialValues({ ...initialValues, priority: value })} value={initialValues.priority}>
                                <SelectTrigger id="priority">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button onClick={handleFormSubmit}>Add</Button>
            </CardFooter>
        </Card>
    );
}
