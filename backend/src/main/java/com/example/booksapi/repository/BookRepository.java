package com.example.booksapi.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.booksapi.model.Book;

public interface BookRepository extends JpaRepository<Book, Long> {

    /**
     * Búsqueda avanzada híbrida: Filtra por coincidencia en Título O Código,
     * garantizando compatibilidad con valores nulos y filtrado por páginas.
     */
    @Query("SELECT b FROM Book b WHERE " +
           "(LOWER(b.title) LIKE LOWER(CONCAT('%', :term, '%')) OR " +
           "(b.code IS NOT NULL AND LOWER(b.code) LIKE LOWER(CONCAT('%', :term, '%')))) AND " +
           "b.pageCount >= :minPages")
    Page<Book> searchAssets(
            @Param("term") String term,
            @Param("minPages") int minPages,
            Pageable pageable
    );
}
