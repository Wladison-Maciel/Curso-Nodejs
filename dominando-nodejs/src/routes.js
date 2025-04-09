import { Router } from "express"; // Importa apenas a funcionalidade "Router" do Express
import customers from "./app/controllers/CustomersController";
import contacts from "./app/controllers/ContactsController";
import users from "./app/controllers/UsersController";
import sessions from "./app/controllers/SessionsController";
const routes = new Router(); // Cria uma instância do Router para definir rotas da aplicação

// Sessions
routes.post("/sessions", sessions.create);


// Rotas dos Customers
routes.get("/customers" , customers.index );
routes.get("/customers/:id" , customers.show );
routes.post("/customers" , customers.create );
routes.put("/customers/:id" , customers.update );
routes.delete("/customers/:id" , customers.destroy );

// Rotas dos contacts
routes.get("/customers/:customerId/contacts" , contacts.index );
routes.get("/customers/:customerId/contacts/:id" , contacts.show );
routes.post("/customers/:customerId/contacts" , contacts.create );
routes.put("/customers/:customerId/contacts/:id" , contacts.update );
routes.delete("/customers/:customerId/contacts/:id" , contacts.destroy );

// Rotas dos Users
routes.get("/users" , users.index );
routes.get("/users/:id" , users.show );
routes.post("/users" , users.create );
routes.put("/users/:id" , users.update );
routes.delete("/users/:id" , users.destroy );

// Exporta as rotas para serem usadas em outro arquivo
export default routes;
