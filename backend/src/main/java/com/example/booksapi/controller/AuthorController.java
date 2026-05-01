package com.example.booksapi.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.example.booksapi.model.Author;
import com.example.booksapi.service.AuthorService;

@RestController
@RequestMapping("/api/authors")
@CrossOrigin(origins = "*")
public class AuthorController {

    private final AuthorService service;

    public AuthorController(AuthorService service) {
        this.service = service;
    }

    @GetMapping
    public List<Author> getAllAuthors() {
        return service.findAll();
    }

    @PostMapping
    public Author createAuthor(@RequestBody Author author) {
        return service.save(author);
    }
}