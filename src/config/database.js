// Configurações de conectividade com o banco de dados postgres
module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  port: '5434',
  username: 'postgres',
  password: 'admin',
  database: 'meetapp',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
