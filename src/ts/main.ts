let navItemList = document.querySelectorAll(".sidebar .nav-item");

switch(window.location.pathname){
    case "/": case "/index.html":
        navItemList.item(0).querySelector(".nav-link")!.classList.add('active');
        break;
    case "/manage-books.html":
        navItemList.item(1).querySelector(".nav-link")!.classList.add('active');
        break;
    case "/manage-members.html":
        navItemList.item(2).querySelector(".nav-link")!.classList.add('active');
        break;
    case "/issue-books.html":
        navItemList.item(3).querySelector(".nav-link")!.classList.add('active');
        break;
    case "/return-books.html":
        navItemList.item(4).querySelector(".nav-link")!.classList.add('active');
        break;
    default:
        navItemList.item(5).querySelector(".nav-link")!.classList.add('active');
        break;
}

for (const navItem of navItemList) {
    navItem.addEventListener('click', navItemListener);
}


function navItemListener(this: HTMLLIElement){
    switch (this.querySelector<HTMLParagraphElement>(".nav-link p")!.innerText){
        case "Dashboard":
            window.location.replace('index.html');
            break;
        case "Manage Books":
            window.location.replace('manage-books.html');
            break;
        case "Manage Members":
            window.location.replace('manage-members.html');
            break;
        case "Issue Books":
            window.location.replace('issue-books.html');
            break;
        case "Manage Returns":
            window.location.replace('manage-returns.html');
            break;
        default:
            window.location.replace('settings.html');
    }
}