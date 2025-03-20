# Documentação do Workflow - Sistema Vish de Reporte de Problemas Urbanos

## Visão Geral do Sistema

O sistema "Vish - Reporte Problemas Urbanos" permite que cidadãos reportem problemas urbanos através de um aplicativo React, capturando:
- Imagens do problema
- Localização geográfica (latitude/longitude)
- Descrição opcional do problema

Estes dados são processados por um fluxo de trabalho no n8n que utiliza inteligência artificial para classificar o problema, enriquecer os dados e armazená-los em um banco de dados PostgreSQL.

## Estrutura do Workflow no n8n

### 1. Nó de Webhook
**Função:** Recebe os dados enviados pelo aplicativo React.

**Configuração:**
- Método: POST
- Path: 2f0fa8e9-8617-409e-9cd9-7e10886bd0db

**Dados recebidos:**
- Imagem do problema
- Latitude e longitude
- Descrição (opcional)

### 2. Nó de Otimização de Imagem
**Função:** Redimensiona a imagem para um tamanho adequado.

**Configuração:**
- Operação: Resize
- Largura: 800px
- Altura: 600px

**Por que usar:**
- Reduz o tamanho do arquivo
- Melhora o desempenho do processamento
- Padroniza as dimensões das imagens

### 3. Nó de Análise de IA (GPT-4)
**Função:** Analisa a imagem para identificar e classificar o problema urbano.

**Configuração:**
- Modelo: GPT-4
- Prompt: Especialista em análise de problemas urbanos

**Categorias analisadas:**
- Buraco na calçada
- Buraco na rua
- Lixo a céu aberto
- Fio pendurado
- Carro estacionado incorretamente

**Análise adicional:**
- Descrição detalhada do problema
- Avaliação da gravidade
- Verificação de conteúdo impróprio

### 4. Nó de Verificação de Imagem Imprópria
**Função:** Verifica se a imagem contém conteúdo impróprio.

**Ações:**
- Se imagem imprópria: Aplica blur na imagem
- Se imagem apropriada: Mantém a imagem original

### 5. Nó de Geocodificação (Google Maps)
**Função:** Converte coordenadas em endereço.

**Configuração:**
- API: Google Maps Geocoding
- Input: Latitude e longitude
- Output: Endereço formatado

### 6. Nó de Mesclagem de Dados
**Função:** Combina todas as informações processadas.

**Dados combinados:**
- Imagem processada
- Descrição da IA
- Endereço formatado

### 7. Nó de Armazenamento PostgreSQL
**Função:** Armazena os dados processados no banco de dados.

**Dados armazenados:**
- Imagem (processada)
- Descrição do problema
- Classificação
- Gravidade
- Endereço
- Coordenadas geográficas
- Timestamp

## Fluxo de Dados

1. **Recebimento dos Dados**
   - Webhook recebe POST com imagem e localização
   - Dados são validados

2. **Processamento de Imagem**
   - Imagem é otimizada
   - IA analisa e classifica o problema
   - Verificação de conteúdo impróprio

3. **Enriquecimento de Dados**
   - Coordenadas são convertidas em endereço
   - Dados são combinados

4. **Armazenamento**
   - Todos os dados são salvos no PostgreSQL

## Considerações de Segurança

1. **Proteção de Dados**
   - Verificação de conteúdo impróprio
   - Sanitização de dados de entrada
   - Proteção de chaves de API

2. **Otimização**
   - Redimensionamento de imagens
   - Processamento eficiente
   - Validação de dados

3. **Manutenção**
   - Monitoramento de erros
   - Backup de dados
   - Atualização de APIs