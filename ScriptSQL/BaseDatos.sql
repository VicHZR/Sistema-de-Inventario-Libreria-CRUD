-- Crear tabla Book 
CREATE TABLE book (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    page_count INTEGER DEFAULT 0, 
    quantity INTEGER DEFAULT 0
);

-- Crear tabla Author 
CREATE TABLE author (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    book_id BIGINT,
    CONSTRAINT fk_book_author FOREIGN KEY (book_id) REFERENCES book(id) ON DELETE CASCADE
);

INSERT INTO book (code, title, description, page_count, quantity) VALUES 
('BK-2026-00', 'Anna Karenina', 'Obra maestra del realismo ruso sobre el destino y la pasión.', 864, 5),
('BK-PROG-01', 'Clean Code', 'Principios de desarrollo de software ágil.', 464, 10);

INSERT INTO author (first_name, last_name, book_id) VALUES 
('León', 'Tolstoi', 1),
('Robert', 'C. Martin', 2);
