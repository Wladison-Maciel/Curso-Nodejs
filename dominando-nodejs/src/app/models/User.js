import Sequelize, { Model } from "sequelize"; // Importa o Sequelize e a classe Model

class User extends Model {
    // Método para inicializar o modelo e definir os campos da tabela
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING, // Define o campo "name" como string
                email: Sequelize.STRING, // Define o campo "email" como string
                provider: Sequelize.BOOLEAN, // Define se o usuário é um prestador de serviço (true/false)
                password_hash: Sequelize.STRING, // Armazena o hash da senha do usuário
            },
            {
                sequelize, // Passa a conexão com o banco de dados
                name:{
                    singular: "user",
                    plural: "users",
                },
            }
        );
    }
}

export default User; // Exporta o modelo para ser usado em outras partes do sistema
