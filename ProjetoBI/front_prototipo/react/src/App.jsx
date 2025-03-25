import React, { useState, useEffect, useCallback } from 'react';
import { MantineProvider } from '@mantine/core';
import { Container, Title, TextInput, Button, Paper, Stack, Text, Box, Group, Loader, Transition } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import axios from 'axios';
import '@mantine/core/styles.css';
import './App.css';

function App() {
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, { toggle: toggleSuccess }] = useDisclosure(false);
  const form = useForm({
    initialValues: {
      description: '',
    },
  });

  const getLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setLocationError('Seu navegador não suporta geolocalização.');
      return;
    }

    setIsLoadingLocation(true);
    setLocationError(null);

    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    };

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setIsLoadingLocation(false);
        navigator.geolocation.clearWatch(watchId);
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
        setLocationError(
          error.code === 1
            ? 'Por favor, permita o acesso à localização.'
            : 'Erro ao obter localização. Tente novamente.'
        );
        setIsLoadingLocation(false);
        setLocation(null);
      },
      geoOptions
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  const handleSubmit = async (values) => {
    try {
      if (!location) {
        setLocationError('Aguarde a obtenção da localização ou ative-a no seu dispositivo.');
        return;
      }

      if (!photoFile) {
        setLocationError('Por favor, selecione uma foto.');
        return;
      }

      setIsSubmitting(true);
      
      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = () => reject(new Error('Erro ao ler o arquivo'));
        reader.readAsDataURL(photoFile);
      });

      const payload = {
        image: base64Image,
        description: values.description,
        timestamp: new Date().toISOString(),
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy || '',
        userAgent: navigator.userAgent
      };

      await axios.post(
        'https://vish-n8n.qglaox.easypanel.host/webhook-test/2f0fa8e9-8617-409e-9cd9-7e10886bd0db',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      toggleSuccess();
      setTimeout(() => {
        setPhoto(null);
        setPhotoFile(null);
        form.reset();
        toggleSuccess();
      }, 2000);
    } catch (error) {
      console.error('Erro ao enviar o formulário:', error);
      setLocationError('Erro ao enviar o formulário. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <MantineProvider>
      <Box
        style={{
          background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
          minHeight: '100vh',
          padding: '20px 0',
          transition: 'all 0.3s ease'
        }}
>
        <Container size="sm">
          <Paper shadow="lg" p="xl" radius="lg" style={{
            background: 'white',
            border: '1px solid #E3F2FD'
          }}>
            <Stack spacing="xl">
              <Title order={1} ta="center" style={{
                color: '#1565C0',
                fontSize: '2.8rem',
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                letterSpacing: '-0.5px',
                marginBottom: '1rem'
              }}>
                Vish!
              </Title>

              <Box style={{
                width: '100%',
                maxWidth: '400px',
                margin: '0 auto',
                position: 'relative'
              }}>
                <Transition mounted={showSuccess} transition="slide-up" duration={400} timingFunction="ease">
                  {(styles) => (
                    <Paper
                      shadow="sm"
                      radius="lg"
                      p="md"
                      style={{
                        ...styles,
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        textAlign: 'center',
                        position: 'fixed',
                        bottom: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 1000,
                        width: '90%',
                        maxWidth: '400px',
                        padding: '16px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <Text size="md" weight={500}>✅ Problema reportado com sucesso!</Text>
                    </Paper>
                  )}
                </Transition>

                {photo ? (
                  <Stack spacing="md">
                    <Paper shadow="md" radius="lg" p="xs" style={{
                      border: '2px solid #1565C0',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease'
                    }}>
                      <img src={photo} alt="Captura" style={{ width: '100%', borderRadius: '8px', transition: 'transform 0.3s ease' }} />
                    </Paper>
                    <Group position="center">
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handlePhotoCapture}
                        style={{ display: 'none' }}
                        id="cameraInput"
                      />
                      <Button
                        component="label"
                        htmlFor="cameraInput"
                        color="blue"
                        variant="light"
                        fullWidth
                      >
                        Tirar Nova Foto
                      </Button>
                    </Group>
                  </Stack>
                ) : (
                  <Stack spacing="md" align="center">
                    <Text size="lg" weight={500} color="dimmed" align="center">
                      Tire uma foto do problema urbano
                    </Text>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handlePhotoCapture}
                      style={{ display: 'none' }}
                      id="cameraInput"
                    />
                    <Button
                      component="label"
                      htmlFor="cameraInput"
                      color="blue"
                      size="lg"
                      fullWidth
                      styles={{
                        root: {
                          backgroundColor: 'var(--mantine-color-blue-6)',
                          '&:hover': { backgroundColor: 'var(--mantine-color-blue-7)' }
                        }
                      }}
                    >
                      Abrir Câmera
                    </Button>
                  </Stack>
                )}
              </Box>

            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack spacing="md">
                {photo && (
                  <Box>
                    <Group position="center" spacing="xs">
                      {isLoadingLocation ? (
                        <Group spacing="xs">
                          <Loader size="sm" color="blue" />
                          <Text size="sm" color="dimmed">Obtendo localização...</Text>
                        </Group>
                      ) : location ? (
                        <Text
                          size="sm"
                          align="center"
                          style={{
                            color: '#2E7D32',
                            fontWeight: 500,
                            padding: '8px 16px',
                            borderRadius: '20px',
                            backgroundColor: 'rgba(76, 175, 80, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          <span style={{ fontSize: '16px' }}>📍</span>
                          Localização obtida com sucesso
                        </Text>
                      ) : (
                        <Text
                          size="sm"
                          color="red"
                          align="center"
                          style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            backgroundColor: 'rgba(244, 67, 54, 0.1)'
                          }}
                        >
                          {locationError || 'Erro ao obter localização'}
                        </Text>
                      )}
                    </Group>
                    {location && (
                      <Text size="xs" color="dimmed" align="center" mt="xs">
                        Precisão: {Math.round(location.accuracy)}m
                      </Text>
                    )}
                  </Box>
                )}

                <TextInput
                  label="Descrição do Problema (opcional)"
                  placeholder="Descreva o problema urbano que você encontrou"
                  {...form.getInputProps('description')}
                  labelProps={{
                    style: {
                      color: '#1E88E5',
                      fontWeight: 500
                    }
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  disabled={!photo || !location || isLoadingLocation || isSubmitting}
                  size="lg"
                  styles={{
                    root: {
                      backgroundColor: '#1565C0',
                      '&:hover': { backgroundColor: '#0D47A1' },
                      '&:disabled': { backgroundColor: '#90CAF9' },
                      cursor: (!photo || !location || isLoadingLocation || isSubmitting) ? 'not-allowed' : 'pointer',
                      touchAction: 'manipulation',
                      transition: 'all 0.3s ease',
                      transform: isSubmitting ? 'scale(0.98)' : 'scale(1)'
                    }
                  }}
                >
                  {isSubmitting ? (
                    <Group spacing="xs" position="center">
                      <Loader color="white" size="sm" />
                      <span>Enviando...</span>
                    </Group>
                  ) : isLoadingLocation ? (
                    'Obtendo localização...'
                  ) : (
                    'Enviar Reporte'
                  )}
                </Button>
              </Stack>
            </form>
          </Stack>
        </Paper>
      </Container>
    </Box>
    </MantineProvider>
  );
}

export default App;
