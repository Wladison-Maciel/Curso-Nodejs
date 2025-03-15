import { Router } from "express"; // Importa apenas a funcionalidade "Router" do Express
import customers from "./app/controllers/CustomersController";
import contacts from "./app/controllers/ContactsController";
const routes = new Router(); // Cria uma instância do Router para definir rotas da aplicação

// Rotas dos Customers
routes.get("/customers" , customers.index );
routes.get("/customers/:id" , customers.show );
routes.post("/customers" , customers.create );
routes.put("/customers/:id" , customers.update );
routes.delete("/customers/:id" , customers.destroy );

// Rotas dos contacts
routes.get("/customers/:customerId/contacts" , contacts.index );
routes.get("/customers/:customerId/contacts/:id" , contacts.show );
// routes.post("/customers/customerId/contacts" , contacts.create );
// routes.put("/customers/customerId/contacts/:id" , contacts.update );
// routes.delete("/customers/customerId/contacts/:id" , contacts.destroy );

// Exporta as rotas para serem usadas em outro arquivo
export default routes;
