"use strict";
const myLibrary = [];

const fullscreenGreyOut = document.querySelector(".fullscreen-container");
const addBookButton = document.querySelector(".add_book_button");
const addBookPopup = document.querySelector(".addbook");
const addBookForm = document.querySelector(".addbookform");
// const submitFormButton = document.querySelector(".submitform");
const cancelFormButton = document.querySelector(".cancelform");

const bookCase = document.querySelector(".bookcase");

const dbRefObject = firebase.database().ref().child('object');
const dbRefLib = dbRefObject.child('library');


function Book(title, author, pages, haveread, id) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = haveread;
    this.id = id
}

function addBookToLibrary(book) {
    removeBookFromLibrary(book.id);
    myLibrary.push(book);
}

function removeBookFromLibrary(id) {
    const index = myLibrary.findIndex(book => book.id === id);
    if (index === -1) { return; }
    myLibrary.splice(index, 1);
}

// webpage

function showAddBookForm() {
    addBookPopup.style.display = "block";
    fullscreenGreyOut.style.display = "block";
}

function hideAddBookForm() {
    addBookPopup.style.display = "none";
    fullscreenGreyOut.style.display = "none";
}

function handleLocalLibEntryRemoval(snap) {
    const entry = snap.val();
    removeBookFromLibrary(entry.id);

    updateBookCase();
}

function updateBookCase() {
    bookCase.innerHTML = "";

    const sorted_lib = myLibrary.sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0));

    for (const book of sorted_lib) {
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
    cardclose.id = book.id;
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
    cardreadbutton.id = book.id;
    buttondiv.appendChild(cardreadbutton);
    cardcontainer.appendChild(buttondiv);
    card.appendChild(cardcontainer);
    return card;
}

// firebase

function handleNewBookAdd(event) {
    event.preventDefault();
    const { title, author, pages, read } = this.elements;

    const newBookID = dbRefLib.push().key;
    const newbook = new Book(title.value, author.value, pages.value, read.checked, newBookID);
    const update = {}
    update[newBookID] = newbook;
    dbRefLib.update(update);

    hideAddBookForm();
    addBookForm.reset();
    updateBookCase();
}

function removeBook() {
    dbRefLib.child(this.id).remove();
}

function changeReadState() {
    const index = myLibrary.findIndex(book => book.id === this.id);
    const tmp = {...myLibrary[index]}
    tmp.read ^= true;
    const update = {}
    update[this.id] = tmp;
    dbRefLib.update(update);
}

function loadDatabase(snap) {
    Object.keys(snap.val()).map(k => {
        const entry = snap.val()[k];
        const book = new Book(entry.title, entry.author, entry.pages, entry.read, entry.id);
        addBookToLibrary(book);
    });
    updateBookCase();
}

function updateDataBase(snap) {
    const entry = snap.val()

    const book = new Book(entry.title, entry.author, entry.pages, entry.read, entry.id);
    addBookToLibrary(book);

    updateBookCase();
}


firebase.auth().signInAnonymously()
    .then(() => {

    })
    .catch((error) => {
        console.log(error.message);
    });

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        const uid = user.uid;
        dbRefLib.on('child_changed', updateDataBase);
        dbRefLib.limitToLast(1).on('child_added', updateDataBase);
        dbRefLib.on('child_removed', handleLocalLibEntryRemoval);

        dbRefLib.once('value', loadDatabase);
    } else {
        console.log('not logged in');
    }
})

addBookButton.addEventListener("click", showAddBookForm);
addBookForm.addEventListener("submit", handleNewBookAdd);
cancelFormButton.addEventListener("click", hideAddBookForm);
