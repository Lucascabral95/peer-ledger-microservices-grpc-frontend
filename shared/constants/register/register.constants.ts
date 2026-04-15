export const REGISTER_FIELDS = [
  {
    name: "name" as const,
    label: "Nombre completo",
    type: "text" as const,
    placeholder: "Lucia Fernandez",
    autoComplete: "name",
  },
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
    placeholder: "Crea una contraseña segura",
    autoComplete: "new-password",
  },
];
