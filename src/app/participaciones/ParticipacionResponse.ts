export interface ParticipacionResponse {
	pagina: number;
	tamanoPagina: number;
	totalParticipaciones: number;
	totalPaginas: number;
	evento: {
		idEvento: number;
		nombre: string;
		fecha: string;
		ubicacion: string;
		descripcion: string;
	};
	participaciones: Participacion[];
	prev: string | null;
	next: string | null;
}

interface Participacion {
	idParticipacion: number;
	idAsistente: number;
	idEvento: number;
	confirmacion: boolean;
	Asistente: {
		idAsistente: number;
		nombre: string;
		domicilio: string;
		email: string;
		rol: string;
		estado: boolean;
	};
}
