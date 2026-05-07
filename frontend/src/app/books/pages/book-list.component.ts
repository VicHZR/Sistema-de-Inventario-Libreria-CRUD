import { Component, inject, signal, computed, TemplateRef, ViewChild } from '@angular/core';
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
  // --- INYECCIÓN DE DEPENDENCIAS ---
  private service = inject(BookService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  public authService = inject(AuthService);

  // Referencia al template del diálogo de confirmación en el HTML
  @ViewChild('confirmDialog') confirmDialog!: TemplateRef<any>;

  // --- ESTADOS REACTIVOS ---
  books = signal<any[]>([]);
  isLoading = signal(false);
  isDarkMode = signal(false);

  // --- MODELOS DE FILTRADO ---
  title = '';
  minPages = 0;

  displayedColumns = computed(() => {
    const baseColumns = ['code', 'title', 'authors', 'pageCount', 'quantity', 'description'];
    return this.authService.isAdmin()
      ? [...baseColumns, 'actions']
      : baseColumns;
  });

  constructor() {
    this.loadAllBooks();
  }

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
        error: () => {
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
        error: () => this.isLoading.set(false)
      });
  }

  clearFilters(): void {
    this.title = '';
    this.minPages = 0;
    this.loadAllBooks();
  }

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
   * ELIMINACIÓN DE REGISTROS CON DIÁLOGO DE ANGULAR MATERIAL
   */
  delete(id: number): void {
    if (!this.authService.isAdmin()) return;

    if (!id) {
      this.snackBar.open('Error: El identificador del registro no es válido.', 'Cerrar');
      return;
    }

    // Abrimos el diálogo usando el Template del HTML
    const dialogRef = this.dialog.open(this.confirmDialog, {
      width: '400px',
      panelClass: 'banking-dialog-class'
    });

    dialogRef.afterClosed().subscribe(result => {
      // result será 'true' solo si presionan "Aceptar"
      if (result === true) {
        this.service.delete(id).subscribe({
          next: () => {
            this.snackBar.open('Registro eliminado exitosamente.', 'OK', { duration: 2500 });
            this.loadAllBooks();
          },
          error: (err) => {
            console.error('Fallo en eliminación:', err);
            this.snackBar.open('Error: El activo no puede borrarse por dependencias.', 'Cerrar', {
              duration: 5000
            });
          }
        });
      }
    });
  }
}
