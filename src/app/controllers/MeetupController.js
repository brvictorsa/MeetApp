import * as Yup from 'yup';
import { isBefore, parseISO, startOfHour } from 'date-fns';
import Meetup from '../models/Meetup';

class MeetupController {
  async index(req, res) {
    const meetups = await Meetup.findAll();

    /*
     * Valida se existem meetups cadastrados.
     */
    if (!meetups.length) {
      return res
        .status(200)
        .json({ message: 'Não existem meetups cadastrados.' });
    }

    return res.json({ message: 'MeetupController:index foi chamado' });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      file_id: Yup.number().required(),
    });

    /*
     * Valida os dados obrigatórios do meetup.
     */
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Falha na validação dos dados para inclusão de meetup.',
      });
    }

    /*
     * Valida a data do meetup.
     */
    const hourStart = startOfHour(parseISO(req.body.date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'A data do meetup é inválida.' });
    }

    /*
     * Cria o meetup
     */
    const user_id = req.userId;
    const meetup = await Meetup.create({
      ...req.body,
      user_id,
    });

    return res.json(meetup);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      description: Yup.string(),
      location: Yup.string(),
      date: Yup.date(),
      file_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Falha na validação dos dados de atualização do meetup.',
      });
    }

    const user_id = req.userId;
    const meetup = await Meetup.findByPk(req.params.id);

    /*
     * Valida se o meetup foi encontrado.
     */
    if (!meetup) {
      return res.status(400).json({ error: 'Meetup não encontrado.' });
    }

    /*
     * Valida se o usuário é o organizador do meetup.
     */
    if (meetup.user_id !== user_id) {
      return res
        .status(401)
        .json({ error: 'Somente o organizador pode atualizar o meetup.' });
    }

    /*
     * Valida a data de atualização do meetup.
     */

    if (isBefore(parseISO(req.body.date), new Date())) {
      return res.status(400).json({ error: 'Data de atualização inválida.' });
    }

    /**
     * Valida se o meetup pode ser atualizado conforme a data cadastrada.
     */
    if (meetup.pastDate) {
      return res
        .status(400)
        .json({ error: 'Este meetup não pode mais ser alterado.' });
    }

    /**
     * Atualiza o meetup
     */
    await meetup.update(req.body);

    return res.json(meetup);
  }
}

export default new MeetupController();
