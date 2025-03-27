import Customer from "../models/Customer";
import { Op } from "sequelize";
import { parseISO } from 'date-fns'
import Contact from "../models/Contact"

class ContactsController {
    async index(req, res) {
        // Extrai os parâmetros de consulta (query) da requisição
        const {
            name,           // Nome do cliente
            email,          // Email do cliente
            status,         // Status do cliente (ex: active, archived)
            createdBefore,  // Data limite de criação (antes desta data)
            createdAfter,   // Data mínima de criação (após esta data)
            updatedBefore,  // Data limite de atualização (antes desta data)
            updatedAfter,   // Data mínima de atualização (após esta data)
            sort            // Ordenação dos resultados
        } = req.query;

        // Define a página atual e o limite de itens por página
        const page = req.query.page || 1; // Se não for passado, assume 1
        const limit = req.params.limit || 25; // Se não for passado, assume 25

        let where = { customer_id: req.params.customerId }; // Objeto onde serão armazenadas as condições da consulta
        let order = []; // Array para armazenar critérios de ordenação

        // Filtros opcionais
        if (name) {
            where = {
                ...where,
                name: {
                    [Op.iLike]: name, // Filtra nomes semelhantes (case insensitive, útil para PostgreSQL)
                }
            }
        }

        if (email) {
            where = {
                ...where,
                email: {
                    [Op.iLike]: email, // Filtra emails semelhantes (case insensitive)
                }
            }
        }

        if (status) {
            where = {
                ...where,
                status: {
                    [Op.in]: status.split(",").map(item => item.toUpperCase()), // Transforma a string em um array e converte para maiúsculas
                }
            }
        }

        // Filtros por data de criação
        if (createdBefore) {
            where = {
                ...where,
                createdAt: {
                    [Op.gte]: parseISO(createdBefore), // Filtra registros criados antes da data especificada
                }
            }
        }

        if (createdAfter) {
            where = {
                ...where,
                createdAt: {
                    [Op.lte]: parseISO(createdAfter), // Filtra registros criados depois da data especificada
                }
            }
        }

        // Filtros por data de atualização
        if (updatedBefore) {
            where = {
                ...where,
                updatedAt: {
                    [Op.gte]: parseISO(updatedBefore), // Filtra registros atualizados antes da data especificada
                }
            }
        }

        if (updatedAfter) {
            where = {
                ...where,
                updatedAt: {
                    [Op.lte]: parseISO(updatedAfter), // Filtra registros atualizados depois da data especificada
                }
            }
        }

        // Ordenação dos resultados (exemplo: "name:asc,email:desc")
        if (sort) {
            order = sort.split(",").map(item => item.split(":")); // Transforma a string de ordenação em um array
        }

        // Busca os registros no banco de dados com base nos filtros e ordenação
        const data = await Contact.findAll({
            attributes: { exclude: ["customer_id"] },
            where, // Aplica os filtros
            order: [["id", "ASC"]],
            include: [
                {
                    model: Customer, // Faz um relacionamento com a tabela de Customers
                    attributes: ["id", "status"], // Seleciona apenas os campos "id" e "status" dos customers
                    required: true,
                }
            ],
            limit, // Define o limite de registros por página
            offset: limit * page - limit, // Calcula o deslocamento para a paginação
        });
        return res.status(200).json(data); // Retorna os resultados da consulta como JSON
    }
    // Listagem de um Contact
    async show(req, res) {
        const id = parseInt(req.params.id, 10); // Recebendo id passado na URL a transformando em INT
        const customer_id = parseInt(req.params.customerId, 10);
        const data = await Contact.findOne({ // Procurando somente um contact
            attributes: { exclude: ["customer_id"] },
            include: [ // Adicionando seus Contatos para visualização
                {
                    model: Customer, // Adicionando Model
                }
            ],
            where: { // Fazendo a busca por meio de Operadores
                customer_id: {
                    [Op.eq]: customer_id // Verificando se o id do customer corresponde ao da URL
                },
                id: {
                    [Op.eq]: id // Verificando se o id do contact corresponde ao da URL
                },
            },
        });

        // Verificando se há resgistros para a determinada busca
        if (!customer_id || !data) {
            return res.status(404).json({ error: "Não há registros para essa busca" })
        }
        return res.status(200).json(data) // Retorna o status e o customer achado
    }

    async create(req, res) {
        // Recebendo as variáveis por meio do body
        const { id, name, status, email, customer_id } = req.body;
        // Criando Contact
        const data = await Contact.create({
            id: id,
            name: name,
            status: status.toUpperCase(),
            email: email,
            customer_id: customer_id
        });
        // Mandando uma resposta da requisição
        return res.status(201).json({ message: "Contact criado com sucesso"})
    }

    async update(req, res) {
        const id = parseInt(req.params.id, 10); // Recebendo id passado na URL a transformando em INT
        const customer_id = parseInt(req.params.customerId, 10); // Recebendo customer_id na URL e ´´´´´´
        const { name, email, status } = req.body; // Recebendo variáveis por meio do body
        // Fazendo a busca do Contact
        const contact = await Contact.findOne({
            where: {
                customer_id: {
                    [Op.eq]: customer_id // Verificando customer_id passado
                },
                id: {
                    [Op.eq]: id //  Verificando id passado
                },
            },
        });
        // Verificando se o customer_id ou id(Contact) são válidos
        if(!customer_id || !id){
            return res.status(404).json({ error: "Não há registros para essa busca"})
        }
        // Fazendo Update do Contact
        const data = await contact.update({
            name: name,
            email: email,
            status: status,
        });
        // Mandando uma resposta da requisição
        res.status(200).json({message: "Contact atualizado com sucesso"})
    }

    async destroy(req, res) {
        const id = parseInt(req.params.id, 10); // Recebe o id passado na URL e transforma em INT
        const customer_id = parseInt(req.params.customerId, 10); // Recebe o id do customer passado na URL e transforma em INT
        const data = await Contact.findOne({
            where: { // Fazendo a busca por meio de Operadores
                customer_id: {
                    [Op.eq]: customer_id // Verificando se o id do customer corresponde ao da URL
                },
                id: {
                    [Op.eq]: id // Verificando se o id do contact corresponde ao da URL
                },
            },
        });

        // Verificando se há resgistros para a determinada busca
        if (!customer_id || !data) {
            return res.status(404).json({ error: "Não há registros para essa busca" })
        }
        await data.destroy();
        res.status(200).json({ message: "Customer deletado com sucesso!" }) // Respondendo a requisão se concluida

    }

}

export default new ContactsController();
