import { Op } from "sequelize";
import "./database";
import Customer from "./app/models/Customer";
import Contact from "./app/models/Contact";

class Playground {
    static async play() {
        // Maneira de como fazer Create
        // const customer = await Customer.create({
        //     id: 4,
        //     name: "Github",
        //     email: "github@google.com",
        //     status: "ACTIVE",
        // });

        // Maneira de como fazer update
        // const customer = await Customer.findByPk(1);
        // const newCustomer = customer.update({ status: "ARCHIVED"});
        // customer.save();
        // console.log(JSON.stringify(newCustomer))

        const buscarCustomer = await Customer.findAll({
            order:[["id", "ASC"]],
        });
        console.log(JSON.stringify(buscarCustomer, null, 2));

    }
}

Playground.play();
