import Sequelize from 'sequelize';

import User from '../app/models/User';
import File from '../app/models/File';
import Meetup from '../app/models/Meetup';

import databaseConfig from '../config/database';

const models = [User, File, Meetup];

class Database {
  constructor() {
    this.init();
    // this.associate();
  }

  init() {
    // cria a conexão
    this.connection = new Sequelize(databaseConfig);

    // repassa o database para o init de cada modelo
    models.map(model => model.init(this.connection));

    // associa as chaves estrangeiras nos models
    models.map(
      model => model.associate && model.associate(this.connection.models)
    );
  }
  // associate() {}
}

export default new Database();
