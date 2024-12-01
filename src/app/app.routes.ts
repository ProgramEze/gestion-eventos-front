import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegistroComponent } from './registro/registro.component';
import { AsistenteListComponent } from './asistentes/asistente-list/asistente-list.component';
import { LoginGuard } from './login.guard';
import { AsistenteEditComponent } from './asistentes/asistente-edit/asistente-edit.component';
import { PerfilComponent } from './perfil/perfil.component';
import { EventoListComponent } from './eventos/evento-list/evento-list.component';
import { EventoCreateComponent } from './eventos/evento-create/evento-create.component';
import { EventoEditComponent } from './eventos/evento-edit/evento-edit.component';
import { ParticipacionPorEventoListComponent } from './participaciones/participacion-por-evento-list/participacion-por-evento-list.component';

export const routes: Routes = [
	{ path: '', title: 'Página principal', component: HomeComponent },
	{
		path: 'login',
		title: 'Login',
		component: LoginComponent,
	},
	{ path: 'registrar', title: 'Registro', component: RegistroComponent },
	{
		path: 'perfil',
		title: 'Mi perfil',
		component: PerfilComponent,
		canActivate: [LoginGuard],
		data: { roles: ['Organizador', 'Asistente'] }, // Roles permitidos
	},
	{
		path: 'asistentes',
		title: 'Lista de asistentes',
		component: AsistenteListComponent,
		canActivate: [LoginGuard],
		data: { roles: ['Organizador'] },
	},
	{
		path: 'asistentes/:id',
		component: AsistenteEditComponent,
		canActivate: [LoginGuard],
		data: { roles: ['Organizador'] }, // Solo organizadores pueden editar asistentes
	},
	{
		path: 'eventos',
		component: EventoListComponent,
		canActivate: [LoginGuard],
		data: { roles: ['Organizador', 'Asistente'] },
	},
	{
		path: 'eventos/create',
		component: EventoCreateComponent,
		canActivate: [LoginGuard],
		data: { roles: ['Organizador'] },
	},
	{
		path: 'eventos/:id',
		component: EventoEditComponent,
		canActivate: [LoginGuard],
		data: { roles: ['Organizador'] },
	},
	{
		path: 'participaciones/evento/:id',
		component: ParticipacionPorEventoListComponent,
		canActivate: [LoginGuard],
		data: { roles: ['Organizador'] },
	},
	{ path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
	imports: [RouterModule.forChild(routes)], // Correcto para standalone components
	exports: [RouterModule],
})
export class AppRoutingModule {}
