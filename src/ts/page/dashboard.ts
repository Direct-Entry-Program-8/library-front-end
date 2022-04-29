const MEMBERS_API_URL = `${process.env.API_URL}/members`;
const BOOKS_API_URL = `${process.env.API_URL}/v2/books`;
const ISSUES_API_URL = `${process.env.API_URL}/issues`;
const RETURNS_API_URL = `${process.env.API_URL}/returns`;

sendHttpRequest(MEMBERS_API_URL, (count) => {
    document.querySelector<HTMLSpanElement>('#spn-total-members')!.innerText = count ;
});
sendHttpRequest(BOOKS_API_URL, (count) => {
    document.querySelector<HTMLSpanElement>('#spn-total-books')!.innerText = count;
});

// sendHttpRequest(ISSUES_API_URL, (response) => {console.log(response)});
// sendHttpRequest(RETURNS_API_URL, (response) => {console.log(response)});

function sendHttpRequest(url: string,
                         successFn: (count: string)=> void,
                         errorFn?: (status: number) => void): void{
    const http = new XMLHttpRequest();

    http.onreadystatechange = ()=>{
      if (http.readyState === http.DONE){
          if (http.status === 200){
              successFn(http.getResponseHeader('X-Count')!);
          }else{
              if (errorFn) errorFn(http.status);
          }
      }
    };

    http.open('HEAD', url, false);

    http.send();
}