const { JWT_KEY = 'some-secret-key' } = process.env;
const { DB_ADDRESS = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

module.exports = {
  JWT_KEY,
  DB_ADDRESS,
};
