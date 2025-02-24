// Importaciones necesarias de Angular y Material
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ClienteService } from '../../services/api.service'; // Servicio para obtener datos de clientes
import { CommonModule } from '@angular/common'; // Módulo común de Angular
import { MatPaginator } from '@angular/material/paginator'; // Componente para paginación de Material
import { MatSort } from '@angular/material/sort'; // Componente para ordenar tablas de Material
import { MatTableDataSource } from '@angular/material/table'; // Fuente de datos para las tablas de Material
import { MatFormFieldModule } from '@angular/material/form-field'; // Módulo de formulario de Material
import { MatTableModule } from '@angular/material/table'; 
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { SideNavComponent } from '../../partials/side-nav/side-nav.component'; // Componente de barra lateral
import { ParseJsonPipe } from '../../parse-json.pipe'; // Pipe personalizado para parsear JSON
import { InfoClienteComponent } from '../modales/info-cliente/info-cliente.component'; // Modal para mostrar información del cliente
import { MatDialog } from '@angular/material/dialog'; // Servicio para manejar diálogos de Material
import { MatDialogModule } from '@angular/material/dialog';
import { OAuthService } from 'angular-oauth2-oidc'; // Servicio de autenticación OAuth
import { HttpClient } from '@angular/common/http'; // Cliente HTTP para peticiones API
import { MatButtonModule } from '@angular/material/button';

// Agrupación de módulos de Material para facilitar la importación
const MATERIAL_MODULES = [
  MatInputModule,
  MatPaginatorModule,
  MatSortModule,
  MatTableModule,
  MatFormFieldModule,
  MatDialogModule,
  MatButtonModule
];

// Decorador del componente
@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [MATERIAL_MODULES, CommonModule, SideNavComponent, ParseJsonPipe],
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.scss'],
})
export class ListadoComponent implements OnInit, AfterViewInit {

  mostrarTabla: string | null = null; // Variable para determinar qué tabla mostrar
  clientes: any[] = []; // Almacena clientes de tipo Persona Física
  otrosDatos: any[] = []; // Almacena clientes de tipo Persona Moral
  jsonCompleto: any; // Guarda el JSON completo recibido

  // Definición de las columnas para la tabla de Persona Física
  displayedColumnsClientes: string[] = [
    'name', 'n_cliente', 'status', 'curp', 'nacionalidad',
    'genero_cl', 'fecha_nacimiento', 'ocupacion', 'calle',
    'ciudad', 'telefono', 'correo', 'completitud'
  ];

  // Definición de las columnas para la tabla de Persona Moral
  displayedColumnsOtrosDatos: string[] = [
    'razon_social', 'giro', 'nacionalidad', 'rfc', 'e_firma',
    'domicilio', 'telefono', 'correo', 'fecha_const', 'representante' ,'completitud'
  ];

  // Fuente de datos para las tablas de Persona Física y Persona Moral
  dataSourceClientes = new MatTableDataSource<any>();
  dataSourceClientesM = new MatTableDataSource<any>();

  // Referencias a los componentes de paginación y ordenación
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Inyección de dependencias en el constructor
  constructor(
    private clienteService: ClienteService,
    private dialog: MatDialog,
    private oauthService: OAuthService,
    private httpClient: HttpClient
  ) { }

  // Método del ciclo de vida de Angular, se ejecuta al iniciar el componente
  ngOnInit() { }

  // Método que se ejecuta después de que la vista se ha inicializado
  ngAfterViewInit() {
    this.dataSourceClientes.paginator = this.paginator;
    this.dataSourceClientes.sort = this.sort;
    this.dataSourceClientesM.paginator = this.paginator;
    this.dataSourceClientesM.sort = this.sort;
  }

  // Obtiene la lista de clientes Persona Física desde el servicio
  obtenerClientes() {
    this.clienteService.getClientesPerF().subscribe({
      next: (data) => {
        if (data[0] && typeof data[0].personaFisica === 'string') {
          const personaFisicaArray = JSON.parse(data[0].personaFisica);
          this.clientes = personaFisicaArray;
          console.log(personaFisicaArray);
          this.dataSourceClientes.data = this.clientes;
          this.jsonCompleto = data;
        } else {
          console.error('El campo personaFisica no es un string válido o no existe.');
        }
      },
      error: (error) => {
        console.error('Error al obtener clientes:', error);
      }
    });
  }

  // Obtiene la lista de clientes Persona Moral desde el servicio
  getClientesPerM() {
    this.clienteService.getClientesPerM().subscribe({
      next: (data) => {
        if (data[0] && typeof data[0].personaMoral === 'string') {
          const personaMoralArray = JSON.parse(data[0].personaMoral);
          this.otrosDatos = personaMoralArray;
          console.log(personaMoralArray);
          this.dataSourceClientesM.data = this.otrosDatos;
          this.jsonCompleto = data;
        } else {
          console.error('El campo personaMoral no es un string válido o no existe.');
        }
      },
      error: (error) => {
        console.error('Error al obtener clientes:', error);
      }
    });
  }

  // Filtra los resultados en la tabla según el tipo de cliente
  applyFilter(event: Event, tipo: string) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (tipo === 'clientes') {
      this.dataSourceClientes.filter = filterValue.trim().toLowerCase();
      if (this.dataSourceClientes.paginator) {
        this.dataSourceClientes.paginator.firstPage();
      }
    } else if (tipo === 'otrosDatos') {
      this.dataSourceClientesM.filter = filterValue.trim().toLowerCase();
      if (this.dataSourceClientesM.paginator) {
        this.dataSourceClientesM.paginator.firstPage();
      }
    }
  }

  // Maneja el evento para cambiar entre las tablas de clientes y otros datos
  manejarEvento(tipoCliente: string) {
    this.mostrarTabla = tipoCliente;
    if (tipoCliente === '1') {
      this.obtenerClientes();
      this.dataSourceClientesM = new MatTableDataSource<any>();
    }
    if (tipoCliente === '2') {
      this.getClientesPerM();
      this.dataSourceClientes = new MatTableDataSource<any>();
    }
  }

  // Verifica si los campos requeridos están completos para determinar la "completitud"
  verificarCompletitud(cliente: any, tipo: string): boolean {
    let camposRequeridos: string[] = [];
  
    if (tipo === 'clientes') {
      camposRequeridos = [
        'name', 'n_cliente', 'status', 'curp', 'nacionalidad',
        'genero_cl', 'fecha_nacimiento', 'ocupacion', 'calle',
        'ciudad', 'telefono', 'correo', 'agendacl'
      ];
    } else if (tipo === 'otrosDatos') {
      camposRequeridos = [
        'razon_social', 'giro', 'nacionalidad', 'rfc', 'e_firma',
        'domicilio', 'telefono', 'correo', 'fecha_const', 'representante'
      ];
    }
  
    return camposRequeridos.every(campo => {
      let valor = cliente[campo];
  
      if (campo === 'agendacl' && typeof valor === 'string') {
        try {
          const agendaArray = JSON.parse(valor);
          return agendaArray.every((item: any) => 
            item.telefono !== null && item.correo !== null
          ); 
        } catch (error) {
          console.error("Error al parsear agendacl:", error);
          return false;
        }
      }
  
      return valor !== null && valor !== '' && valor !== 'null';
    });
  }

  // Muestra un modal con información del cliente
  mostrarInfo() {
    const dialogRef = this.dialog.open(InfoClienteComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.oauthService.logOut();
      }
    });
  }
}
