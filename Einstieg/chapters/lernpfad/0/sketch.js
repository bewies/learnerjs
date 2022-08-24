let scrollbar;

function setup(){

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



function openPage(url){
    location.href = url;
}

