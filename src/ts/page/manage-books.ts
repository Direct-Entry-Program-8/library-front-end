const btnNewBook = document.querySelector<HTMLButtonElement>('#btn-new-book')!;
const frmBook = document.querySelector<HTMLFormElement>('#frm-book')!;
const txtISBN = document.querySelector<HTMLInputElement>('#txt-isbn')!;
const txtName = document.querySelector<HTMLInputElement>('#txt-name')!;
const txtAuthor = document.querySelector<HTMLInputElement>('#txt-author')!;
const btnBrowse = document.querySelector<HTMLButtonElement>('#btn-browse')!;
const btnRemove = document.querySelector<HTMLButtonElement>('#btn-remove')!;
const txtPreview = document.querySelector<HTMLInputElement>('#txt-preview')!;
const divThumbnail = document.querySelector<HTMLDivElement>('#thumbnail')!;

let blobURL: null | string = null;

frmBook.addEventListener('reset', ()=> {
    const inputElms = [txtISBN, txtName, txtAuthor];
    inputElms.forEach(elm => elm.classList.remove('is-valid', 'is-invalid'));
    inputElms[0].focus();
    btnRemove.click();
});

frmBook.addEventListener('submit', (e)=> {
    e.preventDefault();

    const inputElms = [txtISBN, txtName, txtAuthor];
    const invalidInputElms = inputElms.filter(elm => !elm.classList.contains('is-valid'));

    if (invalidInputElms.length > 0){
        invalidInputElms.forEach(elm => elm.classList.add('is-invalid'));
        invalidInputElms[0].focus();
        return;
    }

    /* Todo: Let's send the data to the backend for saving, right? */
});

btnRemove.addEventListener('click', () => {
    txtPreview.value = '';
    if (blobURL) URL.revokeObjectURL(blobURL);
    blobURL = null;
    divThumbnail.style.backgroundImage = '';
    btnRemove.disabled = true;
});

btnBrowse.addEventListener('click', () => txtPreview.click());
txtPreview.addEventListener('input', () => {
    if (txtPreview.files![0]) {
        if (blobURL) URL.revokeObjectURL(blobURL);
        blobURL = URL.createObjectURL(txtPreview.files![0]);
        divThumbnail.style.backgroundImage = `url(${blobURL})`;
        btnRemove.disabled = false;
    }
});

setEnableForm(false);

function setEnableForm(enable: boolean = true) {
    for (const element of frmBook.elements) {
        if (element instanceof HTMLInputElement || element instanceof HTMLButtonElement) {
            element.disabled = !enable;
        }
    }
}

btnNewBook.addEventListener('click', () => {
    setEnableForm();
    frmBook.reset();
});

function checkValidityOfISBN() {
    return /^\d+$/.test(txtISBN.value);
}

function checkValidityOfName() {
    return /^.+$/.test(txtName.value);
}

function checkValidityOfAuthor() {
    return /^[A-Za-z ]+$/.test(txtAuthor.value);
}

txtISBN.addEventListener('input', checkValidity);
txtName.addEventListener('input', checkValidity);
txtAuthor.addEventListener('input', checkValidity);

function checkValidity(e: Event) {
    (e.target as HTMLInputElement).classList.remove('is-valid', 'is-invalid');
    if (e.target === txtISBN) {
        checkValidityOfISBN() ? txtISBN.classList.add('is-valid') : txtISBN.classList.add('is-invalid');
    } else if (e.target === txtName) {
        checkValidityOfName() ? txtName.classList.add('is-valid') : txtName.classList.add('is-invalid');
    } else {
        checkValidityOfAuthor() ? txtAuthor.classList.add('is-valid') : txtAuthor.classList.add('is-invalid');
    }
}

const paginationElm = document.querySelector<HTMLUListElement>('#pagination')!;
const pageSize = 5;
let booksCount = 55;

initPagination();

function initPagination(){
    let pages = Math.ceil(booksCount / pageSize);
    let html = `<li class="page-item"><a class="page-link" href="#">&laquo;</a></li>`;
    for (let i = 0; i < pages; i++) {
        html += `<li class="page-item"><a class="page-link" href="#">${i+1}</a></li>`
    }
    html += `<li class="page-item"><a class="page-link" href="#">&raquo;</a></li>`;
    paginationElm.innerHTML = html;
}

