import Sequelize from 'sequelize';
import User from '../app/models/User';
import databaseConfig from '../config/database';

const models = [User];

class Database {
  constructor() {
    this.init();
  }

  init() {
    // cria a conexão
    this.connection = new Sequelize(databaseConfig);

    // repassa o dabate para o init de cada modelo
    models.map(model => model.init(this.connection));
  }
}

export default new Database();
