import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY || "");

export const summarizeText = async (text) => {
  try {
    const cleanedText = text
      .trim() // Remove leading and trailing whitespace
      .replace(/\s+/g, " ") // Replace multiple spaces with a single space
      .replace(/\n+/g, "\n"); // Replace multiple newlines with a single newline

    console.log("Cleaned text to summarize:", cleanedText);

    // Ensure the cleaned text is not empty
    if (!cleanedText) {
      throw new Error("Input text is empty after cleaning");
    }

    const truncatedText = cleanedText.slice(0, 1024); // Truncate text to 4096 characters
    const result = await hf.summarization({
      model: "facebook/bart-large-cnn", // Pre-trained summarization model
      inputs: truncatedText, // Use the cleaned and truncated text

    });

    console.log("Hugging Face API response:", result); // Log the API response
    return result[0]?.summary_text; // Safely access summary_text
  } catch (error) {
    console.error("Error summarizing text:", error);
    throw new Error("Text summarization failed");
  }
};
