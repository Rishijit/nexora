const jwt = require("jsonwebtoken");

function protect(req, res, next) {
  try {
    // Read the Authorization header
    const authHeader = req.headers.authorization;

    // Check whether the header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied. Please log in.",
      });
    }

    // Extract the token
    const token = authHeader.split(" ")[1];

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user ID to the request
    req.userId = decoded.userId;

    // Continue to the next route
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

module.exports = protect;