const fileInput = document.getElementById("fileInput");
const uploadButton = document.getElementById("UploadButton");
const statusElement = document.getElementById("status");
const inputToken = document.getElementById("inputToken");

const workerURL = "https://fileupload-backend.nathapol971.workers.dev";

function updateStatus(msg){
    statusElement.textContent = msg;
}

uploadButton.addEventListener('click', async function(){
    const file = fileInput.files[0];
    
    if(!inputToken.value.trim()){
        updateStatus("Enter your token.");
        return;
    }
    if(!file){
        updateStatus("Please select a file.");
        return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("token", inputToken.value.trim());
    updateStatus("Uploading...");
    uploadButton.disabled = true;
    try{
        const response = await fetch(workerURL, {
            method: "POST",
            body: formData,
        })
        const result = await response.json();
        if(!response.ok) throw new Error(result.error);
        updateStatus(`Recieved: ${result.name}, ${(result.size / 1024 / 1024).toFixed(3)} MB, ${result.type}`);
    }catch(error){
        updateStatus(`Error: ${error.message}`);
    }finally{
        uploadButton.disabled = false;
    }
});
