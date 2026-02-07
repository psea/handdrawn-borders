const btnText = ["and me", "not me!", "here!"];
function addButton() {
    const btn = document.createElement("button");
    btn.textContent = btnText.pop() ?? "me too"
    document.body.appendChild(btn);
}

function main() {
    createBtn = document.querySelector("#createBtn");
    createBtn.addEventListener("click", addButton)
}

document.addEventListener("DOMContentLoaded", function () {
    main();
});
