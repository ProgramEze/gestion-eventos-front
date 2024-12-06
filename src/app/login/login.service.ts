import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Login } from '../models/login.model';
import { Usuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class LoginService {
	private baseUrl = 'http://localhost:5000';
	public loggedInSubject = new BehaviorSubject<boolean>(false);
	public loggedIn$: Observable<boolean> = this.loggedInSubject.asObservable();

	constructor(private http: HttpClient, private router: Router) {}

	registrar(credentials: any): Observable<any> {
		return this.http
			.post<any>(`${this.baseUrl}/registrar`, credentials)
			.pipe(
				tap((response) => {
					if (response.user) {
						this.setUserSession(response.user);
					}
				})
			);
	}

	login(credentials: Login): Observable<any> {
		return this.http
			.post<any>(`${this.baseUrl}/login`, credentials, {
				withCredentials: true,
			})
			.pipe(
				tap((response) => {
					if (response.user) {
						this.setUserSession(response.user);
					}
				})
			);
	}

	logout(): Observable<void> {
		return this.http
			.get<void>(`${this.baseUrl}/logout`, { withCredentials: true })
			.pipe(
				tap(() => {
					// Limpiar sesión local
					sessionStorage.clear();
					this.loggedInSubject.next(false); // Notificar que el usuario no está logueado
				})
			);
	}

	private setUserSession(user: Usuario): void {
		const { idAsistente, nombre, email, rol } = user;
		sessionStorage.setItem('loggedIn', 'true');
		sessionStorage.setItem('idAsistente', idAsistente.toString());
		sessionStorage.setItem('nombre', nombre);
		sessionStorage.setItem('email', email);
		sessionStorage.setItem('userRole', rol);

		this.loggedInSubject.next(true); // Notificar que el usuario está logueado
	}

	getNombre(): string | null {
		return sessionStorage.getItem('nombre');
	}

	isRoleIn(): string {
		return sessionStorage.getItem('userRole') || '';
	}

	isLoggedIn(): boolean {
		return sessionStorage.getItem('loggedIn') === 'true';
	}

	checkSession(): void {
		const isLoggedIn = this.isLoggedIn();
		this.loggedInSubject.next(isLoggedIn);
	}

	miPerfil(): Observable<Usuario> {
		return this.http.get<Usuario>(`${this.baseUrl}/perfil`, {
			withCredentials: true,
		});
	}
}
