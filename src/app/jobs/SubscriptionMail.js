import Mail from '../lib/Mail';

class SubscriptionMail {
  get key() {
    return 'SubscriptionMail';
  }

  // Tarefa que será executada
  async handle({ data }) {
  const { email, name } = data;

    await Mail.sendMail({
      to: `${email} <${email}>`,
      subject: 'Nova inscrição no seu meetup',
      // text: 'Você tem um novo cancelamento.',
      template: 'subscription',
      context: {
        name,
      },
    });
  }
}

export default new SubscriptionMail();

// import CancellationMail from '..'
// CancellationMail.key ..
