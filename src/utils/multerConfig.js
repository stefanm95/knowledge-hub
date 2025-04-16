import multer from "multer";
import path from "path";

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in the "uploads" folder
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now(); // Current timestamp
    const originalName = path.basename(file.originalname, path.extname(file.originalname)); // Original file name without extension
    const extension = path.extname(file.originalname); // File extension

    // Combine original name, timestamp, and extension
    const newFileName = `${originalName}-${timestamp}${extension}`;
    cb(null, newFileName);
  },
});

// File filter to allow only specific file types
const fileFilter = (req, file, cb) => {
//   console.log("File type:", file.mimetype);
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/msword",
    "text/plain",
    "text/markdown",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only PDF, DOCX, and Markdown files are allowed."
      )
    );
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
