import RegisterForm from "@/components/RegisterForm";

export default function RegisterPageRoute() {
    return (
        <main className="p-24 flex justify-center">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
                    <p className="text-sm text-muted-foreground">Enter your email below to create your account</p>
                </div>
                <RegisterForm />
            </div>
        </main>
    );
}
