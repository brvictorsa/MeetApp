import User from '../models/User';

class UserController {
  async store(req, res) {
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
    console.log(req.userId);
    return res.json({ ok: true });
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
