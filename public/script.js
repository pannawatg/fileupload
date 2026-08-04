const fileInput = document.getElementById("fileInput");
const uploadButton = document.getElementById("UploadButton");
const statusElement = document.getElementById("status");

function updateStatus(msg){
    statusElement.textContent = msg;
}

uploadButton.addEventListener('click', function(){
    const file = fileInput.files[0];
    if(!file){
        updateStatus("Please select a file.");
        return;
    }
    updateStatus(
        `Success!
        Name: ${file.name}
        Size: ${(file.size / 1024 / 1024).toFixed(3)} MB
        Type: ${file.type || "Unknown"}`
    );
});
