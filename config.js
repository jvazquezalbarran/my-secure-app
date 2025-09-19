require('dotenv').config();

module.exports = {
    cosmos: {
        endpoint: process.env.COSMOS_URI,
        key: process.env.COSMOS_KEY,
        databaseId: process.env.COSMOS_DB,
        containerId: process.env.COSMOS_CONTAINER,
    },
    storage: {
        connectionString: process.env.STORAGE_CONN_STRING,
        container: process.env.STORAGE_CONTAINER,
    }
};

