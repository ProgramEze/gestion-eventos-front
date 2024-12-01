import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
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

	// Método para obtener eventos futuros con paginación y filtro
	getEventosFuturos(
		page: number = 1,
		limit: number = 10,
		search: string = ''
	): Observable<any> {
		const params = {
			page: page.toString(),
			limit: limit.toString(),
			search: search,
		};
		return this.http.get<any>(`${this.baseUrl}/obtenerEventosFuturos`, {
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

/*
Aquí tienes los prompts con la nueva combinación de colores para los componentes de la vista que quieres generar:

---

### **Prompt para listar eventos (event-list.component.html):**

"

---

### **Prompt para detalle de evento (event-detail.component.html):**

"Genera una plantilla HTML en Angular para `event-detail.component.html` utilizando Bootstrap 5 y la siguiente combinación de colores:

- Color Primario: #4CAF50 (Verde Esmeralda)
- Color Secundario: #CDDC39 (Verde Lima)
- Color de Acento: #FFEB3B (Amarillo Solar)
- Fondo Claro: #F1F8E9 (Verde Pálido)
- Fondo Oscuro: #33691E (Verde Bosque)

La plantilla debe:

- Mostrar información detallada de un evento, incluyendo:
  - 'Nombre del Evento'
  - 'Fecha'
  - 'Ubicación'
  - 'Descripción'
- Incluir un botón para regresar a la lista de eventos (`/event-list`).
- Añadir un botón para editar el evento (`/event-edit/:id`).
- Utilizar un diseño en formato de tarjeta para separar visualmente la información del evento.
- Mantener la paleta de colores verde natural, ideal para transmitir frescura y naturaleza.

Asegúrate de que la interfaz sea clara y atractiva, con un diseño que combine elegancia y simplicidad."

---

### **Prompt para editar evento (event-edit.component.html):**

"Genera una plantilla HTML en Angular para `event-edit.component.html` utilizando Bootstrap 5 y la siguiente combinación de colores:

- Color Primario: #4CAF50 (Verde Esmeralda)
- Color Secundario: #CDDC39 (Verde Lima)
- Color de Acento: #FFEB3B (Amarillo Solar)
- Fondo Claro: #F1F8E9 (Verde Pálido)
- Fondo Oscuro: #33691E (Verde Bosque)

La plantilla debe:

- Incluir un formulario para editar los detalles de un evento, con campos para:
  - 'Nombre del Evento'
  - 'Fecha'
  - 'Ubicación'
  - 'Descripción'
- Validar que la fecha ingresada no sea anterior a la fecha actual.
- Mostrar mensajes de error para los campos obligatorios.
- Incluir botones de 'Guardar' y 'Cancelar'. El botón 'Cancelar' debe redirigir a la lista de eventos (`/event-list`).
- Utilizar la paleta de colores indicada, con énfasis en la frescura y la naturaleza, para crear una atmósfera relajante y ecológica en la interfaz.
- Asegurar que el formulario sea responsive y fácil de usar tanto en dispositivos móviles como en escritorio."

---

Con estos prompts, puedes generar vistas consistentes y en línea con la paleta de colores que elegiste, manteniendo la estética ecológica y fresca para los eventos.
*/
