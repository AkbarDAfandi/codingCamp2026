import { nanoid } from 'nanoid';
import books from "../src/books.js";

export const addBook = (req, res) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.body;
    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;


    if (!name) {
        return res.status(400).json({
            status: "fail",
            message: "Gagal menambahkan buku. Mohon isi nama buku",
        });
    }

    if (readPage > pageCount) {
        return res.status(400).json({
            status: "fail",
            message:
                "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
        });
    }
    
    const newBook = { id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt};
    books.push(newBook);


    const isSuccess = books.filter((book) => book.id === id).length > 0;
    if (isSuccess) {
        return res.status(201).json({
            status: "success",
            message: "Buku berhasil ditambahkan",
            data: { bookId: id },
        });
    }

    return res.status(500).json({
        status: "error",
        message: "Buku gagal ditambahkan",
    });
};

export const getAllBooks = (req, res) => {
    const { name, reading, finished } = req.query;

    let filteredBooks = books;

    if (name !== undefined) {
        filteredBooks = filteredBooks.filter((book) => 
        book.name.toLowerCase().includes(name.toLowerCase())
        );
    }

    if (reading !== undefined) {
        filteredBooks = filteredBooks.filter((book) => 
        Number(book.reading) === Number(reading)
        );
    }

    if (finished !== undefined) {
        filteredBooks = filteredBooks.filter((book) => 
        Number(book.finished) === Number(finished)
        );
    }

    const formattedBooks = filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
    }));

    return res.status(200).json({
        status: "success",
        data: { books: formattedBooks },
    });
};

export const getBookById = (req, res) => {
    const { bookId } = req.params;
    const book = books.find((b) => b.id === bookId);

    if (book) {
        return res.status(200).json({
            status: "success",
            data: { book },
        });
    }

    return res.status(404).json({
        status: "fail",
        message: "Buku tidak ditemukan",
    });
};

export const editBookById = (req, res) => {
    const { bookId } = req.params;
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = req.body;

    if (!name) {
        return res.status(400).json({
            status: "fail",
            message: "Gagal memperbarui buku. Mohon isi nama buku",
        });
    }

    if (readPage > pageCount) {
        return res.status(400).json({
            status: "fail",
            message:
                "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
        });
    }

    const index = books.findIndex((b) => b.id === bookId);

    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished: pageCount === readPage,
            reading,
            updatedAt: new Date().toISOString(),
        };

        return res.status(200).json({
            status: "success",
            message: "Buku berhasil diperbarui",
        });
    }

    return res.status(404).json({
        status: "fail",
        message: "Gagal memperbarui buku. Id tidak ditemukan",
    });
};

export const deleteBookById = (req, res) => {
    const { bookId } = req.params;
    const index = books.findIndex((b) => b.id === bookId);

    if (index !== -1) {
        books.splice(index, 1);
        return res.status(200).json({
            status: "success",
            message: "Buku berhasil dihapus",
        });
    }

    return res.status(404).json({
        status: "fail",
        message: "Buku gagal dihapus. Id tidak ditemukan",
    });
};
