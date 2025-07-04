require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db_config");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const projectsRoutes = require("./routes/projects");
const storiesRoutes = require("./routes/stories");
const taskRoutes = require("./routes/tasks");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/projects", projectsRoutes);
app.use("/stories", storiesRoutes);
app.use("/tasks", taskRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
