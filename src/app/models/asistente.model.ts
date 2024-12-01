export interface Asistente {
    idAsistente: number;
    nombre: string;
    domicilio: string;
    email: string;
    password?: string; // Opcional, puede ser manejado en el backend
    rol: string; // Ej: "organizador", "asistente"
    estado: boolean; // true: activo, false: inactivo
  }