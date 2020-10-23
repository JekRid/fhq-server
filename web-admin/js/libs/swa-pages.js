// Framework for single web app

class SwaPage {
    constructor() {
    }
    name() {
        // nothing
        return "page";
    }

    load() {
        // nothing        
    }
};

function swaMakeId(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

class SwaPaginator {
    constructor(min, total, page_size, page_index) {
        this.min = min;
        this.total = total;
        this.page_size = page_size;
        this.page_index = page_index;
        this.randId = "swa_pg_" + swaMakeId(10);
    }

    getHtml() {
        var page_from = this.page_size * this.page_index;
        console.log("this.page_size: ", this.page_size);
        console.log("this.page_index: ", this.page_index);
        console.log("page_from: ", this.page_from);
        var to = this.page_size * (this.page_index + 1);
        if (to > this.total) {
            to = this.total;
        }
        return "<div class='swa-pg-container'>Items per page: [" + this.page_size + "] " 
            + page_from + "-" + to + " of " + this.total 
            + " <div class='swa-button' id='" + this.randId + "_prev'>Prev</div> "
            + "<div class='swa-button' id='" + this.randId + "_next'>Next</div> "
        + "</div>";
    }

    bindPrev(f) {
        document.getElementById(this.randId + "_prev").onclick = f;
    }

    bindNext(f) {
        document.getElementById(this.randId + "_next").onclick = f;
    }
}

class SwaMenu {
    constructor() {
    }

    onclick(e) {
        var page = e.target.getAttribute('page');
        var elems = document.getElementsByClassName("swa-menu");
        for(var i = 0; i < elems.length; i++) {
            elems[i].classList.remove('active');
        }
        e.target.classList.add('active');
        if (fhq.pages[page]) {
            fhq.pages[page]();
        } else {
            console.error("Swa: not found page '" + page + "'");
        }
    }

    init() {
        var elems = document.getElementsByClassName("swa-menu");
        console.log(elems);
        for(var i = 0; i < elems.length; i++) {
            console.log(elems[i]);
            elems[i].onclick = this.onclick
            var page = elems[i].getAttribute('page');
            if (fhq.containsPageParam(page)) {
                elems[i].classList.add('active');
            }
        }
    }
}

window.swaModalDialogs = []


class SwaModalDialog {
    constructor() {
        this.modalId = swaMakeId(15);
    }

    show(cnf) {
        swaModalDialogs.push(this.modalId)
        console.log(cnf)
        document.body.innerHTML += ''
            + '<div class="swa-modal-dialog" id="' + this.modalId + '">'
            + '  <div class="swa-modal-dialog-background"></div>'
            + '  <div class="swa-modal-dialog-box">'
            + '    <div class="swa-modal-dialog-box-head">'
            + '      <div class="swa-modal-dialog-box-title">' + cnf.title + '</div>'
            + '      <div class="swa-modal-dialog-box-close" onclick="closeModalDialog(\'' + this.modalId + '\')">X</div>'
            + '    </div>'
            + '    <div class="swa-modal-dialog-box-content">' + cnf.title + '</div>'
            + '  </div>'
            + '</div>';
    }
}

function closeModalDialog(modalId) {
    var newArray = []
    for (var i = 0; i < window.swaModalDialogs.length; i++) {
        var elid = window.swaModalDialogs[i];
        if (elid != modalId) {
            newArray.push(elid);
        }
    }
    window.swaModalDialogs = newArray
    console.log("Todo remove modal dialog: " + elid);
    var el = document.getElementById(modalId);
    if (!el) {
        console.warn("Modal dialog now found: " + modalId);
    } else {
        el.remove();
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    window.swaMenu = new SwaMenu();
    swaMenu.init();
});

document.addEventListener("keyup", function(event) {
    if (event.key == "Escape" && window.swaModalDialogs.length > 0) {
        var elid = window.swaModalDialogs.pop();
        closeModalDialog(elid)
        return true;
    }
});