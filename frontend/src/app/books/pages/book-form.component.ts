import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  templateUrl: './book-form.component.html'
})
export class BookFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(BookService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<BookFormComponent>);
  public data = inject(MAT_DIALOG_DATA);

  bookForm!: FormGroup;
  isEditMode = false;

  ngOnInit(): void {
    this.isEditMode = !!this.data;

    this.bookForm = this.fb.group({
      // Identificadores y Datos de Inventario
      code: ['', [Validators.required]], // Nuevo Campo
      title: ['', [Validators.required, Validators.minLength(3)]],
      pageCount: [1, [Validators.required, Validators.min(1)]],
      quantity: [1, [Validators.required, Validators.min(0)]], // Nuevo Campo
      description: ['', [Validators.required]],
      authors: this.fb.array([]) 
    });

    if (this.isEditMode) {
      this.patchFormData();
    } else {
      this.addAuthor(); 
    }
  }

  get authorsFormArray(): FormArray {
    return this.bookForm.get('authors') as FormArray;
  }

  createAuthorGroup(firstName = '', lastName = ''): FormGroup {
    return this.fb.group({
      firstName: [firstName, Validators.required],
      lastName: [lastName, Validators.required]
    });
  }

  addAuthor(): void {
    this.authorsFormArray.push(this.createAuthorGroup());
  }

  removeAuthor(index: number): void {
    if (this.authorsFormArray.length > 1) {
      this.authorsFormArray.removeAt(index);
    }
  }

  private patchFormData(): void {
    this.authorsFormArray.clear();
    if (this.data.authors && this.data.authors.length > 0) {
      this.data.authors.forEach((auth: any) => {
        this.authorsFormArray.push(this.createAuthorGroup(auth.firstName, auth.lastName));
      });
    } else {
      this.addAuthor();
    }

    this.bookForm.patchValue({
      code: this.data.code, // Parcheo de Código
      title: this.data.title,
      pageCount: this.data.pageCount,
      quantity: this.data.quantity, // Parcheo de Cantidad
      description: this.data.description
    });
  }

  save(): void {
    if (this.bookForm.invalid) {
      this.snackBar.open('Formulario inválido. Verifique los campos corporativos.', 'Cerrar', { duration: 2500 });
      this.bookForm.markAllAsTouched();
      return;
    }

    const bookPayload = {
      ...this.bookForm.value,
      pageCount: Number(this.bookForm.value.pageCount),
      quantity: Number(this.bookForm.value.quantity) // Asegurar tipo numérico
    };

    const request$ = this.isEditMode 
      ? this.service.update(this.data.id, bookPayload) 
      : this.service.create(bookPayload);

    request$.subscribe({
      next: () => {
        this.snackBar.open('Transacción exitosa: Registro actualizado en el sistema.', 'OK', { duration: 2000 });
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error de persistencia:', err);
        this.snackBar.open('Error: El código de libro ya existe o el servidor no responde.', 'Reintentar', { 
          duration: 4000 
        });
      }
    });
  }
}
