import { isBefore, parseISO } from 'date-fns';
import * as Yup from 'yup';
import Meetup from '../models/Meetup';

class MeetupController {
  async index(req, res) {
    const meetups = await Meetup.findAll({
      where: { user_id: req.userId },
    });

    return res.json(meetups);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      image_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const meetup = await Meetup.findByPk(req.params.id);

    if (!meetup) {
      return res.status(400).json({
        error: 'This meetup does not exists!',
      });
    }

    if (meetup.user_id !== req.userId) {
      return res.status(401).json({
        error: "You don't have permission to update this meetup!",
      });
    }

    const meetupUpdated = await meetup.update(req.body);

    return res.json(meetupUpdated);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      image_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { title, description, location, date, image_id } = req.body;

    if (isBefore(parseISO(date), new Date())) {
      return res.status(400).json({ error: 'You cannot create past meetup' });
    }

    const meetup = await Meetup.create({
      user_id: req.userId,
      title,
      description,
      location,
      date,
      image_id,
    });

    return res.json(meetup);
  }

  async delete(req, res) {
    const meetup = await Meetup.findByPk(req.params.id);

    if (!meetup) {
      return res.status(400).json({
        error: 'This meetup does not exists!',
      });
    }

    if (meetup.user_id !== req.userId) {
      return res.status(401).json({
        error: "You don't have permission to cancel this meetup!",
      });
    }

    await meetup.destroy();

    return res.json({ message: 'Meetup canceled!' });
  }
}

export default new MeetupController();
