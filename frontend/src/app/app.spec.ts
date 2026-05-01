import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app'; // 1. Cambiado App por AppComponent
import { provideRouter } from '@angular/router';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])] // Necesario si usas router-outlet
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    // 2. Ajustado para buscar el texto que pusimos en el nuevo app.html
    expect(compiled.querySelector('strong')?.textContent).toContain('Sistema de Libros');
  });
});
