package com.example.booksapi.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import com.example.booksapi.model.Book;
import com.example.booksapi.service.BookService;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class BookController {

    private final BookService service;

    public BookController(BookService service) {
        this.service = service;
    }

    /**
     * ✅ LISTADO BASE: Responde a http://localhost:8081/api/books
     * Devuelve el catálogo completo con soporte de paginación.
     */
    @GetMapping
    public Page<Book> getAll(Pageable pageable) {
        return service.search("", 0, pageable);
    }

    @PostMapping
    public Book create(@RequestBody Book book) {
        return service.save(book);
    }

    @PutMapping("/{id}")
    public Book update(@PathVariable Long id, @RequestBody Book book) {
        return service.update(id, book);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    /**
     * ✅ BÚSQUEDA FILTRADA: Mapea 'title' al término general (Título/Código).
     */
    @GetMapping("/search")
    public Page<Book> search(
            @RequestParam(name = "title", defaultValue = "") String term,
            @RequestParam(name = "minPages", defaultValue = "0") int minPages,
            Pageable pageable
    ) {
        return service.search(term, minPages, pageable);
    }
}
