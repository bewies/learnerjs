window.addEventListener('load', function(){
    // Scrollengine
    scrollbar = $(".scroll-bar");
    window.addEventListener('scroll',updateScrollbar);
    
    if (typeof setup === "function") {
        setup();
    }

    $all("code").forEach(function(it){
        it.innerHTML = it.innerHTML.trim();
    })
});

function updateScrollbar(){
    let width = ((window.scrollY) / (document.body.scrollHeight - window.innerHeight) )*100;
    scrollbar.style.paddingRight = width+"%";
}

function $(sel, parent = document) {
    return parent.querySelector(sel);
}

function $all(sel, parent = document) {
    return parent.querySelectorAll(sel);
}

function shiftString(a,i){
    let res = "";
    for (let k = 0; k < a.length; k++) {
        if (i != k) {
            res += a[k];  
        }
    }
    return res;
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
  }