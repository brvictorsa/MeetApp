import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class SubscriptionMail {
  get key() {
    return 'SubscriptionMail';
  }

  async handle({ data }) {
    const { meetup, user } = data;

    /** Envia um e-mail para o organizador relatando a inscrição no meetup */
    await Mail.senddMail({
      to: `${meetup.organizer.name} <${meetup.organizer.email}>`,
      subject: `Inscrição no Meetup`,
      template: 'subscription',
      context: {
        organizer: meetup.organizer.name,
        meetup: meetup.title,
        date: format(
          parseISO(meetup.date),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
        participant: user.name,
        contact: user.email,
      },
    });
  }
}

export default new SubscriptionMail();
