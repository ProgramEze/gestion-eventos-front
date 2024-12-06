import { Component } from '@angular/core';
import {
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { DatePipe, NgClass, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { EventoService } from '../evento.service';

@Component({
	selector: 'app-evento-create',
	templateUrl: './evento-create.component.html',
	styleUrls: ['./evento-create.component.css'],
	standalone: true,
	imports: [ReactiveFormsModule, NgClass, NgIf, RouterLink],
})
export class EventoCreateComponent {
	eventoForm: FormGroup;
	hoy: string;
	errorMessage: string | null = null;

	constructor(
		private fb: FormBuilder,
		private datePipe: DatePipe,
		private eventoService: EventoService,
		private router: Router
	) {
		this.eventoForm = this.fb.group({
			nombre: ['', [Validators.required, Validators.minLength(5)]],
			fecha: [
				'',
				[Validators.required, this.minDateValidator.bind(this)],
			],
			ubicacion: ['', Validators.required],
			descripcion: ['', Validators.required],
		});

		this.hoy = this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '';
	}

	// Validador personalizado para la fecha mínima
	minDateValidator(control: any) {
		const fechaIngresada = new Date(control.value);
		const hoy = new Date();
		hoy.setHours(0, 0, 0, 0);
		if (fechaIngresada <= hoy) {
			return { minDate: true };
		}
		return null;
	}

	onSubmit() {
		if (this.eventoForm.valid) {
			const nuevoEvento = this.eventoForm.value;
			this.eventoService.crearEvento(nuevoEvento).subscribe(
				(response) => {
					console.log(response);
					this.router.navigate(['/eventos']);
					this.errorMessage = '';
				},
				(error) => {
					this.errorMessage =
						'Error al crear el evento. Intenta nuevamente. Error: ' + error.message;
				}
			);
			this.errorMessage = null;
		} else {
			this.errorMessage = 'Por favor, revisa los campos del formulario.';
		}
	}
}
