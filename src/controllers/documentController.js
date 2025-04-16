import Document from "../models/Document.js";

export const createDocument = async (req, res) => {
  const { title, content, folder } = req.body;
  const userId = req.user._id;

  try {
    const document = new Document({
      title,
      content,
      folder: folder || null,
      createdBy: userId,
    });

    await document.save();
    return res
      .status(201)
      .json({ message: "Document created successfully", document });
  } catch (error) {
    console.error("Error creating document:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileUrl = `/uploads/${req.file.filename}`; // File path relative to the server
    return res.status(200).json({
      message: "File uploaded successfully",
      fileUrl,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
