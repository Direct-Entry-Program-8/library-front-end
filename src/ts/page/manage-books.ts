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
let activePage = 1;

initPagination();

function initPagination(page: number = 1){
    let pages = Math.ceil(booksCount / pageSize);
    if (page < 1 || page > pages ) page = pages;
    activePage = page;
    let end = page + 4;
    let start = page - 5;
    if (end > pages){
        start -= (end - pages);
        end = pages;
    }
    if (start < 1){
        end += (1 - start);
        if (end > pages) end = pages;
        start = 1;
    }

    let html = `<li class="page-item ${activePage === 1 ? 'disabled': ''}"><a class="page-link" href="javascript:void(0)">&laquo;</a></li>`;
    for (let i = start; i <= end; i++) {
        html += `<li class="page-item ${i===page?'active':''}"><a class="page-link" href="javascript:void(0)">${i}</a></li>`
    }
    html += `<li class="page-item ${activePage === pages ? 'disabled': ''}"><a class="page-link" href="javascript:void(0)">&raquo;</a></li>`;
    paginationElm.innerHTML = html;
}

paginationElm.addEventListener('click', (e)=> {
    let elm = (e.target as HTMLElement);
    if (elm.tagName === 'A'){
        if (elm.innerText === '«'){
            initPagination(--activePage);
        }else if (elm.innerText === '»'){
            initPagination(++activePage);
        }else{
            initPagination(+elm.innerText);
        }
        e.stopPropagation();
    }
});

const tblBooks = document.querySelector<HTMLTableElement>("table")!;

tblBooks.querySelector("tbody")!.addEventListener('click', (e)=>{
    if ((e.target as HTMLElement).classList.contains('trash') ||
        (e.target as HTMLElement).classList.contains('fa-trash')){
        const elm = e.target as HTMLElement;
        const row = elm.closest<HTMLTableRowElement>('tr')!;
        const isbn = (row.querySelector<HTMLDivElement>(".isbn")!.innerText);
        if (confirm(`Are you sure to delete the ${isbn}?`)){
            row.remove();
        }
    }
});

