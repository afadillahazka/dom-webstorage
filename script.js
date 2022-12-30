const books = [];
const RENDER_EVENT = 'render-Book';
const STORAGE_KEY = 'SHELF-APPS'
const SAVED_EVENT = 'saved-shelf'


document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

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
  const bookTitle = document.getElementById('inputBookTitle').value;
  const bookAuthor = document.getElementById('inputBookAuthor').value;
  const bookYear = document.getElementById('inputBookYear').value;
  const isComplete = document.getElementById('inputBookIsComplete').checked;

  const generatedID = generateId();

  const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, isComplete);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

function generateId() {
  return +new Date();
};


function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete
  };
};

document.addEventListener(RENDER_EVENT, function () {
  console.log(books);
});

function makeBook(bookObject) {
  const textTitle = document.createElement('h2');
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = bookObject.author;

  const textYear = document.createElement('p');
  textYear.innerText = bookObject.year;

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('action');

  const container = document.createElement('article');
  container.classList.add('book_item');
  container.append(textTitle, textAuthor, textYear);
  container.append(buttonContainer);


  if (bookObject.isComplete) {
    const undoButton = document.createElement('button');
    undoButton.style.backgroundColor = '';
    undoButton.innerText = 'BELUM SELESAI ';

    undoButton.addEventListener('click', function () {
      addTaskFromCompleted(bookObject.id);
    });

    const trashButton = document.createElement('button');
    trashButton.style.backgroundColor = '';
    trashButton.innerText = 'HAPUS BUKU'

    trashButton.addEventListener('click', function () {
      removeTaskfromCompleted(bookObject.id);
    });

    buttonContainer.append(undoButton, trashButton);

  } else {
    const checkedButton = document.createElement('button');
    checkedButton.innerText = 'SELESAI BACA';
    checkedButton.style.backgroundColor = '';

    checkedButton.addEventListener('click', function () {
      addTaskToCompleted(bookObject.id)
    })

    const trashButton = document.createElement('button');
    trashButton.style.backgroundColor = '';
    trashButton.innerText = 'HAPUS BUKU'

    trashButton.addEventListener('click', function () {
      removeTaskfromCompleted(bookObject.id);
    });

    buttonContainer.append(checkedButton, trashButton);
  }
  return container;
};

function addTaskToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addTaskFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function removeTaskfromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function disappearFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));

}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

document.addEventListener(RENDER_EVENT, function () {

  const completeBookshelfList = document.getElementById('completeBookshelfList');
  completeBookshelfList.innerHTML = '';

  const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
  incompleteBookshelfList.innerHTML = '';

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isComplete) incompleteBookshelfList.append(bookElement);
    else completeBookshelfList.append(bookElement);
  }
});

document.getElementById('searchBook').addEventListener('submit', function(){
  event.preventDefault();

  const searchBook = document.getElementById('searchBookTitle').value.toLowerCase();
  const listBook = document.querySelectorAll('.book_item');

  for (let book of listBook){
    const title = book.firstElementChild.innerText.toLowerCase();
    if(title.includes(searchBook)){
      book.style.display = 'block';
    } else { 
      book.style.display = 'none';
    }
  }
})
