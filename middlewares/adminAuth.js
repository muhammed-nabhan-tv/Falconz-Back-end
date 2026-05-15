export const adminAuth = (req, res, next) => {

  // ✅ check if user exists first
  if (!req.user) {
    return res.status(401).json({ message: "Not logged in" });
  }

  // ✅ then check role
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }

  next();
};