import { Participacion } from '../models/participacion.model';
import { Injectable } from '@angular/core';
import {
	HttpClient,
	HttpErrorResponse,
	HttpHeaders,
	HttpParams,
} from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ParticipacionResponse } from './ParticipacionResponse';

@Injectable({
	providedIn: 'root',
})
export class ParticipacionService {
	private apiUrl = 'http://localhost:5000/participaciones'; // Cambia la URL según tu configuración
	constructor(private http: HttpClient) {}

	// Crear una nueva participación
	crearParticipacion(participacion: Participacion): Observable<any> {
		return this.http.post(`${this.apiUrl}/`, participacion, {
			withCredentials: true,
		});
	}

	// Obtener participaciones por evento
	obtenerParticipacionesPorEvento(
		idEvento: string,
		pagina: number = 1,
		tamanoPagina: number = 10,
		filtro: string = ''
	): Observable<ParticipacionResponse> {
		// Definir los parámetros de la consulta
		let params = new HttpParams()
			.set('pagina', pagina.toString())
			.set('tamanoPagina', tamanoPagina.toString())
			.set('filtro', filtro);

		// Realizar la solicitud GET al backend
		return this.http.get<ParticipacionResponse>(`${this.apiUrl}/evento/${idEvento}`, {
			params,
			withCredentials: true,
		});
	}

	// Obtener participaciones por asistente
	obtenerParticipacionesPorAsistente(idAsistente: number): Observable<any> {
		return this.http.get(`${this.apiUrl}/asistente/${idAsistente}`);
	}

	// Obtener participación por ID
	obtenerParticipacionPorId(idParticipacion: number): Observable<any> {
		return this.http.get(`${this.apiUrl}/${idParticipacion}`);
	}

	// Confirmar una participación
	confirmarParticipacion(idParticipacion: number): Observable<any> {
		return this.http.put(`${this.apiUrl}/confirmar/${idParticipacion}`, {});
	}

	// Baja de confirmación de una participación
	bajaConfirmacion(idParticipacion: number): Observable<any> {
		return this.http.put(`${this.apiUrl}/baja/${idParticipacion}`, {});
	}

	// Eliminar una participación
	eliminarParticipacion(idParticipacion: number): Observable<any> {
		return this.http.delete(`${this.apiUrl}/eliminar/${idParticipacion}`);
	}

	// Generar certificado en PDF de una participación
	generarCertificado(idParticipacion: number): Observable<Blob> {
		return this.http.get(`${this.apiUrl}/certificado/${idParticipacion}`, {
			responseType: 'blob', // Recibir el PDF como un archivo Blob
		});
	}

	// Obtener participaciones no confirmadas por evento
	obtenerParticipacionesPorConfirmarPorEvento(
		idEvento: number
	): Observable<any> {
		return this.http.get(
			`${this.apiUrl}/evento/no-confirmados/${idEvento}`
		);
	}

	// Obtener participaciones confirmadas por evento
	obtenerParticipacionesConfirmadasPorEvento(
		idEvento: number
	): Observable<any> {
		return this.http.get(`${this.apiUrl}/evento/confirmados/${idEvento}`);
	}

	// Obtener participaciones no confirmadas por asistente
	obtenerParticipacionesPorConfirmarPorAsistente(
		idAsistente: number
	): Observable<any> {
		return this.http.get(
			`${this.apiUrl}/asistente/no-confirmados/${idAsistente}`
		);
	}

	// Obtener participaciones confirmadas por asistente
	obtenerParticipacionesConfirmadasPorAsistente(
		idAsistente: number
	): Observable<any> {
		return this.http.get(
			`${this.apiUrl}/asistente/confirmados/${idAsistente}`
		);
	}
}
