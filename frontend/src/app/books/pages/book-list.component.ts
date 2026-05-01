import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { BookService } from '../../services/book.service';
import { AuthService } from '../../services/auth.service';
import { BookFormComponent } from './book-form.component';

@Component({
  standalone: true,
  selector: 'app-book-list',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent {
  // --- INYECCIÓN DE DEPENDENCIAS DE ALTA DISPONIBILIDAD ---
  private service = inject(BookService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  public authService = inject(AuthService);

  // --- ESTADOS REACTIVOS (ANGULAR 21 SIGNALS) ---
  books = signal<any[]>([]);
  isLoading = signal(false);
  isDarkMode = signal(false);

  // --- MODELOS DE FILTRADO CORPORATIVO ---
  title = '';
  minPages = 0;
  
  // Lógica de privilegios: Se incluyen 'code' y 'quantity' al catálogo maestro
  displayedColumns = computed(() => {
    const baseColumns = ['code', 'title', 'authors', 'pageCount', 'quantity', 'description'];
    return this.authService.isAdmin() 
      ? [...baseColumns, 'actions'] 
      : baseColumns;
  });

  constructor() {
    this.loadAllBooks();
  }

  /**
   * Validación estricta para habilitar la ejecución del filtro
   */
  canSearch(): boolean {
    const hasTitle = this.title && this.title.trim().length > 0;
    const hasPages = this.minPages !== null && this.minPages > 0;
    return (hasTitle || hasPages) && !this.isLoading();
  }

  search(): void {
    if (!this.canSearch()) return;

    this.isLoading.set(true);
    this.service.search(this.title.trim(), this.minPages, 0, 20, 'title,asc')
      .subscribe({
        next: (res: any) => {
          this.books.set(res.content || []);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Fallo en búsqueda corporativa:', err);
          this.isLoading.set(false);
          this.books.set([]);
        }
      });
  }

  loadAllBooks(): void {
    this.isLoading.set(true);
    this.service.search('', 0, 0, 20, 'title,asc')
      .subscribe({
        next: (res: any) => {
          this.books.set(res.content || []);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error al sincronizar catálogo institucional:', err);
          this.isLoading.set(false);
        }
      });
  }

  clearFilters(): void {
    this.title = '';
    this.minPages = 0;
    this.loadAllBooks();
  }

  /**
   * Alternar Modo Oscuro / Claro con persistencia de clase en el body
   */
  toggleTheme(): void {
    this.isDarkMode.update(v => !v);
    document.body.classList.toggle('dark-theme');
  }

  openForm(book?: any): void {
    if (!this.authService.isAdmin()) return;

    this.dialog.open(BookFormComponent, {
      width: '750px', 
      data: book ?? null,
      panelClass: 'banking-dialog-class'
    }).afterClosed().subscribe(ok => {
      if (ok) this.loadAllBooks();
    });
  }

  /**
   * ELIMINACIÓN DE REGISTROS CON MANEJO DE INTEGRIDAD REFERENCIAL
   */
  delete(id: number): void {
    if (!this.authService.isAdmin()) return;

    if (!id) {
      this.snackBar.open('Error: El identificador del registro no es válido.', 'Cerrar');
      return;
    }

    if (confirm('¿Desea eliminar este registro del sistema de activos bancarios?')) {
      this.service.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Registro eliminado del inventario exitosamente.', 'OK', { duration: 2500 });
          this.loadAllBooks();
        },
        error: (err) => {
          console.error('Transacción de eliminación fallida:', err);
          this.snackBar.open('Error: El activo no puede borrarse por dependencias externas.', 'Entendido', {
            duration: 5000,
            panelClass: ['banking-error-snackbar']
          });
        }
      });
    }
  }
}
