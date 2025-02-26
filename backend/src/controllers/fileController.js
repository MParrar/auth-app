const path = require('path');
const { validateFile, cleanAndGenerateNewFile, processExcelFile, validateXLSXFile } = require('../services/fileServices');

const uploadDocument = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a file' });
  }

  const filePath = path.join(__dirname, '../../uploads', req.file.filename);
  const fileExtension = path.extname(req.file.originalname);
  try {
    if(fileExtension === '.csv'){
      await validateFile(filePath);
      await cleanAndGenerateNewFile(res, filePath);
    }
    if(fileExtension === '.xlsx' || fileExtension === '.xls'){
      await validateXLSXFile(filePath);
      await processExcelFile(filePath, res);
    }
  } catch (err) {
    console.log('Error reading file:', err.message);
    return res.status(400).json({
      status: 'error',
      message: err.message || 'An error occurred. Please try again later',
    });
  }
};

module.exports = { uploadDocument };
