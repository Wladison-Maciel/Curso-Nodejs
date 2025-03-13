import Customer from "../models/Customer";
import { Op } from "sequelize";
import { parseISO } from 'date-fns'
import Contact from "../models/Contact"

class CustomersController {
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

        let where = {}; // Objeto onde serão armazenadas as condições da consulta
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
        const data = await Customer.findAll({
            where, // Aplica os filtros
            order: [["id", "ASC"]],
            include: [
                {
                    model: Contact, // Faz um relacionamento com a tabela de Contatos
                    attributes: ["id", "status"], // Seleciona apenas os campos "id" e "status" dos contatos
                }
            ],
            limit, // Define o limite de registros por página
            offset: limit * page - limit, // Calcula o deslocamento para a paginação
        });
        return res.status(200).json(data); // Retorna os resultados da consulta como JSON
    }

    // Listagem de um Customer
    async show(req, res) {
        const id = parseInt(req.params.id, 10); // Recebendo id passado na URL a transformando em INT
        const data = await Customer.findOne({ // Procurando somente um customer
            include: [ // Adicionando seus Contatos para visualização
                {
                    model: Contact, // Adicionando Model
                    attributes: ["id", "status"], // Mostrando somente estes atributos
                }
            ],
            where: { // Fazendo a busca por meio de Operadores
                id: {
                    [Op.eq]: id // Verificando se o id corresponde ao da URL
                },
            },
        });
        const status = data ? 200 : 404; // Verifica o status code, mantendo os principios de API Rest
        console.debug("GET :: /customers/:id", JSON.stringify(data)) /* Adicionando um Debug e tranformando o
        customer em formato JSON */
        return res.status(status).json(data) // Retorna o status e o customer achado
    }
    // Cria um novo Customer
    async create(req, res) {
        const { id, name, email, status } = req.body; // Fazendo a requisição por meio do body em formato JSON
        const data = await Customer.create({
            id: id,
            name: name,
            email: email,
            status: status
        });
        console.debug("POST :: /customers", JSON.stringify(data)) /* Adicionando um Debug e tranformando o
        customer em formato JSON */
        return res.status(201).json(data)

    }
    // Atualização de um Customer
    update(req, res) {
        const id = parseInt(req.params.id, 10); // Recebe o id passado na URL e transforma em INT
        const { name, site } = req.body; // Fazendo a requisição por meio do body em formato JSON
        const index = customers.findIndex(item => item.id === id); /* Procurando index do Customer que tem o mesmo
    id passado na URL
    */
        const status = index >= 0 ? 200 : 404; // status recebe um Boolean se index for maior ou igual a 0

        if (index >= 0) {
            customers[index] = { id: parseInt(id, 10), name, site }; /* O customer do index selecionado receberá as
        alterações de "name" e "site"
        */
            console.debug("PUT :: /customers/:id", JSON.stringify(customers[index])) /* Adicionando um Debug e tranformando o
        customer em formato JSON */
        }
        return res.status(status).json(customers[index]); // Retorna o status code e o customer selecionado

    }
    // Deleta um Customer
    async destroy(req, res) {
        const id = parseInt(req.params.id, 10); // Recebe o id passado na URL e transforma em INT
        const data = await Customer.findByPk(id); // Buscando id passado na URL
        await data.destroy(); // Deletando customer selecionado
        res.status(200).json({message: "Customer deletado com sucesso!"}) // Respondendo a requisão se concluida
        console.debug("DELETE :: /customers/:id", "Customer deletado com sucesso!"); // Console de debug
    }
}
export default new CustomersController();
