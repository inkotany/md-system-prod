function agent(req, res, next) {
  if (req.user.role !== "agent") return res.status(403).send("Access Denied");
  next();
}

module.exports = agent;
