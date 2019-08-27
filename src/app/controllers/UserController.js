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
}

export default new UserController();
