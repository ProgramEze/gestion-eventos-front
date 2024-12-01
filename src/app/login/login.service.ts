import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { Login } from '../models/login.model';
import { Usuario } from '../models/usuario.model';

class MockStorage {
	private storage: { [key: string]: string } = {};

	getItem(key: string): string | null {
		return this.storage[key] || null;
	}

	setItem(key: string, value: string): void {
		this.storage[key] = value;
	}

	removeItem(key: string): void {
		delete this.storage[key];
	}

	clear(): void {
		this.storage = {};
	}
}

// Reemplazar sessionStorage en entornos donde no esté disponible
if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
	(globalThis as any).sessionStorage = new MockStorage();
}

@Injectable({ providedIn: 'root' })
export class LoginService {
	private baseUrl = 'http://localhost:5000';
	private loggedInSubject = new BehaviorSubject<boolean>(false);
	loggedIn$ = this.loggedInSubject.asObservable();

	constructor(private http: HttpClient, private router: Router) {}

	registrar(credentials: any): Observable<any> {
		return this.http
			.post<any>(`${this.baseUrl}/registrar`, credentials)
			.pipe(
				tap((response) => {
					console.log(response.user !== undefined);
					if (response.user !== undefined) {
						// Guardar el estado en sessionStorage
						const { idAsistente, nombre, email, rol } =
							response.user;
						sessionStorage.setItem('loggedIn', 'true');
						sessionStorage.setItem(
							'idAsistente',
							idAsistente.toString()
						);
						sessionStorage.setItem('nombre', nombre);
						sessionStorage.setItem('email', email);
						sessionStorage.setItem('userRole', rol);
						console.log(sessionStorage.getItem('userRole'));
						this.loggedInSubject.next(true);
					}
				})
			);
	}

	// Método para iniciar sesión
	login(credentials: Login): Observable<any> {
		return this.http
			.post<any>(`${this.baseUrl}/login`, credentials, {
				withCredentials: true,
			})
			.pipe(
				tap((response) => {
					console.log(response.user !== undefined);
					if (response.user !== undefined) {
						// Guardar el estado en sessionStorage
						const { idAsistente, nombre, email, rol } =
							response.user;
						sessionStorage.setItem('loggedIn', 'true');
						sessionStorage.setItem(
							'idAsistente',
							idAsistente.toString()
						);
						sessionStorage.setItem('nombre', nombre);
						sessionStorage.setItem('email', email);
						sessionStorage.setItem('userRole', rol);
						console.log(sessionStorage.getItem('userRole'));
						this.loggedInSubject.next(true);
					}
				})
			);
	}

	// Método para cerrar sesión
	logout(): Observable<void> {
		return this.http
			.get<void>(`${this.baseUrl}/logout`, { withCredentials: true })
			.pipe(
				tap(() => {
					// Limpiar sessionStorage
					sessionStorage.removeItem('loggedIn');
					sessionStorage.removeItem('idAsistente');
					sessionStorage.removeItem('nombre');
					sessionStorage.removeItem('email');
					sessionStorage.removeItem('userRole');
					// Cambiar el estado de loggedIn
					this.loggedInSubject.next(false); // Emitir false para indicar que el usuario no está logueado
					this.checkSession();
				})
			);
	}

	// Verificar si `sessionStorage` está disponible
	isLoggedIn(): boolean {
		return (
			this.isSessionStorageAvailable() &&
			sessionStorage.getItem('loggedIn') === 'true'
		);
	}

	getNombre(): string | null {
		if (
			typeof window !== 'undefined' &&
			typeof sessionStorage !== 'undefined'
		) {
			return sessionStorage.getItem('nombre');
		} else {
			return null;
		}
	}

	isRoleIn(): string {
		return sessionStorage.getItem('userRole') || '';
	}

	// Obtener el usuario actual
	miPerfil(): Observable<Usuario> {
		return this.http.get<Usuario>(`${this.baseUrl}/perfil`, {
			withCredentials: true,
		});
	}

	// Verificar si sessionStorage está disponible
	private isSessionStorageAvailable(): boolean {
		try {
			if (typeof window !== 'undefined' && window.sessionStorage) {
				sessionStorage.setItem('test', 'test');
				sessionStorage.removeItem('test');
				return true;
			}
			return false;
		} catch {
			return false;
		}
	}

	estaAutenticado(): boolean {
		return !!localStorage.getItem('token'); // Comprueba si hay token
	}

	// Comprobar la sesión activa
	checkSession(): void {
		const isLoggedIn = this.isLoggedIn();
		this.loggedInSubject.next(isLoggedIn);
	}
}
