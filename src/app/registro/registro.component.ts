import { Component, OnInit } from '@angular/core';
import {
	FormGroup,
	FormControl,
	Validators,
	ReactiveFormsModule,
	AbstractControl,
	ValidationErrors,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../login/login.service';

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

// Validador para confirmar la contraseña
export function passwordMatchValidator(
	control: AbstractControl
): { mismatch: boolean } | null {
	const password = control.get('password')?.value;
	const confirmPassword = control.get('confirmPassword')?.value;

	return password === confirmPassword ? null : { mismatch: true };
}

@Component({
	selector: 'app-registro',
	standalone: true,
	imports: [ReactiveFormsModule, CommonModule, RouterLink],
	templateUrl: './registro.component.html',
	styleUrls: ['./registro.component.css'],
})
export class RegistroComponent implements OnInit {
	registroForm!: FormGroup;
	errorMessage: string = '';

	constructor(
		private http: HttpClient,
		private loginService: LoginService,
		private router: Router
	) {}

	ngOnInit(): void {
		if (this.loginService.isLoggedIn()) {
			this.router.navigate(['/']);
		}

		// Se aplica el validador de grupo personalizado aquí
		this.registroForm = new FormGroup(
			{
				nombre: new FormControl('', [
					Validators.required,
					Validators.minLength(6),
					noNumbersInName, // Aplicamos el validador
				]),
				domicilio: new FormControl('', [
					Validators.required,
					Validators.minLength(10),
				]),
				email: new FormControl('', [
					Validators.required,
					Validators.email,
				]),
				password: new FormControl('', [
					Validators.required,
					Validators.minLength(6),
				]),
				confirmPassword: new FormControl('', [Validators.required]),
			},
			{ validators: passwordMatchValidator }
		);

		// Suscribirse a los cambios de cada campo individualmente
		this.registroForm.get('nombre')?.valueChanges.subscribe((value) => {});

		this.registroForm
			.get('domicilio')
			?.valueChanges.subscribe((value) => {});

		this.registroForm.get('email')?.valueChanges.subscribe((value) => {});

		this.registroForm
			.get('password')
			?.valueChanges.subscribe((value) => {});

		this.registroForm
			.get('confirmPassword')
			?.valueChanges.subscribe((value) => {});
	}

	// Lógica para el registro
	registrar() {
		if (this.registroForm.valid) {
			this.loginService.registrar(this.registroForm.value).subscribe(
				() => {
					this.router.navigate(['/login']);
					this.errorMessage = '';
				},
				() => {
					this.errorMessage =
						'Error al registrar el usuario. Intenta nuevamente.';
				}
			);
		} else {
			this.errorMessage =
				'Por favor, completa todos los campos correctamente.';
		}
	}
}
