import Sequelize, { Model } from "sequelize"; // Importa o Sequelize e a classe Model

class Customer extends Model {
    // Método para inicializar o modelo e definir os campos da tabela
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING, // Define o campo "name" como uma string
                email: Sequelize.STRING, // Define o campo "email" como uma string
                status: Sequelize.ENUM("ACTIVE", "ARCHIVED"), // Define o campo "status" com valores restritos
            },
            {
                scopes: {
                    active: { // Escopo que permite buscar apenas clientes ativos
                        where: {
                            status: "ACTIVE",
                        },
                    },
                },
                // Desabilitando Hook temporariamente para Debug
                // hooks:{ // Criando um Hook (Gancho)
                //     beforeValidate: (customer, options) => { // Antes da validação o status será ARCHIVED
                //         customer.status = "ARCHIVED"
                //     },
                // },
                sequelize, // Passa a conexão do banco de dados
                name:{
                    singular: "customer",
                    plural: "customers",
                },
            }
        );
    }

    // Método para definir os relacionamentos do modelo
    static associate(models) {
        this.hasMany(models.Contact); // Um Customer pode ter vários contatos (relação 1:N)
    }
}

export default Customer; // Exporta o modelo para ser usado em outras partes do sistema
