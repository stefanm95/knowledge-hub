import Tesseract from "tesseract.js";
import fs from "fs/promises";
import mammoth from "mammoth";
import ExcelJS from "exceljs";
import pdf from "pdf-poppler";
import path from "path";
import pdfParse from "pdf-parse";
import Document from "../models/Document.js";
import { summarizeText } from "../utils/huggingFace.js";

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

    const userId = req.user._id;
    const filePath = path.join("uploads", req.file.filename);
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    const { folder } = req.body; // Get folder from request body

    let content = "";

    // Extract content based on file type
    if (fileExtension === ".pdf") {
      console.log("File path: ", filePath);
      const fileBuffer = await fs.readFile(filePath);
      const pdfData = await pdfParse(fileBuffer);

      if (pdfData.text.trim()) {
        console.log("Extracted PDF content: ", pdfData.text); // Log the extracted content
        content = pdfData.text;
      } else {
        console.log("No text found in PDF. Attempting OCR...");

        // Convert PDF to images
        const outputDir = path.join("uploads", "images");
        const options = {
          format: "jpeg",
          out_dir: outputDir,
          out_prefix: path.basename(filePath, path.extname(filePath)),
          page: null, // Convert all pages
        };

        try {
          await pdf.convert(filePath, options);
          console.log("PDF converted to images successfully.");

          // Perform OCR on each image
          const imageFiles = await fs.readdir(outputDir);
          const ocrResults = [];

          for (const imageFile of imageFiles) {
            const imagePath = path.join(outputDir, imageFile);
            const ocrResult = await Tesseract.recognize(imagePath, "eng");
            ocrResults.push(ocrResult.data.text);
          }

          content = ocrResults.join("\n");
          console.log("Extracted OCR content: ", content);
        } catch (error) {
          console.error(
            "Error converting PDF to images or performing OCR:",
            error
          );
          content = "No extractable text found in the PDF file.";
        }
      }
    } else if (fileExtension === ".docx") {
      const fileBuffer = await fs.readFile(filePath);
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      content = result.value;
    } else if (fileExtension === ".txt" || fileExtension === ".md") {
      content = await fs.readFile(filePath, "utf-8");
    } else if (fileExtension === ".xlsx") {
      // Use ExcelJS to read the Excel file
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePath);

      // Extract content from the first sheet
      const worksheet = workbook.worksheets[0];
      const rows = [];
      worksheet.eachRow((row) => {
        rows.push(row.values.join(", ")); // Join cell values with a comma
      });
      content = rows.join("\n"); // Join rows with a newline
      if (!content.trim()) {
        content = "No extractable text found in the file.";
      }
    } else {
      return res.status(400).json({ message: "Unsupported file type" });
    }

    content = content
      .replace(/[^a-zA-Z0-9ăâîșțĂÂÎȘȚ.,\n ]/g, "") // Remove non-alphanumeric characters (except Romanian diacritics)
      .replace(/\s+/g, " ") // Replace multiple spaces with a single space
      .replace(/\n+/g, "\n") // Replace multiple newlines with a single newline
      .trim(); // Remove leading and trailing whitespace // Clean up content
    if (!content) {
      return res.status(400).json({ message: "No extractable text found" });
    }

    // Save file details and content in the database
    const document = new Document({
      title: req.file.originalname,
      content,
      folder: folder || null,
      createdBy: userId,
    });

    await document.save();

    return res.status(201).json({
      message: "File uploaded and saved successfully",
      document,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const updateDocumentFolder = async (req, res) => {
    const { id } = req.params;
    const { folder } = req.body

    try{
        const document = await Document.findById(id);
        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }

        document.folder = folder || null; // Update the folder field
        await document.save();

        return res.status(200).json({ message: "Document folder updated successfully", document });
    }catch(error){
        console.error("Error updating document folder:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const generateSummary = async (req, res) => {
  const { id } = req.params;

  try {
    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (!document.content || !document.content.trim()) {
      return res
        .status(400)
        .json({ message: "Document content is empty or invalid" });
    }

    const summary = await summarizeText(document.content);
    return res
      .status(200)
      .json({ message: "Summary generated successfully", summary });
  } catch (error) {
    console.error("Error generating summary:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
