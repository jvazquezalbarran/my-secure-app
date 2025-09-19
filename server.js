const app = require('./app');

// Azure App Service inyecta el puerto en process.env.PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
