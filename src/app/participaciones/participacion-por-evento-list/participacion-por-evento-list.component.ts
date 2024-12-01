import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ParticipacionService } from '../participacion.service';
import {
	FormsModule,
	NgForm,
	NgModel,
	ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Asistente } from '../../models/asistente.model';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { Participacion } from '../../models/participacion.model';
import { Evento } from '../../models/evento.model';

type ColumnaOrdenada = keyof Participacion | keyof Participacion['asistente'];

@Component({
	selector: 'app-participacion-por-evento-list',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		NgIf,
		CommonModule,
		FormsModule,
		NgFor,
		ConfirmModalComponent,
	],
	templateUrl: './participacion-por-evento-list.component.html',
	styleUrls: ['./participacion-por-evento-list.component.css'],
})
export class ParticipacionPorEventoListComponent implements OnInit {
	idEvento: string = '';
	evento!: Evento;
	fechaActual: boolean = false;
	participaciones: Participacion[] = [];
	filtro: string = '';
	paginaActual: number = 1;
	totalPaginas: number = 1;
	tamanoPagina: number = 5;
	paginas: number[] = [];
	opcionesFilas: number[] = [5, 10, 15, 20, 25, 50, 100];

	columnaOrdenada: ColumnaOrdenada = 'asistente'; // Valor predeterminado
	ordenAscendente: boolean = true;

	showModal: boolean = false; // Modal inicialmente cerrado
	message: string = '';
	participacionSeleccionado: Participacion | null = null;

	constructor(
		private route: ActivatedRoute,
		private participacionesService: ParticipacionService
	) {}

	ngOnInit(): void {
		// Obtener el id del evento desde la URL
		this.idEvento = this.route.snapshot.paramMap.get('id') || '';
		// Obtener las participaciones al cargar la página
		this.cargarParticipaciones();
	}

	cargarParticipaciones(): void {
		this.participacionesService
			.obtenerParticipacionesPorEvento(
				this.idEvento,
				this.paginaActual,
				this.tamanoPagina,
				this.filtro
			)
			.subscribe((response: any) => {
				this.participaciones = response.participaciones;
				this.evento = response.evento;
				this.totalPaginas = response.totalPaginas;
				const fechaActual = new Date().toISOString().slice(0, 10);
				const fechaEvento = new Date(this.evento.fecha)
					.toISOString()
					.slice(0, 10);
				this.fechaActual = fechaEvento > fechaActual;
				this.generarPaginacion();
			});
	}

	cambiarPagina(pagina: number): void {
		if (pagina >= 1 && pagina <= this.totalPaginas) {
			this.paginaActual = pagina;
			this.cargarParticipaciones();
		}
	}

	generarPaginacion(): void {
		const paginas: number[] = [];
		for (let i = 1; i <= this.totalPaginas; i++) {
			paginas.push(i);
		}
		this.paginas = paginas;
	}

	aplicarFiltro(): void {
		this.paginaActual = 1; // Reiniciar a la primera página al aplicar filtro
		this.cargarParticipaciones();
	}

	// Método para actualizar el tamaño de la página
	actualizarTamanoPagina(): void {
		this.paginaActual = 1; // Reiniciar a la primera página al cambiar el tamaño de las filas
		this.cargarParticipaciones();
	}

	siguiente(): void {
		if (this.paginaActual < this.totalPaginas) {
			this.paginaActual++;
			this.cargarParticipaciones();
		}
	}

	anterior(): void {
		if (this.paginaActual > 1) {
			this.paginaActual--;
			this.cargarParticipaciones();
		}
	}

	ordenarPor(columna: ColumnaOrdenada): void {
		// Verificar si la columna corresponde a una propiedad dentro de 'asistente'
		if (columna.startsWith('asistente.')) {
			// Extraer el campo (por ejemplo 'nombre', 'domicilio', etc.)
			const campo = columna.split('.')[1];

			// Ordenar las participaciones por la propiedad dentro de 'asistente'
			this.participaciones.sort((a, b) => {
				const valorA = a.asistente ? [campo] : '';
				const valorB = b.asistente ? [campo] : '';
				return valorA > valorB ? 1 : valorA < valorB ? -1 : 0;
			});
		} else {
			// Ordenar por propiedades que no sean de 'asistente' (como confirmacion)
			this.participaciones.sort((a, b) => {
				const valorA = (a as any)[columna];
				const valorB = (b as any)[columna];
				return valorA > valorB ? 1 : valorA < valorB ? -1 : 0;
			});
		}
		// Actualizar la columna ordenada
		this.columnaOrdenada = columna;
	}

	editarParticipacion(idParticipacion: number) {}

	eliminarParticipacion(participacion: Participacion): void {
		this.showModal = true;
		this.message = `¿Estás seguro de que deseas eliminar al participante: ${participacion.asistente?.nombre}? Esta acción es irreversible.`;
		this.participacionSeleccionado = participacion;
	}

	confirmarEliminacion(confirmado: boolean): void {
		if (confirmado && this.participacionSeleccionado) {
			this.participacionesService
				.eliminarParticipacion(this.participacionSeleccionado.idEvento)
				.subscribe(() => {
					this.participaciones = this.participaciones.filter(
						(a) =>
							a.idEvento !==
							this.participacionSeleccionado?.idEvento
					);
				});
		}

		// En ambos casos cerramos el modal y limpiamos el estado.
		this.showModal = false;
		this.participacionSeleccionado = null;
		this.cargarParticipaciones();
	}
}
