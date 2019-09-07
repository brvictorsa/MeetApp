import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

class OrganizingController {
  async index(req, res) {
    const user_id = req.userId;
    const user = await User.findByPk(user_id);
    const meetups = await Meetup.findAll({
      attributes: ['id', 'title', 'description', 'location', 'date'],
      where: { user_id },
      order: ['date'],
      include: [
        {
          model: File,
          as: 'banner',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    if (!meetups.length) {
      return res.status(200).json({
        message: `Não foram encontrados meetups organizados pelo usuário ${user.name}`,
      });
    }

    return res.json(meetups);
  }
}

export default new OrganizingController();
