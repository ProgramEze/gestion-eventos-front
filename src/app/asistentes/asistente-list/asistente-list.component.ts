import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Asistente } from '../../models/asistente.model';
import { AsistenteService } from '../asistente.service'; // Ajusta la ruta si es necesario
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';

@Component({
	selector: 'app-asistente-list',
	standalone: true,
	imports: [NgIf, NgFor, CommonModule, FormsModule, ConfirmModalComponent], // Asegúrate de importar FormsModule aquí
	templateUrl: './asistente-list.component.html',
	styleUrls: ['./asistente-list.component.css'],
})
export class AsistenteListComponent implements OnInit {
	asistentes: Asistente[] = [];
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
	asistenteSeleccionado: Asistente | null = null;

	constructor(
		private asistenteService: AsistenteService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.cargarAsistentes();
	}

	cargarAsistentes(): void {
		this.asistenteService
			.getAsistentes(this.paginaActual, this.tamanoPagina, this.filtro)
			.subscribe((response: any) => {
				this.asistentes = response.asistentes;
				this.totalPaginas = response.totalPaginas;
				this.generarPaginacion();
			});
	}

	cambiarPagina(pagina: number): void {
		if (pagina >= 1 && pagina <= this.totalPaginas) {
			this.paginaActual = pagina;
			this.cargarAsistentes();
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
		this.cargarAsistentes();
	}

	// Método para editar un asistente
	verDetalles(asistente: any) {
		this.router.navigate(['/asistentes', asistente.idAsistente]);
	}

	// Método para actualizar el tamaño de la página
	actualizarTamanoPagina(): void {
		this.paginaActual = 1; // Reiniciar a la primera página al cambiar el tamaño de las filas
		this.cargarAsistentes();
	}

	siguiente(): void {
		if (this.paginaActual < this.totalPaginas) {
			this.paginaActual++;
			this.cargarAsistentes();
		}
	}

	anterior(): void {
		if (this.paginaActual > 1) {
			this.paginaActual--;
			this.cargarAsistentes();
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

		// Ordenar los asistentes en memoria según la columna seleccionada
		this.asistentes = this.asistentes.sort((a, b) => {
			const valorA = a[this.columnaOrdenada] ?? ''; // Usar un valor por defecto si es undefined
			const valorB = b[this.columnaOrdenada] ?? ''; // Usar un valor por defecto si es undefined

			if (typeof valorA === 'boolean' && typeof valorB === 'boolean') {
				// Comparar valores booleanos si la columna es "estado"
				return this.ordenAscendente
					? valorA === valorB
						? 0
						: valorA
						? -1
						: 1
					: valorA === valorB
					? 0
					: valorA
					? 1
					: -1;
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

	editarAsistente(asistente: Asistente): void {
		this.router.navigate(['/asistentes/', asistente.idAsistente]);
	}

	eliminarAsistente(asistente: Asistente): void {
		this.showModal = true;
		this.message = `¿Estás seguro de que deseas eliminar a ${asistente.nombre}? Esta acción es irreversible.`;
		this.asistenteSeleccionado = asistente;
	}

	confirmarEliminacion(confirmado: boolean): void {
		if (confirmado && this.asistenteSeleccionado) {
			this.asistenteService
				.eliminarAsistente(this.asistenteSeleccionado.idAsistente)
				.subscribe(() => {
					this.asistentes = this.asistentes.filter(
						(a) =>
							a.idAsistente !==
							this.asistenteSeleccionado?.idAsistente
					);
				});
		}

		// En ambos casos cerramos el modal y limpiamos el estado.
		this.showModal = false;
		this.asistenteSeleccionado = null;
		this.cargarAsistentes();
	}
}
