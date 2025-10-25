// Do your work here...

// Menggunakan localStorage untuk menyimpan data buku
const STORAGE_KEY = 'BOOKSHELF_APPS_DATA';

// fungsi untuk mendapatkan dan menyimpan buku dari localStorage
function getBooks() {
  const books = localStorage.getItem(STORAGE_KEY);
  return books ? JSON.parse(books) : [];
}

function saveBooks(books) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}


// Fungsi untuk membuat elemen buku
function generateBookElement(book) {
  const bookDiv = document.createElement('div');
  bookDiv.setAttribute('data-bookid', book.id);
  bookDiv.setAttribute('data-testid', 'bookItem');

  const title = document.createElement('h3');
  title.setAttribute('data-testid', 'bookItemTitle');
  title.textContent = book.title;

  const author = document.createElement('p');
  author.setAttribute('data-testid', 'bookItemAuthor');
  author.textContent = `Penulis: ${book.author}`;

  const year = document.createElement('p');
  year.setAttribute('data-testid', 'bookItemYear');
  year.textContent = `Tahun: ${book.year}`;

  const buttonDiv = document.createElement('div');

  const toggleButton = document.createElement('button');
  toggleButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
  toggleButton.textContent = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
  toggleButton.addEventListener('click', () => toggleBookStatus(book.id));

  const deleteButton = document.createElement('button');
  deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
  deleteButton.textContent = 'Hapus Buku';
  deleteButton.addEventListener('click', () => deleteBook(book.id));

  const editButton = document.createElement('button');
  editButton.setAttribute('data-testid', 'bookItemEditButton');
  editButton.textContent = 'Edit Buku';
  editButton.addEventListener('click', () => editBook(book.id));

  buttonDiv.appendChild(toggleButton);
  buttonDiv.appendChild(deleteButton);
  buttonDiv.appendChild(editButton);

  bookDiv.appendChild(title);
  bookDiv.appendChild(author);
  bookDiv.appendChild(year);
  bookDiv.appendChild(buttonDiv);

  return bookDiv;
}


// fungsi untuk menampilkan buku di halaman
function renderBooks() {
  const incompleteList = document.getElementById('incompleteBookList');
  const completeList = document.getElementById('completeBookList');
  incompleteList.innerHTML = '';
  completeList.innerHTML = '';

  const books = getBooks();
  books.forEach(book => {
    const bookElement = generateBookElement(book);
    if (book.isComplete) {
      completeList.appendChild(bookElement);
    } else {
      incompleteList.appendChild(bookElement);
    }
  });
}


// fungsi untuk menambahkan buku baru
function addBook(e) {
  e.preventDefault();
  const title = document.getElementById('bookFormTitle').value.trim();
  const author = document.getElementById('bookFormAuthor').value.trim();
  const year = Number(document.getElementById('bookFormYear').value);
  const isComplete = document.getElementById('bookFormIsComplete').checked;

  if (!title || !author || !year) return;

  const newBook = {
    id: Date.now(),
    title,
    author,
    year,
    isComplete,
  };

  const books = getBooks();
  books.push(newBook);
  saveBooks(books);
  renderBooks();
  document.getElementById('bookForm').reset();
}

function toggleBookStatus(id) {
  const books = getBooks();
  const idx = books.findIndex(b => b.id == id);
  if (idx !== -1) {
    books[idx].isComplete = !books[idx].isComplete;
    saveBooks(books);
    renderBooks();
  }
}

// fungsi untuk menghapus buku
function deleteBook(id) {
  if (!confirm('Yakin ingin menghapus buku ini?')) return;
  let books = getBooks();
  books = books.filter(b => b.id != id);
  saveBooks(books);
  renderBooks();
}

// fungsi untuk mengedit buku
function editBook(id) {
  const books = getBooks();
  const book = books.find(b => b.id == id);
  if (!book) return;

  // Simple prompt dialog untuk mengedit buku
  const newTitle = prompt('Edit Judul:', book.title);
  if (newTitle === null) return;
  const newAuthor = prompt('Edit Penulis:', book.author);
  if (newAuthor === null) return;
  const newYear = prompt('Edit Tahun:', book.year);
  if (newYear === null || isNaN(Number(newYear))) return;

  book.title = newTitle.trim();
  book.author = newAuthor.trim();
  book.year = Number(newYear);

  saveBooks(books);
  renderBooks();
}

document.getElementById('bookForm').addEventListener('submit', addBook);

window.addEventListener('DOMContentLoaded', renderBooks);

console.log('Hello, world!');

