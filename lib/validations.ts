// ── Simple form validation helpers (no Zod dependency) ───────────────────────

export type ValidationResult = { valid: boolean; error?: string };

export function validateEmail(email: string): ValidationResult {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) return { valid: false, error: "Email is required" };
  if (!re.test(email)) return { valid: false, error: "Enter a valid email address" };
  return { valid: true };
}

export function validatePassword(password: string): ValidationResult {
  if (!password) return { valid: false, error: "Password is required" };
  if (password.length < 8)
    return { valid: false, error: "Password must be at least 8 characters" };
  if (!/[A-Z]/.test(password))
    return { valid: false, error: "Password must contain at least one uppercase letter" };
  if (!/[0-9]/.test(password))
    return { valid: false, error: "Password must contain at least one number" };
  return { valid: true };
}

export function validateName(name: string): ValidationResult {
  if (!name.trim()) return { valid: false, error: "Name is required" };
  if (name.trim().length < 2) return { valid: false, error: "Name must be at least 2 characters" };
  if (name.trim().length > 60) return { valid: false, error: "Name is too long" };
  return { valid: true };
}

export function validateOtp(otp: string): ValidationResult {
  if (!otp) return { valid: false, error: "OTP is required" };
  if (!/^\d{6}$/.test(otp)) return { valid: false, error: "OTP must be 6 digits" };
  return { valid: true };
}

export function validateConfirmPassword(
  password: string,
  confirm: string
): ValidationResult {
  if (!confirm) return { valid: false, error: "Please confirm your password" };
  if (password !== confirm) return { valid: false, error: "Passwords do not match" };
  return { valid: true };
}
