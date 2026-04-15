export const LOGIN_FIELDS = [
  {
    name: "email" as const,
    label: "Correo corporativo",
    type: "email" as const,
    placeholder: "equipo@peerledger.com",
    autoComplete: "email",
  },
  {
    name: "password" as const,
    label: "Contraseña",
    type: "password" as const,
    placeholder: "Ingresa tu contraseña",
    autoComplete: "current-password",
  },
];
