const PASSWORD_SPECIAL_CHARACTER_REGEX = /[^A-Za-z0-9]/;

export interface PasswordRequirement {
  id: string;
  label: string;
  isValid: boolean;
}

export function getPasswordRequirements(password: string): PasswordRequirement[] {
  return [
    {
      id: "length",
      label: "Al menos 8 caracteres",
      isValid: password.length >= 8,
    },
    {
      id: "uppercase",
      label: "Al menos una mayuscula",
      isValid: /[A-Z]/.test(password),
    },
    {
      id: "lowercase",
      label: "Al menos una minuscula",
      isValid: /[a-z]/.test(password),
    },
    {
      id: "number",
      label: "Al menos un número",
      isValid: /\d/.test(password),
    },
    {
      id: "symbol",
      label: "Al menos un signo o simbolo",
      isValid: PASSWORD_SPECIAL_CHARACTER_REGEX.test(password),
    },
  ];
}

export function isPasswordPolicySatisfied(password: string): boolean {
  return getPasswordRequirements(password).every(
    (requirement) => requirement.isValid,
  );
}
