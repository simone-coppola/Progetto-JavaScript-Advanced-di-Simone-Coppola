const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const booksContainer = document.querySelector('.books-container');
const loadingBooks = document.querySelector('.loading-books');

let booksList = [];


searchButton.addEventListener('click', async function searchBooks() {

    const category = searchInput.value.trim();

    const loadingBooksParagraph = document.createElement('p');
    loadingBooksParagraph.textContent = 'Caricamento in corso...';
    loadingBooks.appendChild(loadingBooksParagraph);


    try {
        let response = await fetch(`https://openlibrary.org/subjects/${encodeURIComponent(category)}.json`);
        if (!response.ok) {
            throw new Error('Si è verificato un errore durante il recupero dei libri.');
        }
        let data = await response.json();
        booksList = data.works;

        if (booksList.length === 0) {
            booksContainer.innerHTML = '';
            loadingBooksParagraph.textContent = 'Nessun libro trovato per questa categoria.';
            setTimeout(() => {
                loadingBooksParagraph.textContent = '';
            }, 5000);
        } else {
            showBooks();
            loadingBooksParagraph.innerHTML = '';
        }
    } catch (error) {
        loadingBooksParagraph.innerHTML = '';
        showError('Errore durante la ricerca: ' + error.message);
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

        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');
        bookCard.innerHTML =
            `   <h3>${title}</h3>
            <p>di ${author}</p>
            <button class="details-button" data-key="${key}">Dettagli</button> `;

        booksContainer.appendChild(bookCard);

        const detailsButton = bookCard.querySelector('.details-button');


        detailsButton.addEventListener('click', async function () {

            const existingDescription = bookCard.querySelector('.book-description');
            if (existingDescription) {
                existingDescription.remove();
                return;
            }


            try {
                let response = await fetch(`https://openlibrary.org${key}.json`);
                if (!response.ok) {
                    throw new Error('Si è verificato un errore durante il recupero dei dettagli del libro.');
                }
                let bookDetails = await response.json();
                const description = document.createElement('p');
                description.classList.add('book-description');
                description.textContent = bookDetails.description ? (typeof bookDetails.description === 'string' ? bookDetails.description : bookDetails.description.value) : 'Descrizione non disponibile.';
                bookCard.appendChild(description);
            } catch (error) {
                showError('Errore durante il recupero dei dettagli: ' + error.message);
            }
        });
    });

}

function showError(message) {
    const errorParagraph = document.createElement('p');
    errorParagraph.textContent = message;
    loadingBooks.appendChild(errorParagraph);
}