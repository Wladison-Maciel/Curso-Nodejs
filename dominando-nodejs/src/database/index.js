import Sequelize from "sequelize";
import config from '../config/database';
import Customer from '../app/models/Customer';
import Contact from '../app/models/Contact';
import User from '../app/models/User';

const models = [Customer, Contact, User];

class Database {
    constructor() {
        this.connection = new Sequelize(config);
        this.init();
        this.associate(); // Chame o método associate aqui
    }

    init() {
        models.forEach(model => model.init(this.connection));
    }

    associate() {
        models.forEach(model => {
            models.forEach(model => model.associate(this.connection,models))
        });
    }
}

export default new Database();
