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

        let where = {customer_id: req.params.customerId}; // Objeto onde serão armazenadas as condições da consulta
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
            include: [ // Adicionando seus Contatos para visualização
                {
                    model: Customer, // Adicionando Model
                }
            ],
            where: { // Fazendo a busca por meio de Operadores
                customer_id:{
                    [Op.eq]: customer_id
                },
                id: {
                    [Op.eq]: id // Verificando se o id corresponde ao da URL
                },
            },
        });

        if(!customer_id || !data){
            return res.status(404).json({ message: "Não há indivíduos para essa busca" })
        }


        const status = data ? 200 : 404; // Verifica o status code, mantendo os principios de API Rest
        return res.status(status).json(data) // Retorna o status e o customer achado
    }
}

export default new ContactsController();
