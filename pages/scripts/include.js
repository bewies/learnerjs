function $include(){
    let elements = $all("*[include]");
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        let req = new XMLHttpRequest();
        let file = element.getAttribute("include");

        req.onreadystatechange = function() {
            if (this.readyState == 4) {
              if (this.status == 200) {element.innerHTML = this.responseText;}
              if (this.status == 404) {element.innerHTML = "Page not found.";}
              /* Remove the attribute, and call this function once more: */
              element.removeAttribute("include");
              $include();
            }
          }
          req.open("GET", file, true);
          req.send();
    }
}

window.addEventListener("load",$include);