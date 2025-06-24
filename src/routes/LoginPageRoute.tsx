import LoginForm from "@/components/LoginForm";

export default function LoginPageRoute() {
    return (
        <main className="p-24 flex justify-center">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">Log into your account.</h1>
                    <p className="text-sm text-muted-foreground">Please enter your credentials below.</p>
                </div>
                <LoginForm />
            </div>
        </main>
    );
}
