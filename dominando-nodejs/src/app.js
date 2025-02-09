const express = require("express"); // Importa a Biblioteca Express
const routes = require("./routes"); // Importa o arquivo de rotas definido em "./routes"

// Define a classe App que será responsável por configurar o servidor
class App{
    constructor(){
        this.server = express(); // Cria uma instância do servidor Express
        this.middlewares(); // Configura os middlewares do servidor
        this.routes(); // Configura as rotas da aplicação
    }
    // Método para configurar os middlewares
    middlewares(){
        this.server.use(express.json()); // Permite que o servidor processe requisições com corpo em JSON
    }
    // Método para configurar as rotas da aplicação
    routes(){
        this.server.use(routes); // Usa as rotas importadas do arquivo "routes.js"
    }
}
// Exporta uma instância da classe App, retornando apenas o servidor configurado
module.exports = new App().server;
