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
    console.debug("GET :: /customers", JSON.stringify(customers)) /* Adicionando um Debug e tranformando o 
    customer em formato JSON */
    return res.json(customers) // Retornando todos os customers
});

// Retornando apenas um Customer
server.get("/customers/:id", (req, res) => {
    const id = parseInt(req.params.id); // Recebe o id passado na URL e transforma em INT
    const customer = customers.find(item => item.id === id); // Procura o id correspondente ao id passado na URL
    const status = customer ? 200 : 404; // Verifica o status code, mantendo os principios de API Rest
    console.debug("GET :: /customers/:id", JSON.stringify(customer)) /* Adicionando um Debug e tranformando o 
    customer em formato JSON */
    return res.status(status).json(customer) // Retorna o status e o customer achado
});

// Adicionando Customer
server.post("/customers", (req, res) =>{
    const { name, site} = req.body; // Fazendo a requisição por meio do body em formato JSON
    const id = customers[customers.length - 1].id + 1; /* Pegando o tamanho da lista e subtraindo 1, com isso
    pegaremos o valor do ID do índice 2, que é igual a 3, agora acrescentamos +1, ficando assim 4.
    */
    const newCustomer = {id, name, site} // Criando um objeto que é o novo customer
    customers.push(newCustomer) // Adicionando o customer no banco de dados (Array)
    console.debug("POST :: /customers", JSON.stringify(newCustomer)) /* Adicionando um Debug e tranformando o 
    customer em formato JSON */
    return res.status(201).json(newCustomer) // Adicionando no Array em formato JSON junto com seu Status Code
});

// Atualizando Customer
server.put("/customers/:id", (req, res) =>{
    const id = parseInt(req.params.id); // Recebe o id passado na URL e transforma em INT
    const { name, site} = req.body; // Fazendo a requisição por meio do body em formato JSON
    const index = customers.findIndex(item => item.id === id); /* Procurando index do Customer que tem o mesmo
    id passado na URL
    */
    const status = index >= 0 ? 200 : 404; // status recebe um Boolean se index for maior ou igual a 0

    if(index >=0){
        customers[index] = {id: parseInt(id), name , site}; /* O customer do index selecionado receberá as
        alterações de "name" e "site"
        */
        console.debug("PUT :: /customers/:id", JSON.stringify(customers[index])) /* Adicionando um Debug e tranformando o 
        customer em formato JSON */
    }
    return res.status(status).json(customers[index]); // Retorna o status code e o customer selecionado
});

// Deletando Customer
server.delete("/customers/:id", (req, res) => {
    const id = parseInt(req.params.id); // Recebe o id passado na URL e transforma em INT
    const index = customers.findIndex(item => item.id === id); /* Procurando index do Customer que tem o mesmo
    id passado na URL
    */
    const status = index >= 0 ? 200 : 404; // status recebe um Boolean se index for maior ou igual a 0
    if(index >=0){
        customers.splice(index, 1);
        console.log("Customer deletado com sucesso")
    }
    return res.status(status).json();
});

server.listen(3000); // Ouvindo na porta 3000