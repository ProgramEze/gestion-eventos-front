import { Participacion } from '../models/participacion.model';
import { Injectable } from '@angular/core';
import {
	HttpClient,
	HttpParams,
} from '@angular/common/http';
import { Observable} from 'rxjs';
import { ParticipacionResponse } from './ParticipacionResponse';

@Injectable({
	providedIn: 'root',
})
export class ParticipacionService {
	private apiUrl = 'http://localhost:5000/participaciones'; // Cambia la URL según tu configuración
	constructor(private http: HttpClient) {}

	// Crear una nueva participación
	crearParticipacion(idEvento: number): Observable<any> {
		let idAsistente = sessionStorage.getItem('idAsistente');
		let credentials = { idAsistente, idEvento };
		return this.http.post(this.apiUrl, credentials, {
			withCredentials: true, // Si necesitas enviar cookies o credenciales
		});
	}//

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
		return this.http.get<ParticipacionResponse>(
			`${this.apiUrl}/evento/${idEvento}`,
			{
				params,
				withCredentials: true,
			}
		);
	}//

	// Obtener participaciones por asistente
	obtenerParticipacionesPorAsistente(): Observable<Participacion[]> {
		const idAsistente = sessionStorage.getItem('idAsistente');
		return this.http.get<Participacion[]>(
			`${this.apiUrl}/asistente/${idAsistente}`,
			{
				withCredentials: true,
			}
		);
	}//

	// Obtener participación por ID
	obtenerParticipacionPorId(idEvento: number): Observable<Participacion> {
		const idAsistente = sessionStorage.getItem('idAsistente');
		return this.http.get<Participacion>(
			`${this.apiUrl}?idAsistente=${idAsistente}&idEvento=${idEvento}`,
			{
				withCredentials: true, // Si necesitas enviar cookies o credenciales
			}
		);
	}//

	// Baja de confirmación de una participación
	bajaConfirmacion(idParticipacion: number): Observable<any> {
		return this.http.put(
			`${this.apiUrl}/baja/${idParticipacion}`,
			{},
			{
				withCredentials: true, // Esto es necesario si la autenticación es por cookies
			}
		);
	}//

	// Eliminar una participación
	eliminarParticipacion(idParticipacion: number): Observable<any> {
		return this.http.delete(`${this.apiUrl}/eliminar/${idParticipacion}`, {
			withCredentials: true,
		});
	}//

	// Generar certificado en PDF de una participación
	generarCertificado(idParticipacion: number): Observable<Blob> {
		return this.http.get(`${this.apiUrl}/certificado/${idParticipacion}`, {
			responseType: 'blob', // Para recibir el archivo como Blob
			withCredentials: true, // En caso de autenticación basada en cookies
		});
	}//

	// Confirmar una participación
	confirmarParticipacion(idParticipacion: number): Observable<any> {
		return this.http.put(
			`${this.apiUrl}/confirmar/${idParticipacion}`,
			{},
			{
				withCredentials: true, // Esto es necesario si la autenticación es por cookies
			}
		);
	}
}
