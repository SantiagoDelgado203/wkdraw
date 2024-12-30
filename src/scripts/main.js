document.getElementById("drawCanvas").width = parseInt(getComputedStyle(document.getElementById("drawCanvas")).getPropertyValue("width"))
document.getElementById("drawCanvas").height = parseInt(getComputedStyle(document.getElementById("drawCanvas")).getPropertyValue("height"))
KanjiCanvas.init('drawCanvas');
document.getElementById("clearCanvas").addEventListener("click", () => {
KanjiCanvas.erase('drawCanvas');
});
document.getElementById("undoLast").addEventListener("click", () => {
KanjiCanvas.deleteLast('drawCanvas');
});