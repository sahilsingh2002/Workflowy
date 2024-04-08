const { User } = require('../connectDB/allCollections');

const handleUserExists = async ({ username, user }) => {
  const existingUser = await user.findOne({ username });
  return existingUser ? true : false;
};

module.exports.post_signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ status: false, message: "Please provide all required fields" });
    }

    const user = User();
    const userExists = await handleUserExists({ username, user });

    if (userExists) {
      return res.status(400).json({ status: false, message: "Username already exists" });
    }

    await user.insertOne({ username, email, password });
    return res.status(201).json({ status: true, message: "User created successfully" });
  } catch (err) {
    console.error("Error in post_signup:", err);
    return res.status(500).json({ status: false, message: "An error occurred" });
  }
};

module.exports.post_login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = User();
    const userData = await user.findOne({ username });

    if (!userData) {
      return res.status(400).json({ status: false, message: "Incorrect username" });
    }

    if (userData.password !== password) {
      return res.status(400).json({ status: false, message: "Incorrect password" });
    }

    return res.json({ status: true, message: "Login successful" });
  } catch (err) {
    console.error("Error in post_login:", err);
    return res.status(500).json({ status: false, message: "An error occurred" });
  }
};
