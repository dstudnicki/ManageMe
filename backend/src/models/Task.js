const mongoose = require("mongoose");
const { Schema } = mongoose;

const taskSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
    },
    description: {
        type: String,
        required: [true, "Please provide a description"],
    },
    status: {
        type: String,
        required: [true, "Please select state"],
    },
    priority: {
        type: String,
        required: [true, "Please select priority"],
    },
    story: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Story", storySchema);
