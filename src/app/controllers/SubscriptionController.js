import { Op } from 'sequelize';
import { isBefore, isAfter, startOfHour, endOfHour } from 'date-fns';
import Queue from '../lib/Queue';
import User from '../models/User';
import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';
import SubscriptionMail from '../jobs/SubscriptionMail';

class SubscriptionController {
  async index(req, res) {
    const meetups = await Subscription.findAll({
      where: {
        user_id: req.userId,
      },
      include: [
        {
          model: Meetup,
          as: 'meetup',
        },
      ],
    });

    const available = meetups.filter(meet => {
      return isAfter(meet.meetup.date, new Date());
    });
    return res.json(available);
  }

  async store(req, res) {
    const meetup = await Meetup.findByPk(req.body.meetup_id, {
      include: [{ model: User, as: 'user', attributes: ['name', 'email'] }],
    });

    const loggerUser = await User.findByPk(req.userId);

    // Check if meetup exists
    if (!meetup) {
      return res.status(400).json({ error: 'Meetup not found!' });
    }

    // Check if the meetup is owned for user
    if (meetup.user_id === req.userId) {
      return res
        .status(401)
        .json({ error: 'You cannot subscribe in your meetup!' });
    }

    // Check if meetup is already done
    if (isBefore(meetup.date, new Date())) {
      return res
        .status(400)
        .json({ error: 'You cannot subscribe in past events!' });
    }

    // Check if user tries to subscribe into two meetup with the same time
    const checkSubscription = await Subscription.findOne({
      where: {
        user_id: req.userId,
        meetup_id: req.body.meetup_id,
      },
    });

    if (checkSubscription) {
      return res.status(401).json({
        error: 'You cannot subscribe more than once in this meetup!',
      });
    }

    const checkSameDate = await Subscription.findOne({
      where: {
        user_id: req.userId,
      },
      include: [
        {
          model: Meetup,
          as: 'meetup',
          where: {
            date: {
              [Op.between]: [startOfHour(meetup.date), endOfHour(meetup.date)],
            },
          },
        },
      ],
    });

    if (checkSameDate) {
      return res.status(401).json({
        error: 'You already have a meetup in this time',
      });
    }
    // Check if user tries to subscribe more than once

    const subscription = await Subscription.create(
      {
        user_id: req.userId,
        meetup_id: req.body.meetup_id,
      },
      { include: [{ model: Meetup, as: 'meetup' }] }
    );

    // ==> Falta adicionar os campos que vai no email meetup.user.email e user.name <==
    await Queue.add(SubscriptionMail.key, {
      email: meetup.user.email,
      name: loggerUser.name,
    });

    return res.json(subscription);
  }
}

export default new SubscriptionController();
