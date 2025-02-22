module.exports = {
    dialect: "postgres",
    host: "localhost",
    username: "postgres",
    password: "3769",
    database: "teste-dominando-nodejs",
    define: {
        timestamp: true, // Cria duas colunas: createdAt updateAt
        underscored: true,
        underscoredAll: true,
    },
};
