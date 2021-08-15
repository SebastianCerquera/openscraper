
window.require = function(name){
    return window[name.replace("./","").replace(".js", "")]
}
