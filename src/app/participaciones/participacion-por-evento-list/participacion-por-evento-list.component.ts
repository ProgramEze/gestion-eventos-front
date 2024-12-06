import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ParticipacionService } from '../participacion.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Asistente } from '../../models/asistente.model';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { Participacion } from '../../models/participacion.model';
import { Evento } from '../../models/evento.model';

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
	evento: Evento | null = null;
	asistentes: Asistente[] = [];
	fechaActual: boolean = false;
	participaciones: Participacion[] = [];
	filtro: string = '';
	paginaActual: number = 1;
	totalPaginas: number = 1;
	tamanoPagina: number = 5;
	paginas: number[] = [];
	opcionesFilas: number[] = [5, 10, 15, 20, 25, 50, 100];

	columnaOrdenada: keyof Asistente = 'nombre';
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
				this.participaciones.forEach((participacion) => {
					if (participacion.Asistente != undefined) {
						this.asistentes?.push(participacion.Asistente);
					}
				});
				this.totalPaginas = response.totalPaginas;
				const fechaActual = new Date().toISOString().slice(0, 10);
				if (this.evento != null) {
					const fechaEvento = new Date(this.evento.fecha)
						.toISOString()
						.slice(0, 10);
					this.fechaActual = fechaEvento > fechaActual;
				}
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

	// Función de ordenamiento
	ordenarPor(columna: keyof Asistente): void {
		// Si se hace clic en la misma columna, se invierte el orden
		if (this.columnaOrdenada === columna) {
			this.ordenAscendente = !this.ordenAscendente;
		} else {
			this.columnaOrdenada = columna;
			this.ordenAscendente = true;
		}

		// Ordenar las participaciones basándose en la propiedad del Asistente
		this.participaciones.sort((a, b) => {
			const valorA = a.Asistente?.[columna] ?? ''; // Usar un valor por defecto si es undefined
			const valorB = b.Asistente?.[columna] ?? ''; // Usar un valor por defecto si es undefined

			if (typeof valorA === 'string' && typeof valorB === 'string') {
				return this.ordenAscendente
					? valorA.localeCompare(valorB)
					: valorB.localeCompare(valorA);
			}

			if (valorA < valorB) {
				return this.ordenAscendente ? -1 : 1;
			}
			if (valorA > valorB) {
				return this.ordenAscendente ? 1 : -1;
			}
			return 0;
		});
	}


	confirmarParticipacion(idParticipacion: number){
		this.participacionesService.confirmarParticipacion(idParticipacion).subscribe(() => {
			this.cargarParticipaciones();
		});
	}

	cancelarParticipacion(idParticipacion: number){
		this.participacionesService.bajaConfirmacion(idParticipacion).subscribe(() => {
			this.cargarParticipaciones();
		});
	}

	eliminarParticipacion(participacion: Participacion): void {
		this.showModal = true;
		this.message = `¿Estás seguro de que deseas eliminar al participante: ${participacion.Asistente?.nombre}? Esta acción es irreversible.`;
		this.participacionSeleccionado = participacion;
	}

	confirmarEliminacion(confirmado: boolean): void {
		if (confirmado && this.participacionSeleccionado) {
			this.participacionesService
				.eliminarParticipacion(this.participacionSeleccionado.idParticipacion)
				.subscribe(() => {
					this.participaciones = this.participaciones.filter(
						(a) =>
							a.idEvento !==
							this.participacionSeleccionado?.idEvento
					);
					this.cargarParticipaciones();
				});
		}

		// En ambos casos cerramos el modal y limpiamos el estado.
		this.showModal = false;
		this.participacionSeleccionado = null;
		this.cargarParticipaciones();
	}
}
