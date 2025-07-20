module.exports = (req, res, next) => {
  const timestamp = new Date().toString();
  const log = `URL: ${req.url}, Method: ${req.method}, Timestamp: ${timestamp}`;
  console.log(log);
  next();
};
