import { Routes, RouterModule } from '@angular/router';
import { ListadoComponent } from './components/listado/listado.component';
import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent, title: 'Home', canActivate: [AuthGuard] }, // Ruta para la página de inicio, accesible en el root ('').
    { path: 'list', component: ListadoComponent, title: 'List', canActivate: [AuthGuard] } // Ruta para mostrar las tablas de los clientes
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }