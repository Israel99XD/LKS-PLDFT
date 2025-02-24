// Se importan las dependencias necesarias de Angular para la creación del servicio
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Se marca la clase como un servicio inyectable para que Angular la administre
@Injectable({
  providedIn: 'root'  // Esto hace que el servicio esté disponible globalmente en la aplicación
})
export class ClienteService {
  // Se definen las URLs base y específicas para los clientes
  private baseUrl = 'http://122.8.186.221:7582';  // Dirección base del servidor
  private urlClientesF = `${this.baseUrl}/clientes/spsClientesFM/TIJ-0000001/268`;  // URL para obtener clientes del perfil F
  private urlClientesM = `${this.baseUrl}/clientes/spsClientesFM/TIJ-0000003-MR/269`;  // URL para obtener clientes del perfil M

  // Se inyecta HttpClient para hacer solicitudes HTTP
  constructor(private http: HttpClient) { }

  // Método para obtener los clientes del perfil F
  getClientesPerF(): Observable<any> {
    // Se obtiene el token de autenticación almacenado en el localStorage
    const token = localStorage.getItem('token');
    // Se crea un objeto de cabeceras para la solicitud, con el token de autenticación
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`  // Se agrega el token al encabezado de autorización
    });
    // Se hace una solicitud GET a la URL para obtener los clientes del perfil F
    return this.http.get(this.urlClientesF, { headers });
  }

  // Método para obtener los clientes del perfil M
  getClientesPerM(): Observable<any> {
    // Se obtiene el token de autenticación almacenado en el localStorage
    const token = localStorage.getItem('token');
    // Se crea un objeto de cabeceras para la solicitud, con el token de autenticación
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`  // Se agrega el token al encabezado de autorización
    });
    // Se hace una solicitud GET a la URL para obtener los clientes del perfil M
    return this.http.get(this.urlClientesM, { headers });
  }
}
