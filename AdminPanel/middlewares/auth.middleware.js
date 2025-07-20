module.exports = (req, res, next) => {
  const { role, pass } = req.query;
  if (role === "admin" && pass === "saveEarth") {
    next();
  } else {
    return res.status(401).json({ message: "Not Authorized" });
  }
};
