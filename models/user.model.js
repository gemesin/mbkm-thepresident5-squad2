module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('users', {
      user_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
      },
      nama: { 
          type: Sequelize.STRING, // Tetap menggunakan username
          allowNull: false,
      },
      email: {
          type: Sequelize.STRING,
          allowNull: false,
      },
      password: {
          type: Sequelize.STRING,
          allowNull: false,
      },
      tanggal_lahir: { // Menambahkan tanggal_lahir
          type: Sequelize.DATE,
          allowNull: true, // Sesuaikan dengan kebutuhan Anda
      },
      no_hp: { // Menambahkan no_hp
          type: Sequelize.STRING,
          allowNull: true, // Sesuaikan dengan kebutuhan Anda
      },
  });

  return User;
}
