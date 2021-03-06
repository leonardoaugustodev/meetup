import Sequelize, { Model } from 'sequelize';

class Meetup extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: Sequelize.STRING,
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        location: Sequelize.STRING,
        date: Sequelize.DATE,
        image_id: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  // Salva a referencia do arquivo da tabela do usuario
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}

export default Meetup;
