import React, { useState, useEffect } from 'react';
import { MantineProvider } from '@mantine/core';
import { Container } from '@mantine/core';
import { Title } from '@mantine/core';
import { TextInput } from '@mantine/core';
import { Button } from '@mantine/core';
import { Paper } from '@mantine/core';
import { Stack } from '@mantine/core';
import { Text } from '@mantine/core';
import { Box } from '@mantine/core';
import { Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import axios from 'axios';
import '@mantine/core/styles.css';
import './App.css';

function App() {
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const form = useForm({
    initialValues: {
      description: '',
    },
  });

  useEffect(() => {
    if ('geolocation' in navigator) {
      setIsLoadingLocation(true);
      
      // Enhanced geolocation options for higher precision
      const geoOptions = {
        enableHighAccuracy: true,  // Request high accuracy GPS data
        timeout: 10000,            // 10 second timeout
        maximumAge: 0              // Always get fresh location data
      };
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy // Store accuracy information
          });
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          alert('Por favor, ative a localização para continuar.');
          setIsLoadingLocation(false);
        },
        geoOptions // Pass the enhanced options
      );
    } else {
      alert('Seu navegador não suporta geolocalização.');
    }
  }, []);

  // Update the handleSubmit function to include accuracy information
  const handleSubmit = async (values) => {
    try {
      if (!location) {
        alert('Aguarde a obtenção da localização ou ative-a no seu dispositivo.');
        return;
      }

      if (!photoFile) {
        alert('Por favor, selecione uma foto.');
        return;
      }

      const formData = new FormData();
      formData.append('photo', photoFile);
      formData.append('description', values.description);
      formData.append('timestamp', new Date().toISOString());
      formData.append('latitude', location.latitude);
      formData.append('longitude', location.longitude);
      formData.append('accuracy', location.accuracy || '');

      await axios.post(
        'http://localhost:5678/webhook-test/2f0fa8e9-8617-409e-9cd9-7e10886bd0db',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      alert('Problema reportado com sucesso!');
      setPhoto(null);
      setPhotoFile(null);
      form.reset();
    } catch (error) {
      console.error('Erro ao enviar o formulário:', error);
      alert('Erro ao enviar o formulário. Tente novamente.');
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
          background: 'linear-gradient(135deg, var(--mantine-color-blue-0) 0%, var(--mantine-color-blue-1) 100%)',
          minHeight: '100vh',
          padding: '20px 0'
        }}
>
        <Container size="sm">
          <Paper shadow="lg" p="xl" radius="lg" style={{
            background: 'white',
            border: '1px solid #E3F2FD'
          }}>
            <Stack spacing="xl">
              <Title order={1} ta="center" style={{
                color: '#1E88E5',
                fontSize: '2.5rem',
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
              }}>
                Vish - Reporte Problemas Urbanos
              </Title>

              <Box style={{
                width: '100%',
                maxWidth: '400px',
                margin: '0 auto',
                position: 'relative'
              }}>
                {photo ? (
                  <Stack spacing="md">
                    <Paper shadow="sm" radius="md" p="xs" style={{
                      border: '2px solid #1E88E5',
                      overflow: 'hidden'
                    }}>
                      <img src={photo} alt="Captura" style={{ width: '100%', borderRadius: '8px' }} />
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
                        color="orange"
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
                      color="orange"
                      size="lg"
                      fullWidth
                      styles={{
                        root: {
                          backgroundColor: 'var(--mantine-color-orange-6)',
                          '&:hover': { backgroundColor: 'var(--mantine-color-orange-7)' }
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
                  disabled={!photo || !location || isLoadingLocation}
                  size="lg"
                  styles={{
                    root: {
                      backgroundColor: 'var(--mantine-color-blue-6)',
                      '&:hover': { backgroundColor: 'var(--mantine-color-blue-7)' },
                      '&:disabled': { backgroundColor: 'var(--mantine-color-gray-5)' }
                    }
                  }}
                >
                  {isLoadingLocation ? 'Obtendo localização...' : 'Enviar Reporte'}
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
