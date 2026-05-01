package com.example.booksapi.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.booksapi.model.Author;
import com.example.booksapi.repository.AuthorRepository;

@Service
public class AuthorService {

    private final AuthorRepository repository;

    public AuthorService(AuthorRepository repository) {
        this.repository = repository;
    }

    public List<Author> findAll() {
        return repository.findAll();
    }

    public Author save(Author author) {
        return repository.save(author);
    }
}