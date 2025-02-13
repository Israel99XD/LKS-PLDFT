// Se importan las dependencias necesarias para el componente
import { Component } from '@angular/core';  // Para definir un componente en Angular
import { RouterOutlet } from '@angular/router';  // Para utilizar el enrutamiento dentro del componente
import { OAuthService } from 'angular-oauth2-oidc';  // Servicio para manejar la autenticación OAuth
import { CommonModule } from '@angular/common';  // Módulo común de Angular
import { HttpClient } from '@angular/common/http';  // Cliente HTTP para hacer solicitudes
import { ToolbarComponent } from './partials/toolbar/toolbar.component';  // Componente de la barra de herramientas
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';  // Módulo para el spinner de progreso de Material

// Se definen los módulos de Material que se usarán en el componente
const MATERIAL_MODULES = [
  MatProgressSpinnerModule  // Módulo para el spinner de carga de Angular Material
]

// Definición del componente principal de la aplicación
@Component({
  selector: 'app-root',  // Nombre del selector para el componente
  standalone: true,  // Define que el componente es independiente, sin necesidad de importar módulos adicionales
  imports: [
    RouterOutlet,  // Permite utilizar el enrutamiento en el componente
    CommonModule,  // Importa el módulo común de Angular
    ToolbarComponent,  // Importa el componente de la barra de herramientas
    MATERIAL_MODULES  // Importa los módulos de Material definidos anteriormente
  ],
  templateUrl: './app.component.html',  // URL de la plantilla HTML
  styleUrl: './app.component.scss'  // URL del archivo de estilo SCSS
})
export class AppComponent {
  helloText = '';  // Variable para almacenar el mensaje que se obtiene del servidor

  // Inyección de dependencias en el constructor
  constructor(private oauthService: OAuthService, private httpClient: HttpClient) {}

  // Método para cerrar sesión
  logout() {
    this.oauthService.logOut();  // Llama al servicio OAuth para cerrar sesión
  }

  /*
  // Método comentado para obtener un mensaje desde el servidor
  getHelloText() {
    this.httpClient.get<{message: string}>('http://localhost:8080/hello', { 
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`  // Se incluye el token de acceso en el encabezado
      }
    }).subscribe(result => {  // Se suscribe a la respuesta de la solicitud HTTP
      this.helloText = result.message;  // Asigna el mensaje recibido al atributo helloText
    });
  }
  */
}
