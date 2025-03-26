const jsonUrl = 'books.json';

// Function to resolve image path
function resolveImagePath(imageUrl) {
    // If it's an absolute URL, return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
    }

    
    const baseUrl = 'https://jas2485.github.io/assignment-4/';
    return baseUrl + imageUrl;
}

function fetchBooks() {
    return new Promise((resolve, reject) => {
        fetch(jsonUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(books => {
                // Process images before resolving
                const processedBooks = books.map(book => ({
                    ...book,
                    imageUrl: resolveImagePath(book.imageUrl)
                }));
                console.log('Books with processed image URLs:', processedBooks);
                resolve(processedBooks);
            })
            .catch(error => {
                console.error('Error fetching books:', error);
                reject(error);
            });
    });
}

function displayBooks(books) {
    const bookDisplay = document.getElementById('bookDisplay');
    bookDisplay.innerHTML = ''; // Clear previous content

    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');
        
        // Detailed image error handling
        const img = document.createElement('img');
        img.src = book.imageUrl;
        img.alt = `Cover of ${book.title}`;
        img.classList.add('book-image');
        
        // Comprehensive image error handling
        img.onerror = () => {
            console.warn(`Failed to load image for ${book.title}`);
            // Fallback to placeholder
            img.src = 'https://via.placeholder.com/300x450.png?text=Book+Cover';
            img.alt = 'Default book cover';
        };

        bookCard.innerHTML = `
            <div class="book-image-container">
                <img src="${img.src}" alt="${img.alt}" class="book-image">
            </div>
            <div class="book-info">
                <h2>${book.title}</h2>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Published:</strong> ${book.publishYear}</p>
            </div>
        `;
        
        bookDisplay.appendChild(bookCard);
    });
}


// Display books with enhanced formatting
function displayBooks(books) {
    const bookDisplay = document.getElementById('bookDisplay');
    bookDisplay.innerHTML = ''; // Clear previous content

    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');
        
        // Create image with error handling
        const img = document.createElement('img');
        img.src = book.imageUrl || 'https://via.placeholder.com/300x450.png?text=Book+Cover';
        img.alt = `Cover of ${book.title}`;
        img.classList.add('book-image');
        img.onerror = () => {
            img.src = 'https://via.placeholder.com/300x450.png?text=Book+Cover';
            console.warn(`Failed to load image for ${book.title}`);
        };

        bookCard.innerHTML = `
            <div class="book-image-container">
                <img src="${img.src}" alt="${img.alt}" class="book-image">
            </div>
            <div class="book-info">
                <h2>${book.title}</h2>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Published:</strong> ${book.publishYear}</p>
            </div>
        `;
        
        bookDisplay.appendChild(bookCard);
    });
}

// Additional API interaction functions
function sortBooksByYear(books) {
    return books.sort((a, b) => a.publishYear - b.publishYear);
}

function filterClassicBooks(books) {
    return books.filter(book => book.publishYear < 1960);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const loadBooksBtn = document.getElementById('loadBooksBtn');
    const sortByYearBtn = document.getElementById('sortByYearBtn');
    const filterClassicsBtn = document.getElementById('filterClassicsBtn');
    const apiResponse = document.getElementById('apiResponse');

    let booksData = []; // Store books globally

    // Load Books
    loadBooksBtn.addEventListener('click', () => {
        fetchBooks()
            .then(books => {
                booksData = books;
                displayBooks(books);
                apiResponse.textContent = `Loaded ${books.length} books successfully!`;
            })
            .catch(error => {
                apiResponse.textContent = `Error: ${error.message}`;
            });
    });

    // Sort Books by Year
    sortByYearBtn.addEventListener('click', () => {
        if (booksData.length) {
            const sortedBooks = sortBooksByYear(booksData);
            displayBooks(sortedBooks);
            apiResponse.textContent = 'Books sorted by publication year!';
        } else {
            apiResponse.textContent = 'Please load books first!';
        }
    });

    // Filter Classic Books
    filterClassicsBtn.addEventListener('click', () => {
        if (booksData.length) {
            const classicBooks = filterClassicBooks(booksData);
            displayBooks(classicBooks);
            apiResponse.textContent = `Found ${classicBooks.length} classic books!`;
        } else {
            apiResponse.textContent = 'Please load books first!';
        }
    });
});