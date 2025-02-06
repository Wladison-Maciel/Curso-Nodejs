const express = require("express");
const server = express();

// http://localhost:3000/hello?nome=felipe&idade=17
// QUery params = ?nome=felipe&idade=17 

server.get("/hello", (req, res) => {

    const { nome, idade } = req.query; // Fazendo a desconstrução dos parâmetros que eu quero (Parametros Opcionais)

    return res.json({
        title: `Olá ${nome} tudo bem?`,
        idade: `Sua idade é: ${idade}`
    });
});


// http://localhost:3000/hello/:nome
// http://localhost:3000/hello/felipe

server.get("/hello/:nome", (req, res) => {

    const nome = req.params.nome;


    return res.json({
        title: `Olá ${nome} tudo bem?`
    });
});

server.listen(3000);