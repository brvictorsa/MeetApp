import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    // cria o modelo de validação
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    // faz a validação
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'A validação falhou.' });
    }

    // checagem se existe um usuário cadastrado com o e-mail fornecido
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({
        error: 'Já existe um usuário cadastrado com o e-mail informado.',
      });
    }

    // cadastra o usuário no banco de dados
    const { id, name, email } = await User.create(req.body);

    // informa que o usuário foi cadastrado
    return res.json({ id, name, email, message: 'Usuário cadastrado' });
  }

  async update(req, res) {
    // cria a validação do modelo
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    // realiza a validação
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'A validação falhou.' });
    }

    // recupera os dados da requisição
    const { email, oldPassword } = req.body;

    // recupera o usuário
    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      // checa se já existe um usuário com o novo e-mail
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({
          error: 'Já existe um usuário cadastrado com o e-mail informado.',
        });
      }
    }

    // se houver alteração de senha, verifica se o oldpassword é o password atual do usuário
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'A senha não confere' });
    }

    // altera os dados do usuário
    const { id, name, updated_at } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      updated_at,
    });
  }

  async index(req, res) {
    // recupera os usuários e faz a contagem
    const { count, rows } = await User.findAndCountAll({
      attributes: ['id', 'name', 'email'],
    });

    if (count < 1) {
      return res.json({ message: 'Nenhum usuário cadastrado' });
    }

    return res.json({
      total: count,
      users: rows,
    });
  }
}

export default new UserController();
