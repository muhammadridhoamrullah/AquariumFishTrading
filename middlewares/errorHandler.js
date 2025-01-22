async function errorHandling(err, req, res, next) {
  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    const errors = err.errors.map((el) => {
      return el.message;
    });
    res.status(400).json({ message: errors[0] });
  } else if (err.name === "EMAIL_PASSWORD_ROLE_REQUIRED") {
    res.status(400).json({ message: "Email, password, or role is required" });
  } else if (err.name === "EMAIL_PASSWORD_REQUIRED") {
    res.status(400).json({ message: "Email or password is required" });
  } else if (err.name === "EMAIL_PASSWORD_INVALID") {
    res.status(400).json({ message: "Invalid Email or Password" });
  } else if (err.name === "UNAUTHORIZED") {
    res.status(401).json({ message: "Please Login First!" });
  } else if (err.name === "DATA_NOT_FOUND") {
    res.status(404).json({ message: "Data Not Found" });
  } else if (err.name === "JsonWebTokenError") {
    res.status(401).json({ message: "Invalid Token" });
  } else if (err.name === "FISH_ID_REQUIRED") {
    res.status(400).json({ message: "Fish ID is required" });
  } else if (err.name === "STATUS_PURCHASEDATE_REQUIRED") {
    res.status(400).json({ message: "Status and Purchase Date is required" });
  } else if (err.name === "FORBIDDEN") {
    res.status(403).json({ message: "You Have No Access" });
  } else if (err.name === "NO_DUPLICATE") {
    res.status(400).json({ message: "You already have this fish" });
  } else if (err.name === "STATUS_REQUIRED") {
    res.status(400).json({ message: "Status is required" });
  } else if (err.name === "CHECKUP_DATE_REQUIRED") {
    res.status(400).json({ message: "Check Up Date is required" });
  }
}

module.exports = {
  errorHandling,
};
