import Folder from "../models/Folder.js";

export const createFolder = async (req, res) => {
  const { name, parentFolder } = req.body;
  const userId = req.user._id; // Assuming you have user authentication middleware

  try {
    const folder = new Folder({
      name,
      parentFolder: parentFolder || null,
      createdBy: userId,
    });

    await folder.save();
    return res
      .status(201)
      .json({ message: "Folder created successfully", folder });
  } catch (error) {
    console.error("Error creating folder:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const getFolderWithDocuments = async (req, res) => {
    const {id} = req.params;

    try{
        const folder = await Folder.findById(id).populate("documents");
        if (!folder) {
            return res.status(404).json({ message: "Folder not found" });
        }

        return res.status(200).json({ message: "Folder retrieved successfully", folder });
     
    }catch(error){
        console.error("Error getting folder with documents:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
