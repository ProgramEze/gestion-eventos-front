import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { Asistente } from '../models/asistente.model';

@Injectable({ providedIn: 'root' })
export class AsistenteService {
	private baseUrl = 'http://localhost:5000/asistentes'; // URL base de tu API

	constructor(private http: HttpClient) {}

	// Obtiene la lista de asistentes con paginación y filtro
	getAsistentes(
		pagina: number = 1,
		tamanoPagina: number = 5,
		filtro: string = ''
	): Observable<any> {
		let params = new HttpParams()
			.set('pagina', pagina.toString()) // Asegúrate de que 'pagina' sea un número válido
			.set('tamanoPagina', tamanoPagina.toString())
			.set('filtro', filtro);

		return this.http
			.get<any>(`${this.baseUrl}`, { params, withCredentials: true })
			.pipe(
				catchError((err) => {
					throw err;
				})
			);
	}

	// Obtiene un asistente por su idAsistente
	getAsistente(idAsistente: number): Observable<Asistente> {
		return this.http.get<Asistente>(`${this.baseUrl}/${idAsistente}`, {
			withCredentials: true,
		});
	}

	// Actualiza un asistente existente
	actualizarAsistente(
		idAsistente: number,
		asistente: Asistente
	): Observable<Asistente> {
		return this.http
			.put<Asistente>(`${this.baseUrl}/${idAsistente}`, asistente, {
				withCredentials: true,
			})
			.pipe(
				catchError((err) => {
					throw err;
				})
			);
	}

	// Elimina un asistente
	eliminarAsistente(idAsistente: number): Observable<void> {
		return this.http.delete<void>(`${this.baseUrl}/${idAsistente}`, {
			withCredentials: true,
		});
	}
}
