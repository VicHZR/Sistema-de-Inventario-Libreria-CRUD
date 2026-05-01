package com.example.booksapi.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.booksapi.model.Book;
import com.example.booksapi.repository.BookRepository;

/**
 * Servicio Central de Activos Bibliográficos.
 * Gestiona la lógica de persistencia, inventario y relaciones dinámicas.
 */
@Service
public class BookService {

    private final BookRepository repository;

    /**
     * Inyección por constructor del repositorio de datos.
     */
    public BookService(BookRepository repository) {
        this.repository = repository;
    }

    /**
     * ✅ BÚSQUEDA INTEGRAL CORPORATIVA
     * Filtra activos por término (Título o Código) y extensión mínima.
     * Implementa el método especializado searchAssets del repositorio.
     */
    public Page<Book> search(String term, int minPages, Pageable pageable) {
        return repository.searchAssets(
                term,
                minPages,
                pageable
        );
    }

    /**
     * ✅ GUARDAR NUEVO REGISTRO
     * Persiste un activo bibliográfico con su colección de autores.
     */
    @Transactional
    public Book save(Book book) {
        return repository.save(book);
    }

    /**
     * ✅ ACTUALIZAR REGISTRO INTEGRAL
     * Sincroniza campos técnicos, stock y la lista dinámica de autores.
     */
    @Transactional
    public Book update(Long id, Book bookDetails) {
        return repository.findById(id).map(book -> {
            // Sincronización de identificadores y datos de volumen
            book.setCode(bookDetails.getCode());
            book.setTitle(bookDetails.getTitle());
            book.setPageCount(bookDetails.getPageCount());
            book.setDescription(bookDetails.getDescription());
            book.setQuantity(bookDetails.getQuantity());
            
            // Gestión de la colección transaccional de autores
            if (bookDetails.getAuthors() != null) {
                book.getAuthors().clear();
                book.getAuthors().addAll(bookDetails.getAuthors());
            }
            
            return repository.save(book);
        }).orElseThrow(() -> new RuntimeException("Error: El activo con ID " + id + " no existe."));
    }

    /**
     * ✅ ELIMINAR REGISTRO DEL SISTEMA
     * Realiza la baja física del activo validando su existencia previa.
     */
    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("No se puede eliminar: El identificador es inexistente.");
        }
        repository.deleteById(id);
    }

}
