function librarian(req, res, next) {
    if (req.user.role !== "librarian") return res.status(403).send("Access Denied");
    next();
  }
  
  module.exports = librarian;
  