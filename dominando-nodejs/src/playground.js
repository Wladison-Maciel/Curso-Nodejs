import { Op } from "sequelize";
import "./database";
import Customer from "./app/models/Customer";
import Contact from "./app/models/Contact";

class Playground {
    static async play() {
        const customers = await Customer.scope("active").findAll({});

        console.log(JSON.stringify(customers, null, 2));
    }
}

Playground.play();
