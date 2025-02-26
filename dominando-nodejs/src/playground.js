import { Op } from "sequelize";
import "./database"
import Customer from "./app/models/Customer"

class Playground {
    static async play() {
        // const customers = await Customer.findByPk(1);


        //        const customers = await Customer.findOne({
        //            attributes: { exclude: ["status"] },
        //        });


        const customers = await Customer.findAll({
            where:{
                [Op.or]:{
                    status: {
                        [Op.in]: ["ARCHIVED"],
                    },
                    name: {
                        [Op.iLike]: "google%",
                    }
                }

            },
        });

        console.log(JSON.stringify(customers, null, 2));
    }
}

Playground.play();
