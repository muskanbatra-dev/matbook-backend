const fs = require("fs");
const { buildZodSchema } = require("../validate");

const validateFormMiddleware = (req, res, next) => {
  try {
    const formSchema = JSON.parse(fs.readFileSync("formSchema.json", "utf8"));
    const zodSchema = buildZodSchema(formSchema);

    const result = zodSchema.safeParse(req.body);

    if (!result.success) {
      const errors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (!errors[field]) errors[field] = issue.message;
      }

      return res.status(400).json({
        success: false,
        errors,
      });
    }

    req.validatedData = result.data;

    next();
  } catch (err) {
    console.error("Validation Middleware Error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

module.exports = validateFormMiddleware;
