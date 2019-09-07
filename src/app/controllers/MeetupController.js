import * as Yup from 'yup';
import { isBefore, parseISO, startOfHour } from 'date-fns';
import Meetup from '../models/Meetup';

class MeetupController {
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
      return res
        .status(400)
        .json({ error: 'Falha na validação para inclusão de meetup.' });
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
}

export default new MeetupController();
