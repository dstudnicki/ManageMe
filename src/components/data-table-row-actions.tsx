import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { api } from "@/services/api";

interface DataTableRowActionsProps {
    projectId: string;
    onDelete?: (id: string) => void;
}

export function DataTableRowActions({ projectId, onDelete }: DataTableRowActionsProps) {
    const deleteProject = async () => {
        try {
            await api.delete(`/projects/${projectId}`);
            if (onDelete) {
                onDelete(projectId);
            } else {
                window.location.reload();
            }
        } catch (error) {
            console.error("Failed to delete post:", error);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
                    <MoreHorizontal />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem onClick={deleteProject}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
