let scrollbar;

function setup(){

    // Scrollengine
    scrollbar = $(".scroll-bar");
    window.addEventListener('scroll',updateScrollbar);

    // activate div-buttons
    $all(".btn").forEach(function(it){
        const href = it.getAttribute('href');
        if(typeof href != "undefined"){
            it.addEventListener('click', function(){
                openPage(this.getAttribute("href"));
            });
        }
    });
}

function updateScrollbar(){
    let width = ((window.scrollY) / (document.body.scrollHeight - window.innerHeight) )*100;
    scrollbar.style.paddingRight = width+"%";
}

function openPage(url){
    location.href = url;
}

function iv(mode="toggle"){
    switch (mode) {
        case "open":
            $("body").classList.add("ivActive");
            break;
        case "close":
            $("body").classList.remove("ivActive");
            break;
        default:
            $("body").classList.toggle("ivActive");
            break;
    }
}