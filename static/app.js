"use strict";
const myLibray = [];

function Book(title, author, pages, haveread) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = haveread;
    // this.info = function() {
        
    // }
}

Book.prototype.info = function() {
    return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read ? "have read" : "not read yet"}`;
}

function addBookToLibrary(book) {
    myLibray.push(book);
}

const addBookButton = document.querySelector(".add_book_button");
const bookCase = document.querySelector(".bookcase");

function updateBookCase() {
    bookCase.innerHTML = "";

    for (var book of myLibray) {
        bookCase.appendChild(addBookToShelf(book));
    }
}

function addBookToShelf(book) {
    const card = document.createElement("div");
    const cardcontainer = document.createElement("div");
    const cardtitle = document.createElement("h4");
    const cardauthor = document.createElement("p");
    const cardpages = document.createElement("p");
    const cardreadbutton = document.createElement("button");

    card.classList.add("card");
    cardcontainer.classList.add("cardcontainer");
    cardtitle.classList.add("cardtitle");
    cardauthor.classList.add("cardauthor");
    cardpages.classList.add("cardpages");
    cardreadbutton.classList.add("cardreadbutton");

    card.innerHTML = "<img src=\"static/open-book-clip-art_3637477.png\" style=\"width:100%\">"
    cardtitle.textContent = book.title;
    cardauthor.textContent = book.author;
    cardpages.textContent = `Pages: ${book.pages}`;
    cardreadbutton.textContent = book.read ? "Have read" : "Not read yet"
    cardcontainer.appendChild(cardtitle);
    cardcontainer.appendChild(cardauthor);
    cardcontainer.appendChild(cardpages);
    cardcontainer.appendChild(cardreadbutton);
    card.appendChild(cardcontainer);
    return card;
}

document.addEventListener("DOMContentLoaded", () => {
    const books = [{
        title: "Testicles",
        author: "Shakespeare",
        pages: 30,
        read: true },
    {
        title: "Specticles",
        author: "Wakespeare",
        pages: 500,
        read: false },
    {
        title: "Icicles",
        author: "Bakespeare",
        pages: 76,
        read: true
    }];

    for (var book of books) {
        // addBookToLibrary(books[entry]);
        // const book = books[entry];
        const tmpbook = new Book(book.title, book.author, book.pages, book.read);
        addBookToLibrary(tmpbook);
    }
    updateBookCase();
    console.log(myLibray);
})
