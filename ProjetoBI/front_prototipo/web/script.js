// Elementos do DOM
const cameraInput = document.getElementById('cameraInput');
const photoContainer = document.getElementById('photoContainer');
const noPhotoContent = document.getElementById('noPhotoContent');
const photoPreview = document.getElementById('photoPreview');
const capturedImage = document.getElementById('capturedImage');
const locationStatus = document.getElementById('locationStatus');
const locationLoading = document.getElementById('locationLoading');
const locationSuccess = document.getElementById('locationSuccess');
const locationError = document.getElementById('locationError');
const locationAccuracy = document.getElementById('locationAccuracy');
const accuracyValue = document.getElementById('accuracyValue');
const submitButton = document.getElementById('submitButton');
const submitText = document.getElementById('submitText');
const submitLoader = document.getElementById('submitLoader');
const successNotification = document.getElementById('successNotification');
const reportForm = document.getElementById('reportForm');

// Estado da aplicação
let currentPhoto = null;
let currentLocation = null;
let isLoadingLocation = false;
let isSubmitting = false;

// Função para obter a localização
function getLocation() {
  if (!('geolocation' in navigator)) {
    showLocationError('Seu navegador não suporta geolocalização.');
    return;
  }

  isLoadingLocation = true;
  updateLocationUI();

  const geoOptions = {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 0,
  };

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      currentLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      };
      isLoadingLocation = false;
      updateLocationUI();
      navigator.geolocation.clearWatch(watchId);
    },
    (error) => {
      console.error('Erro ao obter localização:', error);
      showLocationError(
        error.code === 1
          ? 'Por favor, permita o acesso à localização.'
          : 'Erro ao obter localização. Tente novamente.'
      );
      isLoadingLocation = false;
      currentLocation = null;
      updateLocationUI();
    },
    geoOptions
  );
}

// Função para atualizar a UI da localização
function updateLocationUI() {
  locationStatus.classList.remove('hidden');
  locationLoading.classList.toggle('hidden', !isLoadingLocation);
  locationSuccess.classList.toggle('hidden', !currentLocation || isLoadingLocation);
  locationError.classList.toggle('hidden', currentLocation || isLoadingLocation);
  locationAccuracy.classList.toggle('hidden', !currentLocation);

  if (currentLocation) {
    accuracyValue.textContent = Math.round(currentLocation.accuracy);
  }

  updateSubmitButton();
}

// Função para mostrar erro de localização
function showLocationError(message) {
  locationError.textContent = message;
  locationError.classList.remove('hidden');
  locationSuccess.classList.add('hidden');
  locationAccuracy.classList.add('hidden');
}

// Função para atualizar o estado do botão de envio
function updateSubmitButton() {
  submitButton.disabled = !currentPhoto || !currentLocation || isLoadingLocation || isSubmitting;
}

// Função para mostrar a notificação de sucesso
function showSuccessNotification() {
  successNotification.classList.remove('hidden');
  setTimeout(() => {
    successNotification.classList.add('hidden');
  }, 2000);
}

// Função para resetar o formulário
function resetForm() {
  currentPhoto = null;
  photoPreview.classList.add('hidden');
  noPhotoContent.classList.remove('hidden');
  capturedImage.src = '';
  document.getElementById('description').value = '';
}

// Event listener para captura de foto
cameraInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      currentPhoto = reader.result;
      capturedImage.src = currentPhoto;
      photoPreview.classList.remove('hidden');
      noPhotoContent.classList.add('hidden');
      updateSubmitButton();
    };
    reader.readAsDataURL(file);
  }
});

// Event listener para envio do formulário
reportForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!currentLocation) {
    showLocationError('Aguarde a obtenção da localização ou ative-a no seu dispositivo.');
    return;
  }

  if (!currentPhoto) {
    showLocationError('Por favor, selecione uma foto.');
    return;
  }

  isSubmitting = true;
  submitButton.disabled = true;
  submitText.textContent = 'Enviando...';
  submitLoader.classList.remove('hidden');

  try {
    const payload = {
      image: currentPhoto.split(',')[1],
      description: document.getElementById('description').value,
      timestamp: new Date().toISOString(),
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      accuracy: currentLocation.accuracy || '',
      userAgent: navigator.userAgent
    };

    const response = await fetch(
      'https://vish-n8n.qglaox.easypanel.host/webhook-test/2f0fa8e9-8617-409e-9cd9-7e10886bd0db',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error('Erro ao enviar o formulário');
    }

    showSuccessNotification();
    resetForm();
  } catch (error) {
    console.error('Erro ao enviar o formulário:', error);
    showLocationError('Erro ao enviar o formulário. Tente novamente.');
  } finally {
    isSubmitting = false;
    submitButton.disabled = false;
    submitText.textContent = 'Enviar Reporte';
    submitLoader.classList.add('hidden');
    updateSubmitButton();
  }
});

// Iniciar a obtenção da localização
getLocation();