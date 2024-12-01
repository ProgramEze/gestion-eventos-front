import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventoService } from '../evento.service';
import { Evento } from '../../models/evento.model';
import {
	FormGroup,
	FormBuilder,
	Validators,
	ReactiveFormsModule,
	FormControl,
	AbstractControl,
	ValidationErrors,
} from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';

@Component({
	selector: 'app-evento-edit',
	standalone: true,
	imports: [ReactiveFormsModule, NgClass, NgIf],
	templateUrl: './evento-edit.component.html',
	styleUrls: ['./evento-edit.component.css'],
	providers: [EventoService],
})
export class EventoEditComponent implements OnInit {
	eventoForm: FormGroup;
	eventoId!: number;
	evento!: Evento;
	esModoEdicion: boolean = false; // Nueva propiedad
	mensaje: string = ''; // Nueva propiedad
	mensajeClase: string = ''; // Nueva propiedad
	mensajeError: string = ''; // Nueva propiedad

	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private eventoService: EventoService
	) {
		this.eventoForm = this.fb.group({
			nombre: new FormControl('', [Validators.required, Validators.minLength(5)]),
			fecha: ['', [Validators.required, this.fechaSuperiorValidator]],
			ubicacion: new FormControl('', [Validators.required, Validators.minLength(3)]),
			descripcion: new FormControl('', [Validators.required]),
		});
	}

	ngOnInit(): void {
		this.eventoId = +this.route.snapshot.paramMap.get('id')!;
		if (this.eventoId) {
			this.cargarEvento();
		}
		this.eventoForm.get('nombre')?.valueChanges.subscribe((value) => {});
		this.eventoForm.get('fecha')?.valueChanges.subscribe((value) => {});
		this.eventoForm.get('ubicacion')?.valueChanges.subscribe((value) => {});
		this.eventoForm
			.get('descripcion')
			?.valueChanges.subscribe((value) => {});
	}

	cargarEvento(): void {
		this.eventoService.getEvento(this.eventoId).subscribe(
			(evento: Evento) => {
				this.evento = evento;
				this.eventoForm.patchValue(evento);
				this.eventoForm.disable();
			},
			(error) => {
				console.error('Error al cargar el evento:', error);
				this.router.navigate(['/eventos']);
			}
		);
	}

	editar(): void {
		this.esModoEdicion = true;
		this.mensaje = '';
		this.eventoForm.enable();
	}

	volver(): void {
		if (this.esModoEdicion) {
			this.esModoEdicion = false;
			this.cargarEvento();
			this.eventoForm.disable();
		} else {
			this.router.navigate(['/eventos']);
		}
	}

	onSubmit(): void {
		if (this.eventoForm.valid) {
			const eventoData: Evento = this.eventoForm.value;
			eventoData.idEvento = this.eventoId;
			this.eventoService
				.actualizarEvento(this.eventoId.toString(), eventoData)
				.subscribe(
					(response) => {
						this.mensaje =
							'¡Evento actualizado exitosamente!';
						this.mensajeClase = 'success'; // Mensaje de éxito
						this.esModoEdicion = false; // Volver a modo detalles luego de actualizar
						this.eventoForm.disable(); // Deshabilitar el formulario
					},
					(error) => {
						console.error('Error al actualizar el evento', error);
						if (error.status === 400 || error.status === 404) {
							this.mensaje =
								error.error.error ||
								'Hubo un problema con la actualización. Revisa los datos.';
							this.mensajeClase = 'warning'; // Mensaje de advertencia
						} else if (error.status === 500) {
							this.mensaje =
								'Error al actualizar el evento. Intenta nuevamente más tarde.';
							this.mensajeClase = 'danger'; // Mensaje de error
						}
					}
				);
		}
	}

	// Validador personalizado para verificar que la fecha sea superior a la fecha actual
	fechaSuperiorValidator(control: AbstractControl): ValidationErrors | null {
		if (!control.value) return null;
		const fechaIngresada = new Date(control.value);
		const fechaActual = new Date();
		fechaActual.setHours(0, 0, 0, 0); // Ignorar la hora actual
		return fechaIngresada > fechaActual ? null : { fechaInvalida: true };
	}
}
