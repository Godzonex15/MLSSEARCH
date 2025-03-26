const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos principales desde la carpeta "public"
app.use(express.static(path.join(__dirname, "public")));

// Servir archivos combinados directamente desde la raíz (donde se generan)
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
  console.log(`Acceder a la aplicación en http://localhost:${PORT}`);
});