import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ClienteService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { SideNavComponent } from '../../partials/side-nav/side-nav.component';
import { ParseJsonPipe } from '../../parse-json.pipe';
import { InfoClienteComponent } from '../modales/info-cliente/info-cliente.component';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { OAuthService } from 'angular-oauth2-oidc';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';

const MATERIAL_MODULES = [
  MatInputModule,
  MatPaginatorModule,
  MatSortModule,
  MatTableModule,
  MatFormFieldModule,
  MatDialogModule,
  MatButtonModule
];

@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [MATERIAL_MODULES, CommonModule, SideNavComponent, ParseJsonPipe],
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.scss'],
})
export class ListadoComponent implements OnInit, AfterViewInit {

  

  mostrarTabla: string | null = null;
  clientes: any[] = [];
  otrosDatos: any[] = [];
  jsonCompleto: any;

  // Columnas para la tabla de Persona Física
  displayedColumnsClientes: string[] = [
    'name', 'n_cliente', 'status', 'curp', 'nacionalidad',
    'genero_cl', 'fecha_nacimiento', 'ocupacion', 'calle',
    'ciudad', 'telefono', 'correo', 'completitud'
  ];

  // Columnas para la tabla de Persona Moral
  displayedColumnsOtrosDatos: string[] = [
    'razon_social', 'giro', 'nacionalidad', 'rfc', 'e_firma',
    'domicilio', 'telefono', 'correo', 'fecha_const', 'representante' ,'completitud'
    
  ];

  dataSourceClientes = new MatTableDataSource<any>();
  dataSourceClientesM = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private clienteService: ClienteService,
    private dialog: MatDialog,
  private oauthService: OAuthService,
      private httpClient: HttpClient,) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.dataSourceClientes.paginator = this.paginator;
    this.dataSourceClientes.sort = this.sort;
    this.dataSourceClientesM.paginator = this.paginator;
    this.dataSourceClientesM.sort = this.sort;
  }

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

  // Verifica si los campos requeridos no están vacíos
// Verifica si los campos requeridos no están vacíos
verificarCompletitud(cliente: any, tipo: string): boolean {
  let camposRequeridos: string[] = [];

  if (tipo === 'clientes') {
    camposRequeridos = [
      'name', 'n_cliente', 'status', 'curp', 'nacionalidad',
      'genero_cl', 'fecha_nacimiento', 'ocupacion', 'calle',
      'ciudad', 'telefono', 'correo'
    ];
  } else if (tipo === 'otrosDatos') {
    camposRequeridos = [
      'razon_social', 'giro', 'nacionalidad','rfc', 'e_firma',
      'domicilio', 'telefono', 'correo', 'fecha_const', 'representante'
    ];
  }

  // Verifica que todos los campos tengan un valor
  return camposRequeridos.every(campo => cliente[campo] !== null && cliente[campo] !== '');
}

mostrarInfo() {
    const dialogRef = this.dialog.open(InfoClienteComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.oauthService.logOut();
      }
    });
  }

}