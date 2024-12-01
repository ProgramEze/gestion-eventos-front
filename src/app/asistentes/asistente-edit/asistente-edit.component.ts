import { Component, OnInit } from '@angular/core';
import {
	FormGroup,
	FormBuilder,
	Validators,
	ReactiveFormsModule,
	AbstractControl,
	ValidationErrors,
	FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AsistenteService } from '../asistente.service';
import { Asistente } from '../../models/asistente.model';
import { NgClass, NgIf } from '@angular/common';

export function noNumbersInName(
	control: AbstractControl
): ValidationErrors | null {
	const name = control.value;
	const pattern = /^[a-zA-Z\s]+$/; // Solo letras y espacios
	if (name && !pattern.test(name)) {
		return { noNumbers: true }; // Error si el nombre contiene números
	}
	return null; // No hay error
}

@Component({
	selector: 'app-asistente-edit',
	standalone: true,
	imports: [ReactiveFormsModule, NgClass, NgIf],
	templateUrl: './asistente-edit.component.html',
	styleUrls: ['./asistente-edit.component.css'],
})
export class AsistenteEditComponent implements OnInit {
	asistenteForm: FormGroup;
	asistenteId!: number;
	asistente!: Asistente; // Para almacenar el asistente actual
	esModoEdicion: boolean = false; // Variable para controlar si es modo edición
	mensaje: string = ''; // Para mostrar mensajes de éxito, error, o advertencia
	mensajeClase: string = ''; // Clase CSS para el mensaje (e.g., 'success', 'error', 'warning')
	mensajeError: string = '';

	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private asistenteService: AsistenteService
	) {
		this.asistenteForm = this.fb.group({
			nombre: new FormControl('', [
				Validators.required,
				Validators.minLength(6),
				noNumbersInName, // Aplicamos el validador
			]),
			domicilio: new FormControl('', [
				Validators.required,
				Validators.minLength(10),
			]),
			email: new FormControl('', [Validators.required, Validators.email]),
			rol: ['', Validators.required],
			estado: [true, Validators.required],
		});
	}

	ngOnInit(): void {
		this.asistenteId = +this.route.snapshot.paramMap.get('id')!;
		if (this.asistenteId) {
			this.cargarAsistente();
		}
		this.asistenteForm.get('nombre')?.valueChanges.subscribe((value) => {});

		this.asistenteForm
			.get('domicilio')
			?.valueChanges.subscribe((value) => {});

		this.asistenteForm.get('email')?.valueChanges.subscribe((value) => {});
	}

	cargarAsistente(): void {
		this.asistenteService
		.getAsistente(this.asistenteId).subscribe(
			(asistente: Asistente) => {
				this.asistente = asistente;
				this.asistenteForm.patchValue(asistente);
				this.asistenteForm.disable(); // Inicialmente en modo detalles (campos deshabilitados)
			},
			(error) => {
				console.error('Error al cargar los datos del asistente', error);
				this.router.navigate(['/asistentes']);
			}
		);
	}

	editar(): void {
		this.esModoEdicion = true;
		this.asistenteForm.enable(); // Habilitar el formulario para edición
	}

	volver(): void {
		if (this.esModoEdicion) {
			// Si estaba en modo edición, volver al modo detalles
			this.esModoEdicion = false;
			this.cargarAsistente()
			this.asistenteForm.disable();
		} else {
			// Si estaba en modo detalles, volver a la lista de asistentes
			this.router.navigate(['/asistentes']);
		}
	}

	onSubmit(): void {
		if (this.asistenteForm.valid) {
			const asistenteData: Asistente = this.asistenteForm.value;
			asistenteData.idAsistente = this.asistenteId;

			this.asistenteService
				.actualizarAsistente(this.asistenteId, asistenteData)
				.subscribe(
					(response: any) => {
						this.mensaje =
							response.message ||
							'¡Asistente actualizado exitosamente!';
						this.mensajeClase = 'success'; // Mensaje de éxito
						this.esModoEdicion = false; // Volver a modo detalles después de actualizar
						this.asistenteForm.disable(); // Deshabilitar el formulario
					},
					(error) => {
						console.error(
							'Error al actualizar el asistente',
							error
						);
						if (error.status === 400 || error.status === 404) {
							this.mensaje =
								error.error.error ||
								'Hubo un problema con la actualización. Revisa los datos.';
							this.mensajeClase = 'warning'; // Mensaje de advertencia
						} else if (error.status === 500) {
							this.mensaje =
								'Error al actualizar el asistente. Intenta nuevamente más tarde.';
							this.mensajeClase = 'danger'; // Mensaje de error
						}
					}
				);
		} else {
			this.mensaje = 'Por favor, completa todos los campos requeridos.';
			this.mensajeClase = 'warning'; // Mensaje de advertencia
		}
	}
}
