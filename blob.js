const { BlobServiceClient } = require('@azure/storage-blob');
const config = require('./config');
const logger = require('./logger');

async function listBlobs() {
    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(config.storage.connectionString);
        const containerClient = blobServiceClient.getContainerClient(config.storage.container);

        const blobs = [];
        for await (const blob of containerClient.listBlobsFlat()) {
            blobs.push(blob.name);
            logger.info(`Blob: ${blob.name}`);
        }

        return blobs;
    } catch (err) {
        if (err.code === 'ENOTFOUND') {
            logger.error('DNS resolution error to Blob Storage:', err.message);
        } else if (err.name === 'TimeoutError') {
            logger.error('Connection timeout to Blob Storage');
        } else {
            logger.error('Blob Storage Error:', err.message);
        }
        throw err; // para que server.js lo capture
    }
}

module.exports = { listBlobs };
