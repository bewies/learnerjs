window.addEventListener("load",function(){
    setTimeout(function(){
        $all(".iv-folder, .iv-file").forEach(function(it){
            it.addEventListener('click',function(){
                this.classList.toggle("active");
            });
        });
    }, 1000);
})

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