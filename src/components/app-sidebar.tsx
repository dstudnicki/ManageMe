import * as React from "react";

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from "@/components/ui/sidebar";

// This is sample data.
// const data = {
//     navMain: [
//         {
//             title: "Getting Started",
//             url: "#",
//             items: [
//                 {
//                     title: "Installation",
//                     url: "#",
//                 },
//                 {
//                     title: "Project Structure",
//                     url: "#",
//                 },
//             ],
//         },
//         {
//             title: "Building Your Application",
//             url: "#",
//             items: [
//                 {
//                     title: "Routing",
//                     url: "#",
//                 },
//                 {
//                     title: "Data Fetching",
//                     url: "#",
//                     isActive: true,
//                 },
//                 {
//                     title: "Rendering",
//                     url: "#",
//                 },
//                 {
//                     title: "Caching",
//                     url: "#",
//                 },
//                 {
//                     title: "Styling",
//                     url: "#",
//                 },
//                 {
//                     title: "Optimizing",
//                     url: "#",
//                 },
//                 {
//                     title: "Configuring",
//                     url: "#",
//                 },
//                 {
//                     title: "Testing",
//                     url: "#",
//                 },
//                 {
//                     title: "Authentication",
//                     url: "#",
//                 },
//                 {
//                     title: "Deploying",
//                     url: "#",
//                 },
//                 {
//                     title: "Upgrading",
//                     url: "#",
//                 },
//                 {
//                     title: "Examples",
//                     url: "#",
//                 },
//             ],
//         },
//         {
//             title: "API Reference",
//             url: "#",
//             items: [
//                 {
//                     title: "Components",
//                     url: "#",
//                 },
//                 {
//                     title: "File Conventions",
//                     url: "#",
//                 },
//                 {
//                     title: "Functions",
//                     url: "#",
//                 },
//                 {
//                     title: "next.config.js Options",
//                     url: "#",
//                 },
//                 {
//                     title: "CLI",
//                     url: "#",
//                 },
//                 {
//                     title: "Edge Runtime",
//                     url: "#",
//                 },
//             ],
//         },
//         {
//             title: "Architecture",
//             url: "#",
//             items: [
//                 {
//                     title: "Accessibility",
//                     url: "#",
//                 },
//                 {
//                     title: "Fast Refresh",
//                     url: "#",
//                 },
//                 {
//                     title: "Next.js Compiler",
//                     url: "#",
//                 },
//                 {
//                     title: "Supported Browsers",
//                     url: "#",
//                 },
//                 {
//                     title: "Turbopack",
//                     url: "#",
//                 },
//             ],
//         },
//         {
//             title: "Community",
//             url: "#",
//             items: [
//                 {
//                     title: "Contribution Guide",
//                     url: "#",
//                 },
//             ],
//         },
//     ],
// };

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

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    users: { username: string }[];
    close: () => void;
    task?: ITask;
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
                                <span>Assignee: {task?.user}</span>
                                <select defaultValue={task?.user}>
                                    <option value="" disabled>
                                        Select a user...
                                    </option>
                                    {users.map((user, index) => (
                                        <option key={index} value={user.username}>
                                            {user.username}
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
