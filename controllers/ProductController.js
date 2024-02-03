import xlsx from "xlsx";
import { fileURLToPath } from "url";
import path, { dirname, join } from "path";
import fs from 'fs';

export const saveProduct = async (req, res) => {
  try {
    if (!req.files || (req.files.length === 0 && !req.files.realfile)) {
      return res.status(400).json({ msg: 'No File Uploaded' });
    }
    
    const file = req.files.file;
    const fileSize = file ? file.data.length : 0;
    const ext = file ? path.extname(file.name) : '';
    const fileName = req.body.fileName;
    let realFile = req.files.realfile;
    let realFileSize = realFile ? realFile.data.length : 0;
    let realExt = realFile ? path.extname(realFile.name) : '';
    let realFileName = req.body.realFileName;
    console.log(req.body)
    const allowedType = ['.xlsx', '.xls', '.csv'];

    if ((file && !allowedType.includes(ext.toLowerCase())) || (realFile && !allowedType.includes(realExt.toLowerCase()))) {
      const errorMessage = `Invalid File. File: ${file ? file.name : ''}, Extension: ${ext}. Real File: ${realFileName}, Extension: ${realExt}`;
      return res.status(422).json({ msg: errorMessage });
    }

    if ((realFile && realFileSize > 5000000) || (file && fileSize > 5000000)) {
      return res.status(422).json({ msg: 'File must be less than 5 MB' });
    }

    // Use Promise.all to wait for both file operations to complete
    await Promise.all([
      file &&
        new Promise((resolve, reject) => {
          file.mv(`./public/images/${fileName}`, (err) => {
            if (err) reject(err);
            else resolve();
          });
        }),
      realFile &&
        new Promise((resolve, reject) => {
          console.log(realFileName)
          const realFilePath = `./public/real/${realFileName}`;
          console.log(realFilePath)
          console.log('Real File Path:', realFilePath);

          realFile.mv(realFilePath, (err) => {
            if (err) {
              console.error('Error saving real file:', err);
              reject(err);
            } else {
              console.log('Real File saved successfully');
              resolve();
            }
          });
        }),
    ]);

    return res.status(200).json({ msg: 'Files uploaded successfully' });
  } catch (err) {
    return res.status(500).json({ msg: err.message || 'Error uploading files' });
  }
};




export const saveDataPDF = (req, res) => {
  if (req.files === null)
    return res.status(400).json({ msg: "No File Uploaded" });
  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = req.body.fileName; // Extract fileName from request body
  const allowedType = [".pdf"];

  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ msg: "Invalid File" });

  file.mv(`./public/images/${fileName}`, async (err) => {
    if (err) {
      return res.status(500).json({ msg: err.message });
    } else {
      return res.status(200).json({ msg: "File uploaded successfully" });
    }
  });
};

const currentDir = dirname(fileURLToPath(import.meta.url));

export const getProduct = (req, res) => {
  const { filename } = req.params; // Retrieve filename and title from URL parameters
  const filePath = join(currentDir, `../public/images/${filename}`); // Adjust the path based on your project structure

  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Assuming the data is in the first sheet
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    res.json({ data });
  } catch (error) {
    console.error("Error converting XLSX to JSON:", error);
    res.status(500).json({ error: "Failed to convert XLSX to JSON" });
  }
};

export const downloadProduct = (req, res) => {
  const { filename, title } = req.params; // Retrieve filename and title from URL parameters
  const extension = path.extname(filename);
  const filePath = join(currentDir, `../public/images/${filename}`);

  // Set the new name for the downloaded file based on the title
  const newFileName = `${title}${extension}`;

  // Use res.download to trigger file download with the new filename
  res.download(filePath, newFileName, (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      res.status(500).json({ error: "Failed to download file" });
    }
  });
};

export const downloadRealFile = (req, res) => {
  const { filename, title } = req.params; // Retrieve filename and title from URL parameters
  const extension = path.extname(filename);
  const filePath = join(currentDir, `../public/real/${filename}`);

  // Set the new name for the downloaded file based on the title
  const newFileName = `${title}${extension}`;

  // Use res.download to trigger file download with the new filename
  res.download(filePath, newFileName, (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      res.status(500).json({ error: "Failed to download file" });
    }
  });
};


export const deleteFile = (req, res) => {
    const { filename } = req.params; // Retrieve filename from URL parameters
    const filePath = join(currentDir, `../public/images/${filename}`); // Adjust the path based on your project structure

    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // File doesn't exist
            return res.status(404).json({ msg: 'File not found' });
        }
        
        // File exists, proceed to delete it
        fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
                console.error('Error deleting file:', unlinkErr);
                return res.status(500).json({ error: 'Failed to delete file' });
            }
            
            // File deleted successfully
            return res.status(200).json({ msg: 'File deleted successfully' });
        });
    });
};

export const deleteRealFile = (req, res) => {
  const { realfilename } = req.params; // Retrieve filename from URL parameters
  const filePath = join(currentDir, `../public/real/${realfilename}`); // Adjust the path based on your project structure

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File doesn't exist, consider it deleted successfully
      return res.status(200).json({ msg: 'File already deleted or not found' });
    }

    // File exists, proceed to delete it
    fs.unlink(filePath, (unlinkErr) => {
      if (unlinkErr) {
        console.error('Error deleting file:', unlinkErr);
        return res.status(500).json({ error: 'Failed to delete file' });
      }

      // File deleted successfully
      return res.status(200).json({ msg: 'File deleted successfully' });
    });
  });
};