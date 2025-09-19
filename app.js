const express = require('express');
const { readFromCosmos } = require('./cosmos');
const { BlobServiceClient } = require('@azure/storage-blob');
const config = require('./config');
const logger = require('./logger');

const app = express();

// Middleware para UTF-8
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});

// Logging básico
app.use((req, res, next) => {
    logger.info(`[HTTP] ${req.method} ${req.url}`);
    next();
});

// Ruta raíz
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send('¡Aplicación desplegada correctamente desde App Service!');
});

// Health check
app.get('/status', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Cosmos DB
app.get('/cosmos', async (req, res) => {
    try {
        const items = await readFromCosmos();
        res.json(items);
    } catch (err) {
        logger.error('Error al obtener datos de Cosmos DB:', err.message);
        res.status(500).json({ error: 'No se pudieron obtener datos de Cosmos DB' });
    }
});

// Blob Storage
app.get('/blobs', async (req, res) => {
    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(config.storage.connectionString);
        const containerClient = blobServiceClient.getContainerClient(config.storage.container);

        const blobs = [];
        for await (const blob of containerClient.listBlobsFlat()) {
            blobs.push(blob.name);
            logger.info(`Blob: ${blob.name}`);
        }

        res.json({ blobs });
    } catch (err) {
        logger.error('Error al obtener blobs:', err.message);
        res.status(500).json({ error: 'No se pudieron obtener los blobs' });
    }
});

// Error handler global
app.use((err, req, res, next) => {
    logger.error('Error inesperado:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;
