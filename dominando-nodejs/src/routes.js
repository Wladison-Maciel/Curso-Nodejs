import { Router } from "express"; // Importa apenas a funcionalidade "Router" do Express
import customers from "./app/controllers/CustomersController";
const routes = new Router(); // Cria uma instância do Router para definir rotas da aplicação


routes.get("/customers" , customers.index );
routes.get("/customers/:id" , customers.show );
routes.post("/customers" , customers.create );
routes.put("/customers/:id" , customers.update );
routes.delete("/customers/:id" , customers.destroy );

// Exporta as rotas para serem usadas em outro arquivo
export default routes;