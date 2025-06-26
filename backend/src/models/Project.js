const mongoose = require("mongoose");
const { Schema } = mongoose;

const projectSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
    },
    title: {
        type: String,
        required: [true, "Please provide a title"],
    },
    status: {
        type: String,
        required: [true, "Please select state"],
    },
    priority: {
        type: String,
        required: [true, "Please select priority"],
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

module.exports = mongoose.model("Project", projectSchema);
