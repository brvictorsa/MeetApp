import User from '../models/User';

class UserController {
  async store(req, res) {
    // checagem se existe usuário com o e-mail enviado
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res
        .status(400)
        .json({ error: 'Já existe um usuário com o e-mail informado.' });
    }

    return res.json({ message: 'Usuário pode ser cadastrado.' });
  }
}

export default new UserController();
