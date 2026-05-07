package com.example.booksapi.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "book")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = true) 
    private String code;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(name = "page_count")
    private int pageCount;

    private int quantity = 0; 

    @OneToMany(
        mappedBy = "book",
        cascade = CascadeType.ALL, 
        orphanRemoval = true, 
        fetch = FetchType.LAZY
    )
    private List<Author> authors = new ArrayList<>();

    public Book() {}


    public void addAuthor(Author author) {
        if (author != null) {
            authors.add(author);
            author.setBook(this);
        }
    }

    public void removeAuthor(Author author) {
        authors.remove(author);
        author.setBook(null);
    }

    @Override
    public String toString() {
        return "Book [ID=" + id + 
               ", Código=" + (code != null ? code : "PENDIENTE") + 
               ", Título=" + title + 
               ", Stock=" + quantity + "]";
    }

    // Getters y Setters
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
       
        this.authors.clear();
        if (authors != null) {
            for (Author author : authors) {
                this.addAuthor(author);
            }
        }
    }
}
