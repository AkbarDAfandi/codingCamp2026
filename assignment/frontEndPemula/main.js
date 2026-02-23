// Do your work here...
const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSELF_APP";

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("bookForm");
  const searchForm = document.getElementById('searchBook');
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }

  searchForm.addEventListener('submit', searchBooks);
});

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function addBook() {
  const textTitle = document.getElementById("bookFormTitle").value;
  const textAuthor = document.getElementById("bookFormAuthor").value;
  const timestamp = Number(document.getElementById("bookFormYear").value);
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const generatedID = generateID();
  const bookObject = generateBookObject(
    generatedID,
    textTitle,
    textAuthor,
    timestamp,
    isComplete,
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();

  document.getElementById("bookForm").reset();
}

function generateID() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget === -1) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function searchBooks(event) {
  event.preventDefault();

  const searchTitle = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  const filteredBooks = books.filter(function (book) {
    return book.title.toLowerCase().includes(searchTitle);
  });

  for (const bookItem of filteredBooks) {
    const bookElement = makeBook(bookItem);

    if (!bookItem.isComplete) {
      incompleteBookList.append(bookElement);
    } else {
      completeBookList.append(bookElement);
    }
  }
}

function makeBook(bookObject) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = bookObject.title;
  textTitle.setAttribute("data-testid", "bookItemTitle");

  const textAuthor = document.createElement("p");
  textAuthor.innerText = "Penulis: " + bookObject.author;
  textAuthor.setAttribute("data-testid", "bookItemAuthor");

  const textYear = document.createElement("p");
  textYear.innerText = "Tahun: " + bookObject.year;
  textYear.setAttribute("data-testid", "bookItemYear");

  const actionContainer = document.createElement("div");

  const toggleButton = document.createElement("button");
  toggleButton.setAttribute("data-testid", "bookItemIsCompleteButton");

  if (bookObject.isComplete) {
    toggleButton.innerText = "Belum selesai dibaca";
    toggleButton.addEventListener("click", function () {
      undoBookFromCompleted(bookObject.id);
    });
  } else {
    toggleButton.innerText = "Selesai dibaca";
    toggleButton.addEventListener("click", function () {
      addBookToCompleted(bookObject.id);
    });
  }

  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Hapus Buku";
  deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
  deleteButton.addEventListener("click", function () {
    removeBook(bookObject.id);
  });

  const editButton = document.createElement("button");
  editButton.innerText = "Edit Buku";
  editButton.setAttribute("data-testid", "bookItemEditButton");

  actionContainer.append(toggleButton, deleteButton, editButton);

  const container = document.createElement("div");
  container.setAttribute("data-bookid", bookObject.id);
  container.setAttribute("data-testid", "bookItem");

  container.append(textTitle, textAuthor, textYear, actionContainer);

  return container;
}

document.addEventListener(RENDER_EVENT, function () {
  console.log(books);
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);

    if (!bookItem.isComplete) {
      incompleteBookList.append(bookElement);
    } else {
      completeBookList.append(bookElement);
    }
  }
});
