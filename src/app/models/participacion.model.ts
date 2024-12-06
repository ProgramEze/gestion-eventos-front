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
	Evento?: Evento;
	idEvento: number;
	evento?: Evento;
	confirmacion: boolean;
}
