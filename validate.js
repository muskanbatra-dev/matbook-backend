const { z } = require("zod");

function buildFieldSchema(field) {
  const { label, type, required, validations = {}, options = [] } = field;

  let schema;

  switch (type) {
    case "text":
    case "textarea":
    case "date":
      schema = z.string({
        required_error: `${label} is required`,
        invalid_type_error: `${label} must be a string`,
      });
      break;

    case "number":
      schema = z.coerce.number({
        required_error: `${label} is required`,
        invalid_type_error: `${label} must be a number`,
      });
      break;

    case "select":
      schema = z
        .string({
          required_error: `${label} is required`,
          invalid_type_error: `${label} must be a string`,
        })
        .refine(
          (val) => options.map((o) => o.value).includes(val),
          `${label} has an invalid value`
        );
      break;

    case "multi-select":
      schema = z
        .array(z.string(), {
          required_error: `${label} is required`,
          invalid_type_error: `${label} must be an array`,
        })
        .refine(
          (vals) => vals.every((v) => options.map((o) => o.value).includes(v)),
          `${label} contains invalid selections`
        );
      break;

    case "switch":
      schema = z.boolean({
        invalid_type_error: `${label} must be a boolean`,
      });
      break;

    default:
      schema = z.any();
  }

  if (["text", "textarea"].includes(type)) {
    if (validations.minLength) {
      schema = schema.min(
        validations.minLength,
        `${label} must be at least ${validations.minLength} characters`
      );
    }
    if (validations.maxLength) {
      schema = schema.max(
        validations.maxLength,
        `${label} must be at most ${validations.maxLength} characters`
      );
    }
    if (validations.regex) {
      const regex = new RegExp(validations.regex);
      schema = schema.regex(regex, `${label} is invalid`);
    }
  }

  if (type === "number") {
    if (validations.min !== undefined) {
      schema = schema.min(
        validations.min,
        `${label} must be >= ${validations.min}`
      );
    }
    if (validations.max !== undefined) {
      schema = schema.max(
        validations.max,
        `${label} must be <= ${validations.max}`
      );
    }
  }

  if (type === "date") {
    schema = schema.refine(
      (val) => !isNaN(Date.parse(val)),
      `${label} must be a valid date`
    );

    if (validations.minDate) {
      schema = schema.refine(
        (val) => new Date(val) >= new Date(validations.minDate),
        `${label} cannot be before ${validations.minDate}`
      );
    }
  }

  if (type === "multi-select") {
    if (validations.minSelected) {
      schema = schema.min(
        validations.minSelected,
        `${label} must have at least ${validations.minSelected} selection(s)`
      );
    }
    if (validations.maxSelected) {
      schema = schema.max(
        validations.maxSelected,
        `${label} must have at most ${validations.maxSelected} selections`
      );
    }
  }

  if (!required) {
    schema = schema.optional();
  }

  return schema;
}

function buildZodSchema(formSchema) {
  const shape = {};

  for (const field of formSchema.fields) {
    shape[field.name] = buildFieldSchema(field);
  }

  return z.object(shape);
}

function validateSubmission(data, formSchema) {
  const zodSchema = buildZodSchema(formSchema);

  try {
    zodSchema.parse(data);
    return {};
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errors = {};

      for (const issue of err.issues) {
        const field = issue.path[0];
        if (!errors[field]) errors[field] = issue.message;
      }

      return errors;
    }

    throw err;
  }
}

module.exports = {
  validateSubmission,
  buildZodSchema,
};
