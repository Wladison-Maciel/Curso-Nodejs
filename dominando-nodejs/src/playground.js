import "./database"
import Customer from "./app/models/Customer"

class Playground {
    static async play() {
        // const customers = await Customer.findByPk(1);


        //        const customers = await Customer.findOne({
        //            attributes: { exclude: ["status"] },
        //        });


        const customers = await Customer.findOne({
            where:{
                status: "ARCHIVED",
            },
        });

        console.log(JSON.stringify(customers, null, 2));
    }
}

Playground.play();
