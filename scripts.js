// Import data from the data.js file
import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'

// Initialize variables for the current page and the list of books that match the search criteria
let page = 1;
let matches = books

// Define constants for class names, attribute names, and element types
const CLASS_PREVIEW = 'preview';
const ATTR_PREVIEW = 'data-preview';
const ELEMENT_BUTTON = 'button';
const ELEMENT_OPTION = 'option';

// Define an object to hold references to elements in the DOM
const elements = {
    listItems: document.querySelector('[data-list-items]'),
    searchGenres: document.querySelector('[data-search-genres]'),
    searchAuthors: document.querySelector('[data-search-authors]'),
    settingsTheme: document.querySelector('[data-settings-theme]'),
    listButton: document.querySelector('[data-list-button]'),
    searchOverlay: document.querySelector('[data-search-overlay]'),
    searchTitle: document.querySelector('[data-search-title]'),
    settingsOverlay: document.querySelector('[data-settings-overlay]'),
    listActive: document.querySelector('[data-list-active]')
};

// Create an array of book-preview elements for the first page
const startingPreviews = matches.slice(0, BOOKS_PER_PAGE).map(({ author, id, image, title }) => {
    const preview = document.createElement('book-preview');
    console.log(preview, 'hello world')
    preview.setAttribute('data-id', id);
    preview.setAttribute('data-image', image);
    preview.setAttribute('data-title', title);
    preview.setAttribute('data-author', authors[author]);
    return preview;
});

// Append the startingPreviews to the [data-list-items] element in the DOM using the elements object
appendChildren(elements.listItems, startingPreviews);



// Function to create a button element for a book preview
function createButton(id, image, title, author) {
    // Create a button element and set its class and data-preview attribute
    const element = document.createElement(ELEMENT_BUTTON);
    element.classList = CLASS_PREVIEW;
    element.setAttribute(ATTR_PREVIEW, id);

    // Set the innerHTML of the button to include an image and information about the book
    element.innerHTML = `
        <img
            class="${CLASS_PREVIEW}__image"
            src="${image}"
        />
        
        <div class="${CLASS_PREVIEW}__info">
            <h3 class="${CLASS_PREVIEW}__title">${title}</h3>
            <div class="${CLASS_PREVIEW}__author">${authors[author]}</div>
        </div>
    `;

    // Return the created button element
    return element;
}

// Function to create an option element for a select menu
function createOption(value, text) {
    // Create an option element and set its value and text
    const element = document.createElement(ELEMENT_OPTION);
    element.value = value;
    element.innerText = text;
    
    // Return the created option element
    return element;
}

// Function to append an array of children elements to a parent element
function appendChildren(parent, children) {
    // Create a document fragment to hold the children elements
    const fragment = document.createDocumentFragment();
    
    // Append each child element to the fragment
    children.forEach(child => fragment.appendChild(child));
    
    // Append the fragment to the parent element
    parent.appendChild(fragment);
}

// Create an array of button elements for the book previews on the first page
const startingButtons = matches.slice(0, BOOKS_PER_PAGE).map(({ author, id, image, title }) => createButton(id, image, title, author));

// Append the startingButtons to the [data-list-items] element in the DOM using the elements object
appendChildren(elements.listItems, startingButtons);

// Create an array of option elements for the genre select menu
const genreOptions = [createOption('any', 'All Genres'), ...Object.entries(genres).map(([id, name]) => createOption(id, name))];

// Append the genreOptions to the [data-search-genres] element in the DOM using the elements object
appendChildren(elements.searchGenres, genreOptions);

// Create an array of option elements for the author select menu
const authorOptions = [createOption('any', 'All Authors'), ...Object.entries(authors).map(([id, name]) => createOption(id, name))];

// Append the authorOptions to the [data-search-authors] element in the DOM using the elements object
appendChildren(elements.searchAuthors, authorOptions);

// Check if the user's device prefers a dark color scheme
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // If so, set the value of the [data-settings-theme] select menu to 'night' using the elements object
    elements.settingsTheme.value = 'night';
    
    // Set CSS variables for dark and light colors to use in night mode
    document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
    document.documentElement.style.setProperty('--color-light', '10, 10, 20');
} else {
    // If not, set the value of the [data-settings-theme] select menu to 'day' using the elements object
    elements.settingsTheme.value = 'day';
    
    // Set CSS variables for dark and light colors to use in day mode
    document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
    document.documentElement.style.setProperty('--color-light', '255, 255, 255');
}

// Set the text of the [data-list-button] button to show how many more books are available using the elements object
elements.listButton.innerText = `Show more (${books.length - BOOKS_PER_PAGE})`;

// Disable or enable the [data-list-button] button depending on whether there are more books available on subsequent pages using the elements object
elements.listButton.disabled = (matches.length - (page * BOOKS_PER_PAGE)) > 0;

// Set the innerHTML of the [data-list-button] button to include a span with text and a span with remaining books count using the elements object
elements.listButton.innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
`;

// Add an event listener to the [data-search-cancel] button to close the search overlay when clicked using the elements object
document.querySelector('[data-search-cancel]').addEventListener('click', () => {
    elements.searchOverlay.open = false;
});

// Add an event listener to the [data-settings-cancel] button to close the settings overlay when clicked using the elements object
document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
    elements.settingsOverlay.open = false;
});

// Add an event listener to the [data-header-search] button to open the search overlay and focus on the search input when clicked using the elements object
document.querySelector('[data-header-search]').addEventListener('click', () => {
    elements.searchOverlay.open = true;
    elements.searchTitle.focus();
});

// Add an event listener to the [data-header-settings] button to open the settings overlay when clicked using the elements object
document.querySelector('[data-header-settings]').addEventListener('click', () => {
    elements.settingsOverlay.open = true;
});

// Add an event listener to the [data-list-close] button to close the active book preview when clicked using the elements object
document.querySelector('[data-list-close]').addEventListener('click', () => {
    elements.listActive.open = false;
});

// Add an event listener to the [data-settings-form] form to handle form submission
document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();
})
    // Get the form data as a FormData object
    const formData = new FormData(event.target);
    
    // Convert the FormData object into a regular object
    const { theme } = Object.fromEntries(formData);

    // Check if the selected theme is 'night'
    if (theme === 'night') {
        // If so, set CSS variables for dark and light colors to use in night mode
        document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
        document.documentElement.style.setProperty('--color-light', '10, 10, 20');
    
} else {
    document.querySelector('[data-settings-theme]').value = 'day'
    document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
    document.documentElement.style.setProperty('--color-light', '255, 255, 255');
}

// Update the text and state of the "Show more" button
const updateShowMoreButton = (books, matches, page, BOOKS_PER_PAGE) => {
    document.querySelector('[data-list-button]').innerText = `Show more (${books.length - BOOKS_PER_PAGE})`;
    document.querySelector('[data-list-button]').disabled = (matches.length - (page * BOOKS_PER_PAGE)) > 0;
    document.querySelector('[data-list-button]').innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
    `;
};

// Close the search overlay when the cancel button is clicked
document.querySelector('[data-search-cancel]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = false;
});

// Close the settings overlay when the cancel button is clicked
document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = false;
});

// Open the search overlay when the search button is clicked
document.querySelector('[data-header-search]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = true;
    document.querySelector('[data-search-title]').focus();
});

// Open the settings overlay when the settings button is clicked
document.querySelector('[data-header-settings]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = true;
});

// Close the active list when the close button is clicked
document.querySelector('[data-list-close]').addEventListener('click', () => {
    document.querySelector('[data-list-active]').open = false;
});

// Update theme when settings form is submitted
document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { theme } = Object.fromEntries(formData);

    if (theme === 'night') {
        document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
        document.documentElement.style.setProperty('--color-light', '10, 10, 20');
    } else {
        document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
        document.documentElement.style.setProperty('--color-light', '255, 255, 255');
    }
    
    document.querySelector('[data-settings-overlay]').open = false;
});

// Filter books when search form is submitted
document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    const result = [];
});

    for (const book of books) {
        let genreMatch = filters.genre === 'any'

        for (const singleGenre of book.genres) {
            if (genreMatch) break;
            if (singleGenre === filters.genre) { genreMatch = true }
        }

        if (
            (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) && 
            (filters.author === 'any' || book.author === filters.author) && 
            genreMatch
        ) {
            result.push(book)
        }
    }

    page = 1;
    matches = result

    if (result.length < 1) {
        document.querySelector('[data-list-message]').classList.add('list__message_show')
    } else {
        document.querySelector('[data-list-message]').classList.remove('list__message_show')
    }

    document.querySelector('[data-list-items]').innerHTML = ''
    const newItems = document.createDocumentFragment()

    for (const { author, id, image, title } of result.slice(0, BOOKS_PER_PAGE)) {
        const element = document.createElement('button')
        element.classList = 'preview'
        element.setAttribute('data-preview', id)
    
        element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `

        newItems.appendChild(element)
    }

    document.querySelector('[data-list-items]').appendChild(newItems)
    document.querySelector('[data-list-button]').disabled = (matches.length - (page * BOOKS_PER_PAGE)) < 1

    document.querySelector('[data-list-button]').innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
    `

    window.scrollTo({top: 0, behavior: 'smooth'});
    document.querySelector('[data-search-overlay]').open = false


document.querySelector('[data-list-button]').addEventListener('click', () => {
    const fragment = document.createDocumentFragment()

    for (const { author, id, image, title } of matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)) {
        const element = document.createElement('button')
        element.classList = 'preview'
        element.setAttribute('data-preview', id)
    
        element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `

        fragment.appendChild(element)
    }

    document.querySelector('[data-list-items]').appendChild(fragment)
    page += 1
})

document.querySelector('[data-list-items]').addEventListener('click', (event) => {
    const pathArray = Array.from(event.path || event.composedPath())
    let active = null

    for (const node of pathArray) {
        if (active) break

        if (node?.dataset?.preview) {
            let result = null
    
            for (const singleBook of books) {
                if (result) break;
                if (singleBook.id === node?.dataset?.preview) result = singleBook
            } 
        
            active = result
        }
    }
    
    if (active) {
        document.querySelector('[data-list-active]').open = true
        document.querySelector('[data-list-blur]').src = active.image
        document.querySelector('[data-list-image]').src = active.image
        document.querySelector('[data-list-title]').innerText = active.title
        document.querySelector('[data-list-subtitle]').innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`
        document.querySelector('[data-list-description]').innerText = active.description
    }
})