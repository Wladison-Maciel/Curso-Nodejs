import { Op } from "sequelize";
import "./database";
import Customer from "./app/models/Customer";
import Contact from "./app/models/Contact";

class Playground {
    static async play() {
        const customer = await Customer.create({
            id: 4,
            name: "Github",
            email: "github@google.com",
            status: "ACTIVE",
        });
        console.log(JSON.stringify(customer))

        const buscarCustomer = await Customer.findAll();
        console.log(JSON.stringify(buscarCustomer, null, 2));

    }
}

Playground.play();
