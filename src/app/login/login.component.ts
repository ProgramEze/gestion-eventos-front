import { Component, OnInit } from '@angular/core';
import {
	FormGroup,
	FormBuilder,
	Validators,
	ReactiveFormsModule,
} from '@angular/forms';
import { LoginService } from './login.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [ReactiveFormsModule, CommonModule, RouterLink],
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
	loginForm: FormGroup;
	errorMessage: string = '';

	constructor(
		private fb: FormBuilder,
		private loginService: LoginService,
		private router: Router
	) {
		this.loginForm = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(6)]],
		});
	}

	ngOnInit(): void {
		if (this.loginService.isLoggedIn()) {
			this.router.navigate(['/']);
		}
	}

	onSubmit() {
		if (this.loginForm.valid) {
			// Extraer los valores del formulario
			const { email, password } = this.loginForm.value;

			// Crear el objeto login para enviar al backend
			const login = { email, password };
			console.log(login); // Verifica los datos del formulario

			// Realizar la solicitud de login
			this.loginService.login(login).subscribe(
				(response) => {
					console.log('Inicio de sesión exitoso:', response);
					// Redirigir según el rol
					if (response.user.rol === 'Organizador') {
						this.router.navigate(['/asistentes']);
					} else if (response.user.rol === 'Asistente') {
						this.router.navigate(['/eventos']);
					}
				},
				(error) => {
					console.error('Error al iniciar sesión:', error);
					this.errorMessage =
						'Email o contraseña incorrecta. Por favor, inténtalo de nuevo.';
				}
			);
		} else {
			// Si el formulario no es válido, mostrar mensaje de error
			this.errorMessage =
				'Por favor, completa todos los campos correctamente.';
		}
	}
}
