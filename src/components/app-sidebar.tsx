import * as React from "react";

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarRail } from "@/components/ui/sidebar";

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

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    users: { email: string }[];
    close: () => void;
    task?: ITask;
    onUpdateUser: (taskId: string, userId: string) => Promise<void>;
}

export function AppSidebar({ users = [], close, task, ...props }: AppSidebarProps) {
    return (
        <Sidebar {...props}>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Task Details</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-4 p-2">
                            <SidebarMenuItem>
                                <span className="font-medium">Name: {task?.name}</span>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <span>Description: {task?.description}</span>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <span>Priority: {task?.priority}</span>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <span>Status: {task?.status}</span>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <span>Created at: {task?.createdAt}</span>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <span>Assignee: {task?.user?.email}</span>
                                <select defaultValue={task?.user?.email}>
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
