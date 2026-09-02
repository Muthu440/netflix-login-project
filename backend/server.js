import express from "express";
import cors from "cors";

const app = express();

const PORT = 5000;

app.use(
  cors({
    origin: "http://localhost:5173"
  })
);

app.use(express.json());

const MOCK_USER = {
  email: "demo@netflix.com",
  password: "Password123!",
  name: "Demo User"
};

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running!"
  });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required."
    });
  }

  if (
    email.toLowerCase() !== MOCK_USER.email ||
    password !== MOCK_USER.password
  ) {
    return res.status(401).json({
      success: false,
      message: "Incorrect email or password."
    });
  }

  return res.json({
    success: true,
    message: "Login successful",
    user: {
      email: MOCK_USER.email,
      name: MOCK_USER.name
    }
  });
});

app.listen(PORT, () => {
  console.log(
    `Backend running at http://localhost:${PORT}`
  );
});
