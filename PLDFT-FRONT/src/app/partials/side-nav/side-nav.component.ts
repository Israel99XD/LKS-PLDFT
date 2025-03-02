import { Component, EventEmitter, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [
    MatDividerModule,
    MatListModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardTitle,
    MatCardSubtitle,
  ],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
})
export class SideNavComponent {
  @Output() infoSeleccionada = new EventEmitter<string>();

  readonly panelOpenState = signal(false);

  totalClientesFisicos: number = 0;
  totalClientesMorales: number = 0;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.contarClientesFisicos();
    this.contarClientesMorales();
  }

  contarClientesFisicos() {
    const codigo = '0';
    const perfil = '268';

    this.apiService.getClienteData(codigo, perfil).subscribe({
      next: (data) => {
        if (data[0] && typeof data[0].personaFisica === 'string') {
          const personaFisicaArray = JSON.parse(data[0].personaFisica);
          this.totalClientesFisicos = personaFisicaArray.length;
        } else {
          console.error(
            'El campo personaFisica no es un string válido o no existe.'
          );
        }
      },
      error: (error) => {
        console.error('Error al contar clientes físicos:', error);
      },
    });
  }

  contarClientesMorales() {
    const codigo = '0';
    const perfil = '269';

    this.apiService.getClientesM(codigo, perfil).subscribe({
      next: (data) => {
        if (data[0] && typeof data[0].personaMoral === 'string') {
          const personaMoralArray = JSON.parse(data[0].personaMoral);
          this.totalClientesMorales = personaMoralArray.length;
        } else {
          console.error(
            'El campo personaMoral no es un string válido o no existe.'
          );
        }
      },
      error: (error) => {
        console.error('Error al contar clientes morales:', error);
      },
    });
  }

  obtenerinfo(tipo: string) {
    this.infoSeleccionada.emit(tipo);
  }
}
