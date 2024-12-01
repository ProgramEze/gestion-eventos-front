import { Component, OnInit } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
	selector: 'app-perfil',
	standalone: true,
	imports: [NgIf],
	templateUrl: './perfil.component.html',
	styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {
	usuario: Usuario | undefined;
	isLoading = true;
	
	constructor(private loginService: LoginService, private router: Router) {}

	ngOnInit(): void {
	  this.loginService.miPerfil().subscribe({
		next: (usuario) => {
		  this.usuario = usuario;
		  this.isLoading = false;
		},
		error: (error) => {
		  console.error('Error al obtener perfil:', error);
		  // Manejar el error, por ejemplo, mostrar un mensaje al usuario
		  this.isLoading = false;
		}
	  });
	}
}
