import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { Users } from "@/User/User";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

export function UserNav() {
    const { logout, user, fetchMyProfile } = useAuth();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const handleAuthentication = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            await fetchMyProfile();
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    };

    const handleLogout = () => {
        logout();
        handleAuthentication();
    };

    useEffect(() => {
        const onStorageChange = () => handleAuthentication();
        handleAuthentication();
        window.addEventListener("storage", onStorageChange);

        return () => {
            window.removeEventListener("storage", onStorageChange);
        };
    }, []);

    return (
        <>
            {isAuthenticated ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src="/avatars/03.png" alt="@shadcn" />
                                <AvatarFallback>SC</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user?.email}</p>
                                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                Settings
                                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                            Log out
                            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <>
                    <Button asChild variant="outline">
                        <Link to="./login">Sign in</Link>
                    </Button>
                    <Button asChild>
                        <Link to="./register">Sign up</Link>
                    </Button>
                </>
            )}
        </>
    );
}
