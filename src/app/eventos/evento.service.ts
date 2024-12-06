import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { Evento } from '../models/evento.model';

@Injectable({ providedIn: 'root' })
export class EventoService {
	private baseUrl = 'http://localhost:5000/eventos'; // URL base de tu API

	constructor(private http: HttpClient) {}

	// Crea un nuevo evento
	crearEvento(evento: Evento): Observable<any> {
		console.log(evento);

		return this.http.post<any>(this.baseUrl, evento, {
			withCredentials: true,
		});
	}

	// Obtiene la lista de eventos
	getEventos(
		pagina: number = 1,
		tamanoPagina: number = 5,
		filtro: string = '',
		fechaInicio: string = '',
		fechaFin: string = ''
	): Observable<any> {
		// Transformamos los nombres de los parámetros para que coincidan con lo que espera el backend
		let params = new HttpParams()
			.set('pagina', pagina.toString())
			.set('tamanoPagina', tamanoPagina.toString())
			.set('filtro', filtro)
			.set('fechaInicio', fechaInicio.toString())
			.set('fechaFin', fechaFin.toString());

		return this.http
			.get<any>(`${this.baseUrl}`, { params, withCredentials: true })
			.pipe(
				catchError((err) => {
					throw err;
				})
			);
	}

	getEventosParticipo(
		page: number = 1,
		limit: number = 10,
		search: string = '',
		fechaInicio: string = '',
		fechaFin: string = ''
	): Observable<any> {
		const params = {
			pagina: page.toString(),
			tamanoPagina: limit.toString(),
			filtro: search,
			fechaInicio: fechaInicio,
			fechaFin: fechaFin,
		};
		return this.http.get<any>(`${this.baseUrl}/participo`, {
			params,
			withCredentials: true,
		});
	}

	getCantidadEventosHastaFinAnio(): Observable<number> {
		return this.http
			.get<{ cantidadEventos: number }>(
				`${this.baseUrl}/cantidad-hasta-fin-anio`,
				{
					withCredentials: true,
				}
			)
			.pipe(
				map((response) => response.cantidadEventos) // Extraer el atributo
			);
	}

	getCincoEventos(): Observable<Evento[]> {
		return this.http.get<Evento[]>(`${this.baseUrl}/cinco-eventos`, {
			withCredentials: true,
		});
	}

	getEventosNoParticipo(
		page: number = 1,
		limit: number = 10,
		search: string = '',
		fechaInicio: string = '',
		fechaFin: string = ''
	): Observable<any> {
		const params = {
			pagina: page.toString(),
			tamanoPagina: limit.toString(),
			filtro: search,
			fechaInicio: fechaInicio,
			fechaFin: fechaFin,
		};
		return this.http.get<any>(`${this.baseUrl}/no-participo`, {
			params,
			withCredentials: true,
		});
	}

	getEvento(idEvento: number): Observable<Evento> {
		return this.http.get<Evento>(`${this.baseUrl}/${idEvento}`, {
			withCredentials: true,
		});
	}

	// Actualiza un evento existente
	actualizarEvento(idEvento: string, evento: Evento): Observable<Evento> {
		console.log(idEvento);
		console.log(evento);
		return this.http.put<Evento>(`${this.baseUrl}/${idEvento}`, evento, {
			withCredentials: true,
		});
	}

	// Elimina un evento
	eliminarEvento(id: number): Observable<void> {
		return this.http.delete<void>(`${this.baseUrl}/${id}`, {
			withCredentials: true,
		});
	}
}
