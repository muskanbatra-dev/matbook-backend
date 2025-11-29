require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const prisma = require("./db");
const { validateSubmission } = require("./validate");
const validateForm = require("./middleware/validateForm");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Backend API");
});

app.get("/api/form-schema", (req, res) => {
  try {
    const schema = JSON.parse(fs.readFileSync("formSchema.json", "utf8"));
    res.json(schema);
  } catch (err) {
    console.error("Error reading schema:", err);
    res.status(500).json({ error: "Form schema loading failed" });
  }
});

app.post("/api/submissions", validateForm, async (req, res) => {
  try {
    const submission = await prisma.submission.create({
      data: { data: req.validatedData },
    });

    return res.status(201).json({
      success: true,
      id: submission.id,
      createdAt: submission.createdAt,
    });
  } catch (err) {
    console.error("POST /api/submissions error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

app.get("/api/submissions", async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 10, 1);
    const sortOrder = req.query.sortOrder === "asc" ? "asc" : "desc";

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.submission.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: sortOrder },
      }),
      prisma.submission.count(),
    ]);

    return res.status(200).json({
      success: true,
      submissions: items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("GET /api/submissions error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Backend API is running on http://localhost:${PORT}`);
});
