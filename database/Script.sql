-- ==========================================================
-- ESTRUCTURA DE BASE DE DATOS: DIGITAL BANK LIB
-- Motor: PostgreSQL 17+
-- Descripción: Gestión de activos bibliográficos corporativos
-- ==========================================================

-- 1. Limpieza preventiva (Opcional, útil para reinicios)
DROP TABLE IF EXISTS author;
DROP TABLE IF EXISTS book;

-- 2. Creación de la tabla de Libros (BOOK)
-- Contiene metadatos técnicos y control de existencias
CREATE TABLE book (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL, -- Identificador único institucional
    title VARCHAR(255) NOT NULL,
    description TEXT,
    page_count INTEGER DEFAULT 0,
    quantity INTEGER DEFAULT 0        -- Stock disponible
);

-- 3. Creación de la tabla de Autores (AUTHOR)
-- Relación 1:N vinculada mediante book_id
CREATE TABLE author (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    book_id BIGINT,
    CONSTRAINT fk_book 
        FOREIGN KEY (book_id) 
        REFERENCES book(id) 
        ON DELETE CASCADE -- Si se borra el libro, se borran sus autores
);

-- 4. Inserción de Datos Maestros (Semilla)
-- Libros de prueba con perfiles técnicos
INSERT INTO book (code, title, description, page_count, quantity) VALUES 
('BK-TECH-001', 'Ingeniería Financiera con Angular', 'Guía avanzada sobre arquitectura de sistemas bancarios modernos.', 450, 15),
('BK-CORE-002', 'Microservicios con Spring Boot 3', 'Manual de referencia para el desarrollo de APIs escalables.', 320, 10),
('BK-DATA-003', 'Estrategias de Persistencia con JPA', 'Optimización de consultas y gestión de transacciones críticas.', 280, 5);

-- Autores vinculados a los libros de prueba
INSERT INTO author (first_name, last_name, book_id) VALUES 
('Victor', 'HZR', 1),
('Ana', 'Lozano', 1),
('Robert', 'Martin', 2),
('Christian', 'Bauer', 3);

-- ==========================================================
-- FIN DEL SCRIPT
-- ==========================================================
