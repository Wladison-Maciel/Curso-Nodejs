import { Op } from "sequelize";
import User from "../models/User"; // Importa o model User, que representa a tabela de usuários no banco de dados
import jwt from "jsonwebtoken"; // Importa a biblioteca JSON Web Tok para gerar tokens de autenticação

// Define a classe SessionsController que será usada para lidar com sessões (login)
class SessionsController {

    // Método responsável por criar uma nova sessão (login)
    async create(req, res) {
        // Extrai email e senha do corpo da requisição
        const { email, password } = req.body;

        // Busca o usuário no banco de dados com base no e-mail informado
        const user = await User.findOne({
            where: {
                email: {
                    [Op.eq]: email // Usa operador de igualdade para garantir que o e-mail seja exatamente igual
                }
            }
        });

        // Se o usuário não for encontrado, retorna erro 404 (Not Found)
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Verifica se a senha fornecida está correta utilizando um método do model User
        const passwordMatch = await user.checkPassword(password);
        if (!passwordMatch) {
            // Se a senha estiver incorreta, retorna erro 401 (Unauthorized)
            return res.status(401).json({ error: "Password not match" });
        }

        // Desestrutura os dados que serão retornados no JSON (não retorna senha ou dados sensíveis)
        const { id, name } = user;

        // Retorna os dados do usuário + token JWT gerado com o ID do usuário como payload
        return res.json({
            user: {
                id,      // ID do usuário
                name,    // Nome do usuário
                email    // E-mail do usuário
            },
            token: jwt.sign(
                { id }, // Payload: apenas o ID do usuário
                "f8b48e75d1012504605dbe76e729b2d0", // Chave secreta usada para assinar o token (ideal: usar variável de ambiente)
                {
                    expiresIn: "7d", // O token será válido por 7 dias
                }
            ),
        });
    }
}

// Exporta uma instância da classe para ser usada nas rotas da aplicação
export default new SessionsController();
