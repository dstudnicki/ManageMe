import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormItem, FormLabel, FormMessage, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";

const formSchema = z.object({
    email: z.string().min(2, "Email must be at least 2 characters long").max(50, "Email must be at most 50 characters long").email("This is not a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters long").max(50, "Password must be at most 50 characters long"),
});

export default function LoginForm() {
    const [loginError, setLoginError] = useState({ email: "", password: "" });
    // const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoginError({ email: "", password: "" });

        const response = await login(values.email, values.password);
        console.log("Login response:", response);

        if (response?.error) {
            setLoginError({
                email: "Invalid email or password.",
                password: "Invalid email or password.",
            });
        } else {
            navigate("/", { replace: true });
        }
    }

    return (
        <div className="grid gap-6">
            <Form {...form}>
                {loginError.email && <p className="text-red-500">{loginError.email}</p>}
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="johndoe@email.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Sign in</Button>
                </form>
            </Form>
        </div>
    );
}
