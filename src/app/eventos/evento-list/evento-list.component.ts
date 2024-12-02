import { Component, OnInit } from '@angular/core';
import { EventoService } from '../evento.service';
import { Evento } from '../../models/evento.model';
import { LoginService } from '../../login/login.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { ParticipacionService } from '../../participaciones/participacion.service';

@Component({
	selector: 'app-evento-list',
	standalone: true,
	imports: [CommonModule, FormsModule, RouterLink, ConfirmModalComponent],
	templateUrl: './evento-list.component.html',
	styleUrls: ['./evento-list.component.css'],
	providers: [EventoService, DatePipe],
})
export class EventoListComponent implements OnInit {
	eventos: Evento[] = [];
	filtroEventos: string = 'todos'; // Valor inicial: mostrar todos los eventos
	filtro: string = '';
	fechaInicio: string = '';
	fechaFin: string = '';
	paginaActual: number = 1;
	totalPaginas: number = 1;
	tamanoPagina: number = 5;
	paginas: number[] = [];
	opcionesFilas: number[] = [5, 10, 15, 20, 25, 50, 100];
	isOrganizer: boolean = false;
	
	direccionOrden: string = 'asc'; // Dirección del orden (ascendente/descendente)
	columnaOrdenada: keyof Evento = 'nombre';
	ordenAscendente: boolean = true;
	
	showModal: boolean = false; // Modal inicialmente cerrado
	message: string = '';
	eventoSeleccionado: Evento | null = null;

	constructor(
		private eventoService: EventoService,
		private participacionService: ParticipacionService,
		private loginService: LoginService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.isOrganizer = this.loginService.isRoleIn() == 'Organizador';
		this.cargarEventos();
	}

	cambiarFiltro(): void {
        this.paginaActual = 1; // Reiniciar la paginación al cambiar el filtro
        this.cargarEventos();
    }

    cargarEventos(): void {
        if (this.filtroEventos === 'participo') {
            this.cargarEventosParticipo();
        } else if (this.filtroEventos === 'noParticipo') {
            this.cargarEventosNoParticipo();
        } else {
            this.cargarTodosLosEventos();
        }
    }

    cargarTodosLosEventos(): void {
        this.eventoService
            .getEventos(this.paginaActual, this.tamanoPagina, this.filtro, this.fechaInicio, this.fechaFin)
            .subscribe((response: any) => {
                this.eventos = response.eventos;
                this.totalPaginas = response.totalPaginas;
                this.generarPaginacion();
            });
    }

    cargarEventosParticipo(): void {
        this.eventoService
            .getEventosParticipo(this.paginaActual, this.tamanoPagina, this.filtro, this.fechaInicio, this.fechaFin)
            .subscribe((response: any) => {
                this.eventos = response.eventos;
                this.totalPaginas = response.totalPaginas;
                this.generarPaginacion();
            });
    }

    cargarEventosNoParticipo(): void {
        this.eventoService
            .getEventosNoParticipo(this.paginaActual, this.tamanoPagina, this.filtro, this.fechaInicio, this.fechaFin)
            .subscribe((response: any) => {
                this.eventos = response.eventos;
                this.totalPaginas = response.totalPaginas;
                this.generarPaginacion();
            });
    }

    generarPaginacion(): void {
        const paginas: number[] = [];
        for (let i = 1; i <= this.totalPaginas; i++) {
            paginas.push(i);
        }
        this.paginas = paginas;
    }

    cambiarPagina(pagina: number): void {
        if (pagina >= 1 && pagina <= this.totalPaginas) {
            this.paginaActual = pagina;
            this.cargarEventos();
        }
    }

	// Función para formatear las fechas en el formato deseado
	formatearFecha(fecha: string): string {
		const fechaObj = new Date(fecha + 'T00:00:00'); // Asegura que se interprete en la zona horaria local
		const opciones: Intl.DateTimeFormatOptions = {
			weekday: 'long', // Nombre completo del día
			day: 'numeric', // Día del mes
			month: 'long', // Nombre completo del mes
			year: 'numeric', // Año completo
		};

		// Formatear la fecha
		const fechaFormateada = new Intl.DateTimeFormat(
			'es-AR',
			opciones
		).format(fechaObj);

		// Capitalizar la primera letra del día
		const partes = fechaFormateada.split(' ');
		partes[0] = partes[0].charAt(0).toUpperCase() + partes[0].slice(1);

		// Unir las partes de nuevo
		return partes.join(' ');
	}

	// Función para aplicar el filtro y cargar los eventos
	aplicarFiltro(): void {
		this.paginaActual = 1; // Reiniciar a la primera página al aplicar filtro
		this.cargarEventos();
	}

	// Función para actualizar el tamaño de la página
	actualizarTamanoPagina(): void {
		this.paginaActual = 1; // Reiniciar a la primera página al cambiar el tamaño
		this.cargarEventos();
	}

	// Eliminar un evento
	eliminarEvento(evento: Evento): void {
		this.showModal = true;
		this.message = `¿Estás seguro de que deseas eliminar el evento: ${evento.nombre}? Esta acción es irreversible.`;
		this.eventoSeleccionado = evento;
	}

	confirmarEliminacion(confirmado: boolean): void {
		if (confirmado && this.eventoSeleccionado) {
			this.eventoService
				.eliminarEvento(this.eventoSeleccionado.idEvento)
				.subscribe(() => {
					this.eventos = this.eventos.filter(
						(a) => a.idEvento !== this.eventoSeleccionado?.idEvento
					);
				});
		}

		// En ambos casos cerramos el modal y limpiamos el estado.
		this.showModal = false;
		this.eventoSeleccionado = null;
		this.cargarEventos();
	}

	// Ordenar la lista de eventos
	ordenarPor(columna: keyof Evento): void {
		if (this.columnaOrdenada === columna) {
			this.ordenAscendente = !this.ordenAscendente;
		} else {
			this.columnaOrdenada = columna;
			this.ordenAscendente = true;
		}

		this.eventos = this.eventos.sort((a, b) => {
			const valorA = a[this.columnaOrdenada] ?? '';
			const valorB = b[this.columnaOrdenada] ?? '';

			if (valorA < valorB) {
				return this.ordenAscendente ? -1 : 1;
			}
			if (valorA > valorB) {
				return this.ordenAscendente ? 1 : -1;
			}
			return 0;
		});
	}

	unirseAEvento(idEvento: number) {
		const idAsistente = sessionStorage.getItem('idAsistente');
		if (idAsistente !== null) {
			this.participacionService
				.crearParticipacion({
					idAsistente: parseInt(idAsistente),
					idEvento,
				})
				.subscribe({
					next: (response) => {
						console.log(response.message); // "¡Participación registrada exitosamente!"
					},
					error: (err) => {
						console.error(err.error); // Manejo de errores
					},
				});
		} else {
			// Handle the case when the value is null
			console.log('idAsistente is null');
		}
	}

	verParticipaciones(id: number): void {
		this.router.navigate(['/participaciones/evento', id]);
	}

	editarEvento(idEvento: number): void {
		this.router.navigate(['/eventos', idEvento]);
	}
}
