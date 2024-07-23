document.getElementById('upload-btn').addEventListener('click', () => {
    document.getElementById('upload').click();
});

document.getElementById('upload').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('original-image').src = e.target.result;
            removeBackground(e.target.result);
        };
        reader.readAsDataURL(file);
    }
});

function updateProgressBar(percent) {
    const progressBar = document.getElementById('progress');
    progressBar.style.width = percent + '%';
    progressBar.textContent = percent + '%';
}

function removeBackground(imageData) {
    updateProgressBar(10);
    
    fetch('/remove-bg', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: imageData })
    })
    .then(response => response.json())
    .then(data => {
        if (data.result) {
            document.getElementById('removed-bg-image').src = data.result;
            updateProgressBar(100);
        } else {
            console.error(data.error);
            updateProgressBar(0);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        updateProgressBar(0);
    });
}


function downloadImage() {
    // Asumiendo que la URL de la imagen con el fondo borrado está disponible en el backend
    const imageUrl = document.getElementById('removed-bg-image').src;
    
    if (imageUrl && imageUrl !== "#") {
        const a = document.createElement('a');
        a.href = imageUrl;
        a.download = 'DRAGOAI_REMOVE.jpg'; // Nombre de archivo predeterminado
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else {
        alert('No hay imagen para descargar.');
    }
}

