import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Subscription from '../models/Subscription';
import User from '../models/User';
import Meetup from '../models/Meetup';

import Mail from '../../lib/Mail';

class SubscriptionController {
  async store(req, res) {
    const user = await User.findByPk(req.userId);
    const meetup = await Meetup.findByPk(req.params.meetupId, {
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['name', 'email'],
        },
      ],
    });

    /*
     * Verifica se o usuário é o organizador do meetup que deseja inscrever
     */
    if (meetup.user_id === req.userId) {
      return res.status(400).json({
        error: 'Não se pode inscrever em meetups que você é o organizador',
      });
    }

    /*
     * Verifica a data do meetup
     */
    if (meetup.pastDate) {
      return res
        .status(400)
        .json({ error: 'Não se pode inscrever em meetups de datas passadas.' });
    }

    /*
     * Verifica se o usuário já está inscrito em algum meetup na mesma data.
     */
    const checkSameDate = await Subscription.findOne({
      where: { user_id: user.id },
      include: [
        {
          model: Meetup,
          required: true,
          where: { date: meetup.date },
        },
      ],
    });

    if (checkSameDate) {
      return res
        .status(400)
        .json({ error: 'Não se pode inscrever em 2 meetups na mesma data' });
    }

    /*
     * Faz a inscrição no meetup
     */
    const subscription = await Subscription.create({
      user_id: user.id,
      meetup_id: meetup.id,
    });

    /**
     * Envia um e-mail para o organizador relatando a inscrição do usuário no meetup.
     */
    await Mail.sendMail({
      to: `${meetup.organizer.name} <${meetup.organizer.email}>`,
      subject: `Inscrição no Meetup`,
      // text: `Foi feita uma inscrição no meetup ${meetup.title}. Participante: ${user.name}`,
      template: 'subscription',
      context: {
        organizer: meetup.organizer.name,
        meetup: meetup.title,
        date: format(meetup.date, "'dia' dd 'de' MMMM', às' H:mm'h'", {
          locale: pt,
        }),
        participant: user.name,
        contact: user.email,
      },
    });

    return res.json(subscription);
  }
}

export default new SubscriptionController();
