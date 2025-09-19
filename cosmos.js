const { CosmosClient } = require('@azure/cosmos');
const config = require('./config');
const logger = require('./logger');

async function readFromCosmos() {
    try {
        const client = new CosmosClient({
            endpoint: config.cosmos.endpoint,
            key: config.cosmos.key,
            connectionPolicy: { requestTimeout: 10000 }
        });

        const database = client.database(config.cosmos.databaseId);
        const container = database.container(config.cosmos.containerId);

        const querySpec = {
            query: 'SELECT * FROM c OFFSET 0 LIMIT 5'
        };

        const { resources: items } = await container.items.query(querySpec).fetchAll();

        logger.info('CosmosDB items retrieved:', items.length);
        return items; // ahora devuelve los items

    } catch (err) {
        if (err.code === 'ENOTFOUND') {
            logger.error('DNS resolution error: ', err.message);
        } else if (err.name === 'TimeoutError') {
            logger.error('Connection timeout to Cosmos DB');
        } else {
            logger.error('Cosmos DB Error:', err.message);
            throw err; // lanzar error para que app.js lo capture
        }
    }
}

module.exports = { readFromCosmos };

