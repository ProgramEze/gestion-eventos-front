import { Asistente } from './asistente.model';
import { Evento } from './evento.model';

export interface Participacion {
	idParticipacion: number;
	idAsistente: number;
	asistente?: {
		nombre?: string;
		domicilio?: string;
		email?: string;
		rol?: string;
	};
	Asistente?: Asistente;
	idEvento: number;
	evento?: Evento;
	confirmacion: boolean;
}
