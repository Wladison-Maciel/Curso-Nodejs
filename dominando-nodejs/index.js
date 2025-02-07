const express = require("express");
const server = express();


server.use(express.json());

// Criando uma lista simples para construção da API de CRUD
let customers = [
    {id: 1, name: "Dev Samurai", site: "http://devsamurai.com.br"},
    {id: 2, name: "Google", site: "http://google.com.br"},
    {id: 3, name: "UOL", site: "http://uol.com.br"}
];

// Retornando todos os customers
server.get("/customers", (req, res) => {
    return res.json(customers)
});

server.get("/customers/:id", (req, res) => {
    const id = parseInt(req.params.id); // Recebe o id passado na URL e transforma em INT
    const customer = customers.find(item => item.id === id); // Procura o id correspondente ao id passado na URL
    const status = customer ? 200 : 404; // Verifica o status code, mantendo os principios de API Rest
    return res.status(status).json(customer) // Retorna o status e o customer achado
});




server.listen(3000);