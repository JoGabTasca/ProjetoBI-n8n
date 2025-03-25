# Vish - Sistema de Reporte de Problemas Urbanos

## Sobre o Projeto

O Vish é uma solução inovadora que permite aos cidadãos reportarem problemas urbanos de forma eficiente e intuitiva. Através de uma interface moderna em React, os usuários podem registrar ocorrências urbanas com fotos, localização geográfica e descrições, contribuindo para a melhoria da cidade.

## Principais Funcionalidades

- Captura de imagens dos problemas urbanos
- Geolocalização automática (latitude/longitude)
- Interface intuitiva para descrição dos problemas
- Processamento inteligente com IA para classificação dos problemas
- Armazenamento estruturado em banco de dados PostgreSQL

## Arquitetura do Sistema

O sistema é composto por três componentes principais:

1. **Frontend React**: Interface do usuário desenvolvida com React + Vite
2. **Workflow n8n**: Processamento e enriquecimento dos dados com IA
3. **Banco de Dados**: Armazenamento em PostgreSQL

## Requisitos do Sistema

- Node.js (versão recomendada: 18+)
- npm ou yarn
- Acesso ao serviço n8n
- Banco de dados PostgreSQL

## Configuração do Ambiente de Desenvolvimento

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Tecnologias Utilizadas

- React + Vite (Frontend)
- n8n (Workflow e Automação)
- Inteligência Artificial para classificação
- PostgreSQL (Banco de Dados)
- ESLint (Qualidade de código)

## Plugins e Extensões

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc)

## Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Faça commit das mudanças
4. Envie um pull request

## Desenvolvimento

Para desenvolvimento com TypeScript e regras de lint mais rigorosas, consulte o [template TS](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) para integração com [`typescript-eslint`](https://typescript-eslint.io).
