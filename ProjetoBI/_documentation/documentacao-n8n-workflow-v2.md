# Documentação do Workflow - Sistema Vish de Reporte de Problemas Urbanos (v2)

## Visão Geral do Sistema

O sistema "Vish - Reporte Problemas Urbanos" é uma solução integrada que permite aos cidadãos reportarem problemas urbanos através de um frontend em React. O sistema processa e analisa os dados recebidos utilizando um workflow sofisticado no n8n, combinando várias tecnologias para garantir uma análise precisa e armazenamento eficiente dos dados.

## Estrutura do Frontend

### Endpoint de Comunicação
- URL do Webhook: `https://vish-n8n.qglaox.easypanel.host/webhook-test/2f0fa8e9-8617-409e-9cd9-7e10886bd0db`
- Método: POST
- Formato dos dados: JSON

### Dados Enviados
- Imagem do problema (formato base64)
- Localização geográfica (latitude/longitude)
- Descrição opcional do problema

## Workflow n8n

### 1. Recebimento de Dados (Webhook)
**Configuração:**
- Método: POST
- Path: 2f0fa8e9-8617-409e-9cd9-7e10886bd0db

**Validações:**
- Formato dos dados
- Presença dos campos obrigatórios

### 2. Processamento de Imagem

#### Conversão de Formato
**Desafio:**
- Dados recebidos em base64
- Necessidade de processamento em formato binário

**Solução:**
- Utilização do node "Convert File" para conversão base64 → binário
- Processo inverso após edição (binário → base64)

#### Otimização de Imagem
**Configurações:**
- Redimensionamento para dimensões padronizadas
- Otimização de qualidade

### 3. Análise de IA

**Modelo:**
- GPT-4o-mini

**Estruturação do Output:**
- Implementação do node "Output Parser"
- Formato predefinido para respostas da IA
- Tratamento de inconsistências

**Categorias Analisadas:**
- Buraco na calçada
- Buraco na rua
- Lixo a céu aberto
- Fio pendurado
- Carro estacionado incorretamente

### 4. Verificação de Conteúdo Impróprio

**Processo:**
1. Análise da imagem
2. Conversão para binário se necessário blur
3. Aplicação do efeito de blur
4. Reconversão para base64

### 5. Geocodificação

**Integração:**
- API: Google Maps Geocoding
- Endpoint: `https://maps.googleapis.com/maps/api/geocode/json`

**Parâmetros:**
- latlng: Coordenadas do usuário
- key: AIzaSyDbUGzSIM9GH7BvrjAva8CXPio6NTbvFBw

**Retorno:**
- Endereço formatado
- Dados geográficos adicionais

### 6. Preparação para Armazenamento

**Processamento Final:**
- Formatação dos dados
- Validação de campos
- Estruturação do JSON final

## Fluxo de Processamento

1. **Recebimento via Webhook**
   - Validação inicial dos dados
   - Extração da imagem em base64

2. **Processamento de Imagem**
   - Conversão base64 → binário
   - Otimização e redimensionamento
   - Verificação de conteúdo impróprio
   - Aplicação de blur se necessário
   - Reconversão binário → base64

3. **Análise de IA**
   - Processamento da imagem
   - Estruturação da resposta via Output Parser
   - Classificação do problema

4. **Geocodificação**
   - Conversão de coordenadas em endereço
   - Enriquecimento dos dados de localização

5. **Preparação Final**
   - Combinação de todos os dados processados
   - Validação final
   - Formatação para armazenamento

## Desafios e Soluções

### 1. Manipulação de Imagens
**Desafio:** Conversão entre formatos base64 e binário para processamento
**Solução:** Implementação do node Convert File do n8n

### 2. Consistência da IA
**Desafio:** Respostas inconsistentes e JSONs vazios
**Solução:** Implementação do Output Parser com formato predefinido

### 3. Processamento de Imagens Inadequadas
**Desafio:** Necessidade de múltiplas conversões para aplicação de blur
**Solução:** Pipeline de processamento otimizado

## Próximos Passos

1. **Finalização do Armazenamento**
   - Implementação da conexão com banco de dados
   - Validação do formato dos dados
   - Testes de integridade

2. **Otimizações**
   - Melhoria no processamento de imagens
   - Refinamento da análise da IA
   - Otimização do fluxo de dados

## Considerações de Segurança

1. **Proteção de Dados**
   - Validação de entrada
   - Sanitização de dados
   - Proteção de chaves de API

2. **Performance**
   - Otimização de processamento de imagens
   - Gerenciamento eficiente de memória
   - Cache de geocodificação

3. **Monitoramento**
   - Logs de processamento
   - Alertas de erro
   - Métricas de performance