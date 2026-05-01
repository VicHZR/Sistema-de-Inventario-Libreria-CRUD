package com.example.booksapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.booksapi.model.Author;

public interface AuthorRepository extends JpaRepository<Author, Long> {
}