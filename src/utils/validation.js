export function validateName(name, existingNames = []) {
  const trimmed = name.trim();

  if (trimmed.length === 0) return { valid: false, message: "" };
  if (trimmed.length < 2) return { valid: false, message: "Name must contain at least 2 characters" };
  if (trimmed.length > 24) return { valid: false, message: "Name must be 24 characters or fewer" };
  if (/^\d+$/.test(trimmed)) return { valid: false, message: "Name cannot be only numbers" };
  if (/^[.,\-_#$%@!&*()+=]+$/.test(trimmed)) return { valid: false, message: "Name cannot contain only symbols" };
  if (/^(.)\1+$/.test(trimmed)) return { valid: false, message: "Name cannot be repeated characters" };

  const normalized = trimmed.toLowerCase();
  if (existingNames.some((n) => n.toLowerCase() === normalized)) {
    return { valid: false, message: "This aroma already exists" };
  }

  return { valid: true, message: "" };
}

export function validateDescription(text) {
  const trimmed = text.trim();

  if (trimmed.length === 0) return { valid: false, message: "" };
  if (trimmed.length < 20) return { valid: false, message: "Description is too short (min 20 characters)" };
  if (trimmed.length > 220) return { valid: false, message: "Description is too long (max 220 characters)" };

  const repeated = /(.)\1{5,}/.test(trimmed);
  if (repeated) return { valid: false, message: "Description contains repeated patterns" };

  return { valid: true, message: "" };
}

export function formatName(raw) {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return "";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}
