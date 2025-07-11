import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import ErrorPage from "./error-page";
import { createBrowserRouter, RouterProvider } from "react-router";
import CreateProjectRoute from "./routes/CreateProjectRoute.tsx";
import ProjectDetailsRoute from "./routes/ProjectDetailsRoute.tsx";
import UserStoriesDetailsRoute from "./routes/UserStoriesDetailsRoute.tsx";
import LoginPageRoute from "./routes/LoginPageRoute.tsx";
import RegisterPageRoute from "./routes/RegisterPageRoute.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/create-project",
        element: <CreateProjectRoute />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/:id",
        element: <ProjectDetailsRoute />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/:id/:id",
        element: <UserStoriesDetailsRoute />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/login",
        element: <LoginPageRoute />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/register",
        element: <RegisterPageRoute />,
        errorElement: <ErrorPage />,
    },
]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
