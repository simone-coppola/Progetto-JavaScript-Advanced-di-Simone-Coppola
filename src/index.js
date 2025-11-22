import axios from 'axios';
import './style.css';
import logo from './assets/IMG/logo.png';
import axios from 'axios';

const logoImg = document.querySelector('.title img');
logoImg.src = logo;

import favicon from './assets/IMG/logo.png';
const link = document.createElement('link');
link.rel = 'icon';
link.href = favicon;
document.head.appendChild(link);




function createElementBase(tag) {
    return document.createElement(tag);
}

function addClassName(element, className) {
    element.classList.add(className);
}

function setAttribute(element, attributeName, attributeValue) {
    element.setAttribute(attributeName, attributeValue);
}

function setTextContent(element, text) {
    element.textContent = text;
}

function appendChildren(parent, ...children) {
    children.forEach(child => parent.appendChild(child));
}


const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const booksContainer = document.querySelector('.books-container');
const loadingBooks = document.querySelector('.loading-books');

let booksList = [];


searchButton.addEventListener('click', async function searchBooks() {

    loadingBooks.innerHTML = '';
    booksContainer.innerHTML = '';

    const category = searchInput.value.trim();

    if (!category) {
        showError("Inserisci una categoria valida.");
        return;
    }

    const loadingBooksParagraph = createElementBase('p');
    setTextContent(loadingBooksParagraph, 'Caricamento dei libri...');
    appendChildren(loadingBooks, loadingBooksParagraph);

    try {
        
        const response = await axios.get(`/api/subjects/${encodeURIComponent(category)}.json`);
        const data = response.data;
        booksList = data.works;

        if (booksList.length === 0) {
            loadingBooksParagraph.textContent = 'La ricerca non ha trovato corrispondenze. Prova con una categoria diversa.';
            setTimeout(() => loadingBooksParagraph.textContent = '', 5000);
        } else {
            showBooks();
            loadingBooksParagraph.textContent = '';
        }
    } catch (error) {
        showError('Errore durante la ricerca: ' + (error.response ? error.response.statusText : error.message));
    } finally {
        searchInput.value = '';
    }
});


function showBooks() {
    booksContainer.innerHTML = '';

    booksList.forEach(book => {
        const title = book.title;
        const key = book.key;
        const author = book.authors && book.authors.length > 0 ? book.authors[0].name : 'Autore sconosciuto';

        const bookCard = createElementBase('div');
        addClassName(bookCard, 'book-card');

        const bookTitle = createElementBase('h3');
        setTextContent(bookTitle, title);

        const bookAuthor = createElementBase('p');
        setTextContent(bookAuthor, `Autore: ${author}`);

        const detailsButton = createElementBase('button');
        addClassName(detailsButton, 'details-button');
        setTextContent(detailsButton, 'Mostra Dettagli');

        appendChildren(bookCard, bookTitle, bookAuthor, detailsButton);
        booksContainer.appendChild(bookCard);

        
        detailsButton.addEventListener('click', async function () {

            const existingDescription = bookCard.querySelector('.book-description');
            if (existingDescription) {
                existingDescription.remove();
                return;
            }

            try {
                const response = await axios.get(`/api${key}.json`);
                const bookDetails = response.data;

                const descriptionText = bookDetails.description
                    ? (typeof bookDetails.description === "string"
                        ? bookDetails.description
                        : bookDetails.description.value)
                    : "Descrizione non disponibile.";

                const descriptionElement = createElementBase("p");
                addClassName(descriptionElement, "book-description");
                setTextContent(descriptionElement, descriptionText);

                bookCard.appendChild(descriptionElement);
            } catch (error) {
                showError('Errore durante il recupero dei dettagli: ' + (error.response ? error.response.statusText : error.message));
            }
        });
    });
}


function showError(message) {
    loadingBooks.innerHTML = "";

    const errorBox = createElementBase("div");
    addClassName(errorBox, "error-message");

    setTextContent(errorBox, message);
    loadingBooks.appendChild(errorBox);

    setTimeout(() => {
        errorBox.remove();
    }, 5000);
}
