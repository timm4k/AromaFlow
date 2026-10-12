export const aromaLimits = {
  name: 24,
  descriptionMin: 20,
  description: 220,
  preview: 100,
};

export function validateName(name, existingNames = []) {
  const trimmed = name.trim();

  if (trimmed.length === 0) return { valid: false, message: "" };
  if (trimmed.length < 2)
    return { valid: false, message: "Name must contain at least 2 characters" };
  if (trimmed.length > aromaLimits.name)
    return {
      valid: false,
      message: `Name must be ${aromaLimits.name} characters or fewer`,
    };
  if (/^\d+$/.test(trimmed))
    return { valid: false, message: "Name cannot be only numbers" };
  if (/^[.,\-_#$%@!&*()+=]+$/.test(trimmed))
    return { valid: false, message: "Name cannot contain only symbols" };
  if (/^(.)\1+$/.test(trimmed))
    return { valid: false, message: "Name cannot be repeated characters" };

  const normalized = trimmed.toLowerCase();
  if (existingNames.some((n) => n.toLowerCase() === normalized)) {
    return { valid: false, message: "This aroma already exists" };
  }

  return { valid: true, message: "" };
}

export function validateDescription(text) {
  const trimmed = text.trim();

  if (trimmed.length === 0) return { valid: false, message: "" };
  if (trimmed.length < aromaLimits.descriptionMin)
    return {
      valid: false,
      message: `Description is too short (min ${aromaLimits.descriptionMin} characters)`,
    };
  if (trimmed.length > aromaLimits.description)
    return {
      valid: false,
      message: `Description is too long (max ${aromaLimits.description} characters)`,
    };

  const repeated = /(.)\1{5,}/.test(trimmed);
  if (repeated)
    return { valid: false, message: "Description contains repeated patterns" };

  return { valid: true, message: "" };
}

export function formatName(raw) {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return "";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}
