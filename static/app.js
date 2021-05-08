"use strict";
const myLibrary = [];

function Book(title, author, pages, haveread) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = haveread;
}

function addBookToLibrary(book) {
    myLibrary.push(book);
}

function removeBookFromLibrary(title) {
    myLibrary.splice(myLibrary.findIndex(book => book.title === title), 1)
}

const addBookButton = document.querySelector(".add_book_button");

const fullscreenGreyOut = document.querySelector(".fullscreen-container");
const addBookPopup = document.querySelector(".addbook");
const addBookForm = document.querySelector(".addbookform");
const submitFormButton = document.querySelector(".submitform");
const cancelFormButton = document.querySelector(".cancelform");

const bookCase = document.querySelector(".bookcase");

function showAddBookForm() {
    addBookPopup.style.display = "block";
    fullscreenGreyOut.style.display = "block";
}

function hideAddBookForm() {
    addBookPopup.style.display = "none";
    fullscreenGreyOut.style.display = "none";
}

function handleNewBookAdd(event) {
    event.preventDefault();
    const { title, author, pages, read } = this.elements;
    const book = new Book(title.value, author.value, pages.value, read.checked);
    addBookToLibrary(book);
    hideAddBookForm();
    addBookForm.reset();
    updateBookCase();
}

function removeBook() {
    removeBookFromLibrary(this.id);
    updateBookCase();
}

function changeReadState() {
    const index = myLibrary.findIndex(book => book.title === this.id);
    myLibrary[index].read ^= true;
    updateBookCase();
}

function updateBookCase() {
    bookCase.innerHTML = "";

    for (const book of myLibrary) {
        bookCase.appendChild(addBookToShelf(book));
    }

    const closebuttons = bookCase.querySelectorAll(".card .cardclose");
    for (const closebutton of closebuttons) {
        closebutton.addEventListener("click", removeBook);
    }

    const readbuttons = bookCase.querySelectorAll(".card .cardcontainer .cardreadbuttondiv .cardreadbutton")
    for (const readbutton of readbuttons) {
        readbutton.addEventListener("click", changeReadState);
    }
}

function addBookToShelf(book) {
    const card = document.createElement("div");
    const cardcontainer = document.createElement("div");
    const cardtitle = document.createElement("h4");
    const cardauthor = document.createElement("p");
    const cardpages = document.createElement("p");
    const cardreadbutton = document.createElement("button");
    const buttondiv = document.createElement("div");
    const cardclose = document.createElement("div");

    card.classList.add("card");
    cardcontainer.classList.add("cardcontainer");
    cardtitle.classList.add("cardtitle");
    cardauthor.classList.add("cardauthor");
    cardpages.classList.add("cardpages");
    cardreadbutton.classList.add("cardreadbutton");
    buttondiv.classList.add("cardreadbuttondiv");
    cardclose.classList.add("cardclose");

    cardclose.innerHTML = "<span>x</span>";
    cardclose.id = book.title;
    card.appendChild(cardclose);

    // https://www.pinclipart.com/pindetail/iibxhix_books-png-clipart-psd-vectors-and-icons-for/
    card.innerHTML += "<img src=\"static/open-book-clip-art_3637477.png\" style=\"width:100%\">";

    cardtitle.textContent = book.title;
    cardauthor.textContent = book.author;
    cardpages.textContent = `Pages: ${book.pages}`;
    cardreadbutton.textContent = book.read ? "Have read" : "Not read yet"

    cardcontainer.appendChild(cardtitle);
    cardcontainer.appendChild(cardauthor);
    cardcontainer.appendChild(cardpages);
    cardreadbutton.id = book.title;
    buttondiv.appendChild(cardreadbutton);
    cardcontainer.appendChild(buttondiv);
    card.appendChild(cardcontainer);
    return card;
}

addBookButton.addEventListener("click", showAddBookForm);
addBookForm.addEventListener("submit", handleNewBookAdd);
cancelFormButton.addEventListener("click", hideAddBookForm);

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
        title: "Tpecticles",
        author: "Wakespeare",
        pages: 500,
        read: false },
    {
        title: "Upecticles",
        author: "Wakespeare",
        pages: 500,
        read: false },
    {
        title: "Vpecticles",
        author: "Wakespeare",
        pages: 500,
        read: false },
    {
        title: "Wpecticles",
        author: "Wakespeare",
        pages: 500,
        read: false },
    {
        title: "Icicles",
        author: "Bakespeare",
        pages: 76,
        read: true
    }];

    for (const book of books) {
        const tmpbook = new Book(book.title, book.author, book.pages, book.read);
        addBookToLibrary(tmpbook);
    }
    updateBookCase();
})
