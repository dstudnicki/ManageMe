import * as React from "react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarRail } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";

interface IEntity {
    _id: string;
    name: string;
    description: string;
    priority: string;
    status: string;
    createdAt: string;
    user: {
        _id?: string;
        email: string;
    };
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    users: { _id?: string; email: string }[];
    close: () => void;
    entity?: IEntity;
    onUpdateUser: (id: string, userId: string) => Promise<void>;
    onUpdatePriority: (id: string, priority: string) => Promise<void>;
    onUpdateStatus: (id: string, status: string) => Promise<void>;
    onUpdateName: (id: string, name: string) => void;
    onUpdateDescription: (id: string, description: string) => void;
    typeLabel: "Task" | "User Story";
}

export function AppSidebar({ users = [], close, entity, onUpdateUser, onUpdatePriority, onUpdateStatus, onUpdateName, onUpdateDescription, typeLabel, ...props }: AppSidebarProps) {
    const [name, setName] = useState(entity?.name ?? "");
    const [description, setDescription] = useState(entity?.description ?? "");

    useEffect(() => {
        setName(entity?.name ?? "");
        setDescription(entity?.description ?? "");
    }, [entity?.name, entity?.description]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value);
    };

    const handleNameBlur = () => {
        if (entity && name !== entity.name) {
            onUpdateName(entity._id, name);
        }
    };

    const handleDescriptionBlur = () => {
        if (entity && description !== entity.description) {
            onUpdateDescription(entity._id, description);
        }
    };

    return (
        <Sidebar {...props}>
            <SidebarContent className="p-4">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-lg font-semibold mb-2">{typeLabel} Details</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-4">
                            <SidebarMenuItem className="flex flex-col gap-1">
                                <span className="text-muted-foreground text-sm">Name</span>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={handleNameChange}
                                    onBlur={handleNameBlur}
                                    className="font-medium text-base text-foreground bg-transparent border-none outline-none p-0 m-0"
                                />
                            </SidebarMenuItem>

                            <SidebarMenuItem className="flex flex-col gap-1">
                                <span className="text-muted-foreground text-sm">Description</span>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={handleDescriptionChange}
                                    onBlur={handleDescriptionBlur}
                                    className="font-medium text-base text-foreground bg-transparent border-none outline-none p-0 m-0"
                                />
                            </SidebarMenuItem>

                            <SidebarMenuItem className="flex flex-col gap-1">
                                <label htmlFor="priority" className="text-muted-foreground text-sm">
                                    Priority
                                </label>
                                <select
                                    id="priority"
                                    className="border rounded-md px-3 py-1 bg-background text-sm"
                                    value={entity?.priority}
                                    onChange={(e) => entity && onUpdatePriority(entity._id, e.target.value)}>
                                    <option disabled value="">
                                        Select priority...
                                    </option>
                                    {["low", "medium", "high"].map((p) => (
                                        <option key={p} value={p}>
                                            {p.charAt(0).toUpperCase() + p.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </SidebarMenuItem>

                            <SidebarMenuItem className="flex flex-col gap-1">
                                <label htmlFor="status" className="text-muted-foreground text-sm">
                                    Status
                                </label>
                                <select
                                    id="status"
                                    className="border rounded-md px-3 py-1 bg-background text-sm"
                                    value={entity?.status}
                                    onChange={(e) => entity && onUpdateStatus(entity._id, e.target.value)}>
                                    <option disabled value="">
                                        Select status...
                                    </option>
                                    {["not started", "in progress", "done"].map((s) => (
                                        <option key={s} value={s}>
                                            {s.charAt(0).toUpperCase() + s.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </SidebarMenuItem>

                            <SidebarMenuItem className="flex flex-col gap-1">
                                <span className="text-muted-foreground text-sm">Created At</span>
                                <span className="text-base text-foreground">{entity?.createdAt ? new Date(entity.createdAt).toLocaleDateString() : "-"}</span>
                            </SidebarMenuItem>

                            <SidebarMenuItem className="flex flex-col gap-1">
                                <label htmlFor="assignee" className="text-muted-foreground text-sm">
                                    Assignee
                                </label>
                                <select
                                    id="assignee"
                                    className="border rounded-md px-3 py-1 bg-background text-sm"
                                    value={entity?.user?.email}
                                    onChange={(e) => {
                                        const selectedUser = users.find((u) => u.email === e.target.value);
                                        if (selectedUser && entity) {
                                            onUpdateUser(entity._id, selectedUser._id ?? "");
                                        }
                                    }}>
                                    <option value="" disabled>
                                        Select a user...
                                    </option>
                                    {users.map((user, index) => (
                                        <option key={index} value={user.email}>
                                            {user.email}
                                        </option>
                                    ))}
                                </select>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail onClick={close} />
        </Sidebar>
    );
}
