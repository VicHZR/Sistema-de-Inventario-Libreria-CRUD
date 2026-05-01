import { Injectable, signal, computed } from '@angular/core';
import { User, UserRole } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Signal que guarda el usuario actual
  currentUser = signal<User | null>(null);

  // Computed signals para verificar roles rápidamente
  isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');
  isVisitor = computed(() => this.currentUser()?.role === 'VISITOR');
  isAuthenticated = computed(() => this.currentUser() !== null);

  login(role: UserRole) {
    // Simulación de login bancario
    const mockUser: User = {
      username: role === 'ADMIN' ? 'Administrador Central' : 'Visitante Externo',
      role: role
    };
    this.currentUser.set(mockUser);
  }

  logout() {
    this.currentUser.set(null);
  }
}
