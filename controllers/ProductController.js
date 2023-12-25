import xlsx from "xlsx"
import { fileURLToPath } from 'url';
import path, { dirname, join } from 'path';

export const saveProduct = (req, res)=>{
    
    if(req.files === null) return res.status(400).json({msg: "No File Uploaded"});    
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = req.body.fileName; // Extract fileName from request body
    const allowedType = ['.xlsx', '.xls', '.csv'];

    if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
    if(fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5 MB"});

    file.mv(`./public/images/${fileName}`, async(err)=>{
        if (err) {
            return res.status(500).json({ msg: err.message });
        } else {
            return res.status(200).json({ msg: "File uploaded successfully"});
        }
    })
}

const currentDir = dirname(fileURLToPath(import.meta.url));

export const getProduct = (req, res) => {
    const { filename } = req.params; // Retrieve filename and title from URL parameters
    const filePath = join(currentDir, `../public/images/${filename}`);  // Adjust the path based on your project structure

    try {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0]; // Assuming the data is in the first sheet
      const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  
      res.json({ data });
    } catch (error) {
      console.error('Error converting XLSX to JSON:', error);
      res.status(500).json({ error: 'Failed to convert XLSX to JSON' });
    }
}

export const downloadProduct = (req, res) => {
    const { filename, title } = req.params; // Retrieve filename and title from URL parameters
    const extension = path.extname(filename);
    const filePath = join(currentDir, `../public/images/${filename}`);
    
    // Set the new name for the downloaded file based on the title
    const newFileName = `${title}${extension}`;
    
    // Use res.download to trigger file download with the new filename
    res.download(filePath, newFileName, (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            res.status(500).json({ error: 'Failed to download file' });
        }
    });
};