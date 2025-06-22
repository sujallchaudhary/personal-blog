const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');
const path = require('path');
require('dotenv').config();

// Azure Blob Storage configuration
const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
const containerName = process.env.AZURE_CONTAINER_NAME || 'blogs';
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }
}).single('file');
const uploadFile = (req, res, next) => {
    upload(req, res, async function (err) {
        if (err) {
            return res.status(400).json({ error: 'File upload error', details: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        try {
            // Prepare the file upload parameters
            const fileKey = `blogs/thumbnail/${Date.now()}${path.extname(req.file.originalname)}`;
            
            // Get container client
            const containerClient = blobServiceClient.getContainerClient(containerName);
            
            // Get blob client
            const blobClient = containerClient.getBlockBlobClient(fileKey);
            
            // Upload file to Azure Blob Storage
            await blobClient.upload(req.file.buffer, req.file.buffer.length, {
                blobHTTPHeaders: {
                    blobContentType: req.file.mimetype
                }
            });

            // File uploaded successfully
            req.body.file = blobClient.url; // Azure blob URL
            next();
        } catch (error) {
            return res.status(500).json({ error: 'Failed to upload file', details: error.message });
        }
    });
};

module.exports = uploadFile;