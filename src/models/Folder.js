import mongoose from "mongoose";

const folderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

folderSchema.virtual("documents", {
    ref: "Document",  //model 
    localField: "_id", //field in the folder model
    foreignField: "folder", //field in the document
})

//virtual field included in JSON responses
folderSchema.set("toObject", { virtuals: true });
folderSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Folder", folderSchema);
