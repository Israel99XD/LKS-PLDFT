// Importaciones necesarias de Angular y Material
import { CommonModule } from '@angular/common'; // Módulo común de Angular
import { HttpClient } from '@angular/common/http'; // Cliente HTTP para peticiones API
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // Servicio para manejar diálogos de Material
import { MatFormFieldModule } from '@angular/material/form-field'; // Módulo de formulario de Material
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'; // Componente para paginación de Material
import { MatSort, MatSortModule } from '@angular/material/sort'; // Componente para ordenar tablas de Material
import { MatTableDataSource, MatTableModule } from '@angular/material/table'; // Fuente de datos para las tablas de Material
import { OAuthService } from 'angular-oauth2-oidc'; // Servicio de autenticación OAuth
import { ParseJsonPipe } from '../../parse-json.pipe'; // Pipe personalizado para parsear JSON
import { SideNavComponent } from '../../partials/side-nav/side-nav.component'; // Componente de barra lateral
import { ApiService } from '../../services/api.service'; // Servicio para obtener datos de clientes
import { InfoClienteComponent } from '../modales/info-cliente/info-cliente.component'; // Modal para mostrar información del cliente
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


// Agrupación de módulos de Material para facilitar la importación
const MATERIAL_MODULES = [
  MatInputModule,
  MatPaginatorModule,
  MatSortModule,
  MatTableModule,
  MatFormFieldModule,
  MatDialogModule,
  MatButtonModule,
  MatProgressSpinnerModule
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
  movimientos: any[] = [];
  jsonCompleto: any; // Guarda el JSON completo recibido
  cargando: boolean = false;

  // Definición de las columnas para la tabla de Persona Física
  displayedColumnsClientes: string[] = [
    'name',
    'n_cliente',
    'status',
    'curp',
    'nacionalidad',
    'genero_cl',
    'fecha_nacimiento',
    'ocupacion',
    'calle',
    'ciudad',
    'telefono',
    'correo',
    'completitud',
  ];

  // Definición de las columnas para la tabla de Persona Moral
  displayedColumnsOtrosDatos: string[] = [
    'razon_social',
    'giro',
    'nacionalidad',
    'rfc',
    'e_firma',
    'domicilio',
    'telefono',
    'correo',
    'fecha_const',
    'representante',
    'completitud',
  ];

  displayedColumnsMovimientos: string[] = [
    'movimientoID',
    'cveMovimiento',
    'descMovimiento',
    'saldo'
  ];

  // Fuente de datos para las tablas de Persona Física y Persona Moral
  dataSourceClientes = new MatTableDataSource<any>();
  dataSourceClientesM = new MatTableDataSource<any>();
  dataSourceMovimientos = new MatTableDataSource<any>();

  // Referencias a los componentes de paginación y ordenación
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Inyección de dependencias en el constructor
  constructor(
    private clienteService: ApiService,
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
    this.dataSourceMovimientos.paginator = this.paginator;
    this.dataSourceMovimientos.sort = this.sort;
  }

  // Obtiene la lista de clientes Persona Física desde el servicio
  obtenerClientes() {
    this.cargando = true; // Activar spinner

    // Ejemplo: Obtener codigo y perfil con espacio incluido
    const codigo = '0';
    const perfil = '268';

    // Llamada a la API pasando los parámetros
    this.clienteService.getClienteData(codigo, perfil).subscribe({
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
        this.cargando = false; // Desactivar spinner
      },
      error: (error) => {
        console.error('Error al obtener clientes:', error);
        this.cargando = false; // Desactivar spinner en caso de error
      },
    });
  }


  // Obtiene la lista de clientes Persona Moral desde el servicio
  getClientesPerM() {

    this.cargando = true; // Activar spinner
    // Ejemplo: Obtener codigo y perfil con espacio incluido
    const codigo = '0';
    const perfil = '269';

    this.clienteService.getClientesM(codigo, perfil).subscribe({
      next: (data) => {
        if (data[0] && typeof data[0].personaMoral === 'string') {
          const personaMoralArray = JSON.parse(data[0].personaMoral);
          this.otrosDatos = personaMoralArray;
          console.log(personaMoralArray);
          this.dataSourceClientesM.data = this.otrosDatos;
          this.jsonCompleto = data;
        } else {
          console.error(
            'El campo personaMoral no es un string válido o no existe.');
        }
        this.cargando = false; // Desactivar spinner
      },
      error: (error) => {
        console.error('Error al obtener clientes:', error);
        this.cargando = false; // Desactivar spinner en caso de error
      },
    });
  }

  getMovimientos() {
    this.cargando = true; // Activar spinner
    this.clienteService.getMovimientos().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          // Verifica si `data` es un array
          this.movimientos = data; // Asigna directamente los movimientos
          console.log('Movimientos obtenidos:', this.movimientos);
          this.dataSourceMovimientos.data = this.movimientos; // Actualiza la tabla
        } else {
          console.error('La respuesta de la API no es un array válido:', data);
        }
        this.cargando = false; // Desactivar spinner
      },
      error: (error) => {
        console.error('Error al obtener movimientos:', error);
        this.cargando = false; // Desactivar spinner
      },
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
    } else if (tipo === 'movimientos') {
      this.dataSourceMovimientos.filter = filterValue.trim().toLowerCase();
      if (this.dataSourceMovimientos.paginator) {
        this.dataSourceMovimientos.paginator.firstPage();
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

    if (tipoCliente === '3') {
      this.getMovimientos();
      this.dataSourceMovimientos = new MatTableDataSource<any>();
    }
  }

  // Verifica si los campos requeridos están completos para determinar la "completitud"
  verificarCompletitud(cliente: any, tipo: string): boolean {
    let camposRequeridos: string[] = [];

    if (tipo === 'clientes') {
      camposRequeridos = [
        'name',
        'n_cliente',
        'status',
        'curp',
        'nacionalidad',
        'genero_cl',
        'fecha_nacimiento',
        'ocupacion',
        'calle',
        'ciudad',
        'telefono',
        'correo',
        'agendacl',
      ];
    } else if (tipo === 'otrosDatos') {
      camposRequeridos = [
        'razon_social',
        'giro',
        'nacionalidad',
        'rfc',
        'e_firma',
        'domicilio',
        'telefono',
        'correo',
        'fecha_const',
        'representante',
      ];
    } else if (tipo === 'movimientos') {
      camposRequeridos = [
        'movimientoID',
        'cveMovimiento',
        'descMovimiento',
        'saldo',
      ];
    }

    return camposRequeridos.every((campo) => {
      let valor = cliente[campo];

      if (campo === 'agendacl' && typeof valor === 'string') {
        try {
          const agendaArray = JSON.parse(valor);
          return agendaArray.every(
            (item: any) => item.telefono !== null && item.correo !== null
          );
        } catch (error) {
          console.error('Error al parsear agendacl:', error);
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
