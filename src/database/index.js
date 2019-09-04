import Sequelize from 'sequelize';

import User from '../app/models/User';
import File from '../app/models/File';

import databaseConfig from '../config/database';

const models = [User, File];

class Database {
  constructor() {
    this.init();
  }

  init() {
    // cria a conexão
    this.connection = new Sequelize(databaseConfig);

    // repassa o database para o init de cada modelo
    models.map(model => model.init(this.connection));
  }
}

export default new Database();
