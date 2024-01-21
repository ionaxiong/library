const MONGODB_URI = process.env.MONGODB_URI || undefined;
const SECRET = process.env.SECRET || undefined;
module.exports = {
  MONGODB_URI, //: 'mongodb://the_username:the_password@localhost:3456/the_database',
  SECRET,
};
