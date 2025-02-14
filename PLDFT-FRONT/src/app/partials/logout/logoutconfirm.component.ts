import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-logout-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Confirmación</h2>
    <mat-dialog-content
      >¿Estás seguro de que deseas cerrar sesión?</mat-dialog-content
    >
    <mat-dialog-actions align="end">
      <button mat-button (click)="close(false)">Cancelar</button>
      <button mat-button color="warn" (click)="close(true)">
        Cerrar sesión
      </button>
    </mat-dialog-actions>
  `,
})
export class LogoutConfirmDialogComponent {
  constructor(private dialogRef: MatDialogRef<LogoutConfirmDialogComponent>) {}

  close(result: boolean) {
    this.dialogRef.close(result);
  }
}
