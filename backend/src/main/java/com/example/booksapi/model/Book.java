package com.example.booksapi.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidad de Negocio: Book
 * Representa un activo bibliográfico dentro del sistema central.
 * Incluye gestión de inventario y relación dinámica con autores.
 *  
 */
@Entity
@Table(name = "book")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Identificador institucional único (SKU / ISBN).
     * Se establece como nullable = true para permitir la transición
     * de datos sin colisiones en el sistema de base de datos.
     */
    @Column(unique = true, nullable = true) 
    private String code;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(name = "page_count")
    private int pageCount;

    /**
     * Control de existencias físicas en el inventario institucional.
     * Inicializado en 0 para garantizar consistencia en cálculos.
     */
    private int quantity = 0; 

    /**
     * Relación bidireccional con la entidad Author.
     * Se utiliza 'mappedBy' para delegar la gestión de la llave foránea
     * al objeto Author, solucionando errores de persistencia
     */
    @OneToMany(
        mappedBy = "book",
        cascade = CascadeType.ALL, 
        orphanRemoval = true, 
        fetch = FetchType.LAZY
    )
    private List<Author> authors = new ArrayList<>();

    // Constructor estándar requerido por la especificación JPA
    public Book() {}

    // --- FUNCIONALIDAD DE APOYO ---

    /**
     * Método de conveniencia para asegurar la integridad bidireccional.
     * Vincula el autor con el libro actual antes de la persistencia.
     */
    public void addAuthor(Author author) {
        authors.add(author);
        author.setBook(this);
    }

    /**
     * Representación textual para auditoría técnica en consola.
     */
    @Override
    public String toString() {
        return "Book [ID=" + id + 
               ", Código=" + (code != null ? code : "PENDIENTE") + 
               ", Título=" + title + 
               ", Stock=" + quantity + "]";
    }

    // --- MÉTODOS DE ACCESO (GETTERS Y SETTERS) ---

    public Long getId() { 
        return id; 
    }
    
    public void setId(Long id) { 
        this.id = id; 
    }

    public String getCode() { 
        return code; 
    }
    
    public void setCode(String code) { 
        this.code = code; 
    }

    public String getTitle() { 
        return title; 
    }
    
    public void setTitle(String title) { 
        this.title = title; 
    }

    public String getDescription() { 
        return description; 
    }
    
    public void setDescription(String description) { 
        this.description = description; 
    }

    public int getPageCount() { 
        return pageCount; 
    }
    
    public void setPageCount(int pageCount) { 
        this.pageCount = pageCount; 
    }

    public int getQuantity() { 
        return quantity; 
    }
    
    public void setQuantity(int quantity) { 
        this.quantity = quantity; 
    }

    public List<Author> getAuthors() { 
        return authors; 
    }
    
    public void setAuthors(List<Author> authors) {
        this.authors = authors;
        if (authors != null) {
            for (Author author : authors) {
                author.setBook(this);
            }
        }
    }
}
