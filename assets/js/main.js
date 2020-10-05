! function () {
    // Selector Function
    const $ = (selector, areAll) => areAll ? document.querySelectorAll(selector) : document.querySelector(selector);

    // Check Empty Values
    const checkEmptyVal = values => {
        return values.some(function (val) {
            return !val;
        });
    }

    // Variables
    const confirmationAlert = $('.confirmation-alert');
    const confirmationSuccessElement = $('.confirmation-alert.success-alert');
    const form = $('form');
    const inputTitle = $('#title');
    const inputAuthor = $('#author');
    const inputISBN = $('#isbn');
    const tableListWrap = $('.table-list-wrap');
    const tbody = $('table tbody');
    const clearAllBtn = $('#clear-all');
    let books;
    books = localStorage.getItem('books') ? JSON.parse(localStorage.getItem('books')) : [];

    // Function: Simple Alert
    const simpleAlert = (msg, className) => {
        const p = document.createElement('p');
        p.innerHTML = msg;
        p.className = `simple-alert ${className}`;
        form.insertAdjacentElement('beforebegin', p);
        setTimeout(() => {
            p.remove();
        }, 1800);
    }

    // Function: Confirmation Success Message
    const confirmationSuccessMsg = msg => {
        const confirmation = `
            <div class="confirmation">
                <p><span>Success!</span> <br> <span>${msg}</span></p>
            </div>
        `;
        confirmationSuccessElement.style.display = 'block';
        confirmationSuccessElement.innerHTML = confirmation;
        setTimeout(() => {
            confirmationSuccessElement.style.display = 'none';
        }, 1300);
    }

    // Function: Render Books
    const renderBooks = () => {
        while (tbody.lastChild) {
            tbody.lastChild.remove();
        }
        books.forEach((book, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.isbn}</td>
                <td class="delete">X</td>
            `;
            tbody.appendChild(tr);
        });
        tableListWrap.style.display = tbody.innerHTML ? 'block' : 'none';
    }

    // Delete book
    const deleteBook = (e) => {
        if (e.target.classList.contains('delete')) {
            const targetParent = e.target.parentElement;
            confirmationAlert.style.display = 'block';
            const myFunction = e => {
                if (e.target.classList.contains('yes')) {
                    books.map((book, index) => {
                        if (index === targetParent.firstElementChild.innerHTML - 1) {
                            books.splice(index, 1);
                            localStorage.setItem('books', JSON.stringify(books));
                            renderBooks();
                        }
                    });
                    confirmationAlert.style.display = 'none';
                    confirmationSuccessMsg('Books removed.');
                    confirmationAlert.removeEventListener('click', myFunction);
                }
                if (e.target.classList.contains('cancel')) {
                    console.log('Delete hobena no chinta');
                    confirmationAlert.style.display = 'none';
                    confirmationAlert.removeEventListener('click', myFunction);
                }
            }
            confirmationAlert.addEventListener('click', myFunction);
        }
    }

    // Clear Books
    const clearBooks = () => {
        confirmationAlert.style.display = 'block';
        const myFunction = e => {
            if (e.target.classList.contains('yes')) {
                localStorage.removeItem('books');
                books = [];
                renderBooks();
                confirmationAlert.style.display = 'none';
                confirmationSuccessMsg('Books removed.');
            }
            if (e.target.classList.contains('cancel')) {
                confirmationAlert.style.display = 'none';
            }
        }
        confirmationAlert.addEventListener('click', myFunction);
    }

    // Function: Submit the form
    const submitForm = e => {
        e.preventDefault();
        const newBook = {
            title: inputTitle.value.trim(),
            author: inputAuthor.value.trim(),
            isbn: inputISBN.value.trim()
        }
        if (checkEmptyVal([newBook.title, newBook.author, newBook.isbn])) {
            simpleAlert('Please fill in all the fields', 'red');
            return;
        }
        books.push(newBook);
        localStorage.setItem('books', JSON.stringify(books));
        renderBooks();
        confirmationSuccessMsg('Book added.');
        inputTitle.value = '';
        inputAuthor.value = '';
        inputISBN.value = '';

    }

    // Function: all Event Listeners
    const allEventListeners = () => {
        document.addEventListener('DOMContentLoaded', renderBooks);
        form.addEventListener('submit', submitForm);
        tbody.addEventListener('click', deleteBook);
        clearAllBtn.addEventListener('click', clearBooks);
    }
    allEventListeners();
}();