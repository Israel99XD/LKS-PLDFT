import { Component, signal, EventEmitter, Output } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [
    MatDividerModule,
    MatListModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent {

  @Output() infoSeleccionada = new EventEmitter<string>();

  readonly panelOpenState = signal(false);
  
  obtenerinfo(tipo: string) {
    this.infoSeleccionada.emit(tipo); // Emite el valor al padre
  }

}
