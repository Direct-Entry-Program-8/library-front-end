const btnNewBook = document.querySelector<HTMLButtonElement>('#btn-new-book')!;
const frmBook = document.querySelector<HTMLFormElement>('#frm-book')!;
const txtISBN = document.querySelector<HTMLInputElement>('#txt-isbn')!;
const txtName = document.querySelector<HTMLInputElement>('#txt-name')!;
const txtAuthor = document.querySelector<HTMLInputElement>('#txt-author')!;
const btnBrowse = document.querySelector<HTMLButtonElement>('#btn-browse')!;
const btnRemove = document.querySelector<HTMLButtonElement>('#btn-remove')!;
const txtPreview = document.querySelector<HTMLInputElement>('#txt-preview')!;
const divThumbnail = document.querySelector<HTMLDivElement>('#thumbnail')!;
const btnSave = document.querySelector<HTMLButtonElement>('#btn-save')!;
const btnClear = document.querySelector<HTMLButtonElement>('#btn-clear')!;

let blobURL: null | string = null;

frmBook.addEventListener('reset', () => {
    const inputElms = [txtISBN, txtName, txtAuthor];
    inputElms.forEach(elm => elm.classList.remove('is-valid', 'is-invalid'));
    inputElms[0].focus();
    divThumbnail.style.backgroundImage = '';
    tblBooks.querySelectorAll("tr").forEach(elm => elm.classList.remove('selected'));
    btnRemove.click();
    btnSave.innerText = 'SAVE';
});

frmBook.addEventListener('submit', (e) => {
    e.preventDefault();

    if (btnSave.innerText === 'EDIT') {
        setEnableForm();
        btnSave.innerText = 'SAVE';
        btnRemove.disabled = !divThumbnail.style.backgroundImage;
        return;
    }

    const inputElms = [txtISBN, txtName, txtAuthor];
    const invalidInputElms = inputElms.filter(elm => !elm.classList.contains('is-valid'));

    if (invalidInputElms.length > 0) {
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
let activePage = 1;

initPagination();

function initPagination(page: number = 1) {
    let pages = Math.ceil(booksCount / pageSize);
    if (page < 1 || page > pages) page = pages;
    activePage = page;
    let end = page + 4;
    let start = page - 5;
    if (end > pages) {
        start -= (end - pages);
        end = pages;
    }
    if (start < 1) {
        end += (1 - start);
        if (end > pages) end = pages;
        start = 1;
    }

    let html = `<li class="page-item ${activePage === 1 ? 'disabled' : ''}"><a class="page-link" href="javascript:void(0)">&laquo;</a></li>`;
    for (let i = start; i <= end; i++) {
        html += `<li class="page-item ${i === page ? 'active' : ''}"><a class="page-link" href="javascript:void(0)">${i}</a></li>`
    }
    html += `<li class="page-item ${activePage === pages ? 'disabled' : ''}"><a class="page-link" href="javascript:void(0)">&raquo;</a></li>`;
    paginationElm.innerHTML = html;
}

paginationElm.addEventListener('click', (e) => {
    let elm = (e.target as HTMLElement);
    if (elm.tagName === 'A') {
        if (elm.innerText === '«') {
            initPagination(--activePage);
        } else if (elm.innerText === '»') {
            initPagination(++activePage);
        } else {
            initPagination(+elm.innerText);
        }
        e.stopPropagation();
    }
});

const tblBooks = document.querySelector<HTMLTableElement>("table")!;

tblBooks.querySelector("tbody")!.addEventListener('click', (e) => {
    const row = (e.target as HTMLElement).closest<HTMLTableRowElement>('tr')!;
    tblBooks.querySelectorAll("tr").forEach(elm => elm.classList.remove('selected'));
    row.classList.add('selected');
    const isbn = row.querySelector<HTMLDivElement>(".isbn")!.innerText.replace('ISBN: ', '').trim();
    const name = row.querySelector<HTMLDivElement>(".book-name")!.innerText;
    const author = row.querySelector<HTMLDivElement>(".book-author")!.innerText;
    const bookPreview = row.querySelector<HTMLDivElement>('.book-preview')!;

    txtISBN.value = isbn;

    txtISBN.classList.add('is-valid');
    txtName.classList.add('is-valid');
    txtAuthor.classList.add('is-valid');

    txtName.value = name;
    txtAuthor.value = author;
    divThumbnail.style.backgroundImage = bookPreview.style.backgroundImage;
    setEnableForm(false);
    btnSave.disabled = false;
    btnClear.disabled = false;
    btnSave.innerText = 'EDIT';
});

tblBooks.querySelector("tbody")!.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).classList.contains('trash') ||
        (e.target as HTMLElement).classList.contains('fa-trash')) {
        e.stopPropagation();
        const elm = e.target as HTMLElement;
        const row = elm.closest<HTMLTableRowElement>('tr')!;
        const isbn = (row.querySelector<HTMLDivElement>(".isbn")!.innerText);
        const promise = Swal.fire({
            title: 'Confirm?',
            text: `Are you sure to delete the ${isbn}?`,
            icon: 'question',
            confirmButtonText: 'Yes',
            denyButtonText: 'No',
            showDenyButton: true
        }) as Promise<any>;
        promise.then((resolve) => {
            if (resolve.isConfirmed) {
                frmBook.reset();
                row.remove();
            }
        });
    }
});

declare const Swal: any;

const myPromise = sendHttpRequest("GET", 'http://localhost:8080/library/v2/books');

myPromise.then((data)=>{
    console.log('Success', data.status, data.body);
});
myPromise.catch((err)=> {
    console.log('Catch an error', err.status, err.body);
});

function sendHttpRequest(httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD',
                         url: string,
                         headers: Array<{ name: string, value: string }> = [],
                         body: string | FormData | null = null) {
    return new Promise<{status: number, body: string, http: XMLHttpRequest}>((resolve, reject)=> {
        const http = new XMLHttpRequest();

        http.onreadystatechange = () => {
            if (http.readyState === http.DONE) {
                if (http.status >= 200  && http.status <= 299){
                    resolve({
                        status: +http.status,
                        body: http.responseText,
                        http: http
                    });
                }else{
                    reject({
                        status: +http.status,
                        body: http.responseText,
                        http: http
                    });
                }
            }
        };

        http.open(httpMethod, url, true);

        headers.forEach(header => http.setRequestHeader(header.name, header.value));

        http.send(body);
    });
}
