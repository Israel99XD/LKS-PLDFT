import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu'; // Importación del MatMenuModule
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { subscribeOn } from 'rxjs';
import { LogoutComponent } from '../logout/logout.component';

const MATERIAL_MODULE = [
  MatIconModule,
  MatToolbarModule,
  MatButtonModule,
  MatMenuModule,
  RouterModule,
  MatBadgeModule,
  MatDialogModule,
];

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MATERIAL_MODULE],
  template: `
    <mat-toolbar color="accent">
      <img src="LOGO-PLD.png" alt="Logo PLD/FT" class="logonav" />

      <!-- Íconos a la izquierda -->
      <div class="nav-links-left">
        <a mat-button routerLink="/"><mat-icon>home</mat-icon></a>
        <a mat-button routerLink="/list"><mat-icon>local_library</mat-icon></a>
        <a mat-button routerLink="/"><mat-icon>person</mat-icon></a>
        <a mat-button routerLink="/operations"><mat-icon>settings</mat-icon></a>
        <a mat-button routerLink="/alerts"></a>
      </div>

      <!-- Espaciador para separar los íconos -->
      <span class="spacer"></span>

      <!-- Íconos a la derecha -->
      <div class="nav-links-right">
        <a mat-button routerLink="/alerts"
          ><mat-icon>notifications_none</mat-icon></a
        >
        <a mat-button (click)="logout()"> <mat-icon>exit_to_app</mat-icon></a>
      </div>

      <!-- Botón de menú hamburguesa para pantallas pequeñas -->
      <button
        mat-icon-button
        [matMenuTriggerFor]="menu"
        class="mobile-menu-button"
      >
        <mat-icon>menu</mat-icon>
      </button>
    </mat-toolbar>

    <!-- Menú desplegable -->
    <mat-menu #menu="matMenu">
      <button mat-menu-item routerLink="/">
        <mat-icon>home</mat-icon> Home
      </button>
      <button mat-menu-item routerLink="/list">
        <mat-icon>local_library</mat-icon> Users
      </button>
      <button mat-menu-item routerLink="/">
        <mat-icon>person</mat-icon> Profile
      </button>
      <button mat-menu-item routerLink="/">
        <mat-icon>lock</mat-icon> Security
      </button>
      <button mat-menu-item routerLink="/operations">
        <mat-icon>settings</mat-icon> Settings
      </button>
      <button mat-menu-item routerLink="/alerts">
        <mat-icon>notifications_none</mat-icon> Alerts
      </button>
      <button mat-menu-item (click)="logout()">
        <mat-icon>exit_to_app</mat-icon> Logout
      </button>
    </mat-menu>
  `,
  styles: `
    mat-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
    }

    .logonav {
      width: 75px;
      margin-right: 10px;
    }

    a[mat-button] {
      display: flex;
      align-items: center;
      margin: 5px;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .nav-links-left, .nav-links-right {
      display: flex;
      align-items: center;
    }

    .mobile-menu-button {
      display: none;
    }

    @media (max-width: 768px) {
      .logonav {
        width: 60px;
      }

      .nav-links-left, .nav-links-right {
        display: none;
      }

      .mobile-menu-button {
        display: inline-flex;
        margin-left: auto; /* Empuja el botón a la derecha */
      }
    }
  `,
})
export class ToolbarComponent /* implements OnInit */ {
  constructor(
    private oauthService: OAuthService,
    private httpClient: HttpClient,
    private dialog: MatDialog
  ) {}

  logout() {
    const dialogRef = this.dialog.open(LogoutComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.oauthService.logOut();
      }
    });
  }
}