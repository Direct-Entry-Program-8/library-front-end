const btnNewBook = document.querySelector<HTMLButtonElement>('#btn-new-book')!;
const frmBook = document.querySelector<HTMLFormElement>('#frm-book')!;
const txtISBN = document.querySelector<HTMLInputElement>('#txt-isbn')!;
const txtName = document.querySelector<HTMLInputElement>('#txt-name')!;
const txtAuthor = document.querySelector<HTMLInputElement>('#txt-author')!;
const btnBrowse = document.querySelector<HTMLButtonElement>('#btn-browse')!;
const txtPreview = document.querySelector<HTMLInputElement>('#txt-preview')!;

btnBrowse.addEventListener('click', ()=> txtPreview.click());

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
    txtISBN.focus();
});

function checkValidityOfISBN(){
    return /^\d+$/.test(txtISBN.value);
}

function checkValidityOfName(){
    return /^.+$/.test(txtName.value);
}

function checkValidityOfAuthor(){
    return /^[A-Za-z ]+$/.test(txtAuthor.value);
}

txtISBN.addEventListener('input', checkValidity);
txtName.addEventListener('input', checkValidity);
txtAuthor.addEventListener('input', checkValidity);

function checkValidity(e: Event){
    (e.target as HTMLInputElement).classList.remove('is-valid', 'is-invalid');
    if(e.target === txtISBN){
        checkValidityOfISBN()? txtISBN.classList.add('is-valid'): txtISBN.classList.add('is-invalid');
    }else if (e.target === txtName){
        checkValidityOfName()? txtName.classList.add('is-valid'): txtName.classList.add('is-invalid');
    }else{
        checkValidityOfAuthor()? txtAuthor.classList.add('is-valid'): txtAuthor.classList.add('is-invalid');
    }
}

