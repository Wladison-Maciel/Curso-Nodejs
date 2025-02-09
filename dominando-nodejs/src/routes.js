const { Router } = require("express"); // Importa apenas a funcionalidade "Router" do Express
const routes = new Router(); // Cria uma instância do Router para definir rotas da aplicação

// Define uma rota GET para o caminho "/hello"
routes.get("/hello" , (req, res) => {
    return res.json({ message: "Hello "});
});

// Exporta as rotas para serem usadas em outro arquivo
module.exports = routes;