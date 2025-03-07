import Sequelize, { Model } from "sequelize"; // Importa o Sequelize e a classe Model

class Contact extends Model {
    // Método para inicializar o modelo e definir os campos da tabela
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING, // Define o campo "name" como string
                email: Sequelize.STRING, // Define o campo "email" como string
                status: Sequelize.ENUM("ACTIVE", "ARCHIVED"), // Define o campo "status" com valores limitados
            },
            {
                sequelize, // Passa a conexão do banco de dados
            }
        );
    }

    // Método para definir os relacionamentos do modelo
    static associate(models) {
        this.belongsTo(models.Customer, { foreignKey: "customer_id" });
        // Define um relacionamento onde cada "Contact" pertence a um "Customer"
        // A foreign key "customer_id" referencia o id do cliente
    }
}

export default Contact; // Exporta o modelo para ser usado em outras partes do sistema
