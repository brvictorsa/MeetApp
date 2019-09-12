import * as Yup from 'yup';
import { Op } from 'sequelize';
import {
  isBefore,
  parseISO,
  startOfHour,
  startOfDay,
  endOfDay,
} from 'date-fns';

import Meetup from '../models/Meetup';
import User from '../models/User';

class MeetupController {
  async index(req, res) {
    const { date, page = 1 } = req.query;
    const parsedDate = parseISO(date);

    const meetups = await Meetup.findAll({
      attributes: ['id', 'title', 'description', 'location', 'date'],
      where: {
        date: { [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)] },
      },
      order: ['date'],
      limit: 10,
      offset: (page - 1) * 10,
      include: [
        { model: User, as: 'organizer', attributes: ['id', 'name', 'email'] },
      ],
    });

    /*
     * Valida se existem meetups cadastrados.
     */
    if (!meetups.length) {
      return res
        .status(200)
        .json({ message: 'Não foram encontrados meetups.' });
    }

    return res.json(meetups);
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

  async delete(req, res) {
    const user_id = req.userId;
    const meetupToDelete = await Meetup.findByPk(req.params.id);
    const { title } = meetupToDelete;

    if (!meetupToDelete) {
      return res.status(400).json({ error: 'Meetup não encontrado.' });
    }

    /*
     * Valida se o usuário é o organizador do meetup.
     */
    if (meetupToDelete.user_id !== user_id) {
      return res
        .status(401)
        .json({ error: 'Somente o organizador pode cancelar o meetup.' });
    }

    /**
     * Verifica a data do meetup.
     */
    if (meetupToDelete.past) {
      return res
        .status(400)
        .json({ error: 'Este meetup ja aconteceu e não poder ser cancelado.' });
    }

    /**
     * Cancelamento do meetup.
     */
    await meetupToDelete.destroy();

    return res.json({ message: `O meetup '${title}' acaba de ser cancelado.` });
  }
}

export default new MeetupController();
