document.addEventListener('DOMContentLoaded', () => {
    let photo = null;
    let location = null;
    let photoFile = null;
    const photoPreview = document.getElementById('photoPreview');
    const photoCapture = document.getElementById('photoCapture');
    const capturedImage = document.getElementById('capturedImage');
    const cameraInput = document.getElementById('cameraInput');
    const newPhotoBtn = document.getElementById('newPhotoBtn');
    const reportForm = document.getElementById('reportForm');
    const descriptionInput = document.getElementById('description');

    // Inicializar geolocalização
    if ('geolocation' in navigator) {
        const geoOptions = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                location = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                };
            },
            (error) => {
                console.error('Erro ao obter localização:', error);
                alert('Por favor, ative a localização para continuar.');
            },
            geoOptions
        );
    } else {
        alert('Seu navegador não suporta geolocalização.');
    }

    // Manipulador de captura de foto
    const handlePhotoCapture = (event) => {
        const file = event.target.files[0];
        if (file) {
            photoFile = file;
            const reader = new FileReader();
            reader.onloadend = () => {
                photo = reader.result;
                capturedImage.src = photo;
                photoPreview.classList.remove('hidden');
                photoCapture.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    };

    // Manipulador de nova foto
    const handleNewPhoto = () => {
        photo = null;
        photoFile = null;
        capturedImage.src = '';
        photoPreview.classList.add('hidden');
        photoCapture.style.display = 'block';
        cameraInput.value = '';
    };

    // Manipulador de envio do formulário
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            if (!location) {
                alert('Aguarde a obtenção da localização ou ative-a no seu dispositivo.');
                return;
            }

            if (!photoFile) {
                alert('Por favor, selecione uma foto.');
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(photoFile);

            const response = await new Promise((resolve, reject) => {
                reader.onload = async () => {
                    try {
                        const base64Image = reader.result.split(',')[1];
                        const payload = {
                            image: base64Image,
                            description: descriptionInput.value,
                            timestamp: new Date().toISOString(),
                            latitude: location.latitude,
                            longitude: location.longitude,
                            userAgent: navigator.userAgent
                        };

                        const res = await fetch(
                            'https://vish-n8n.qglaox.easypanel.host/webhook-test/2f0fa8e9-8617-409e-9cd9-7e10886bd0db',
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(payload)
                            }
                        );
                        resolve(res);
                    } catch (error) {
                        reject(error);
                    }
                };
                reader.onerror = () => reject(new Error('Erro ao ler o arquivo'));
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            alert('Problema reportado com sucesso!');
            handleNewPhoto();
            descriptionInput.value = '';
        } catch (error) {
            console.error('Erro ao enviar o formulário:', error);
            alert('Erro ao enviar o formulário. Tente novamente.');
        }
    };

    // Adicionar event listeners
    cameraInput.addEventListener('change', handlePhotoCapture);
    newPhotoBtn.addEventListener('click', handleNewPhoto);
    reportForm.addEventListener('submit', handleSubmit);
});