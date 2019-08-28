// deve utilizar sintaxe do commonjs (sem import/export)
module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'meetappdb',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
