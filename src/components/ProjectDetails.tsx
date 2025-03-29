import { useParams } from "react-router-dom";

export default function ProjectDetails() {
    const { slug } = useParams();
    const projects = JSON.parse(localStorage.getItem("formValues") || "[]");
    const project = projects.find((p: { name: string }) => p.name === slug);

    if (!project) return <p>Project not found</p>;

    return (
        <>
            <h1>{project.name}</h1>
            <h3>{project.title}</h3>
            <span>{project.status}</span>
            <span>{project.priority}</span>
        </>
    );
}
