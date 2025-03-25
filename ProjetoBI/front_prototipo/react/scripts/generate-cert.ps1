# Criar diretório para certificados se não existir
$certDir = "..\.cert"
if (-not (Test-Path $certDir)) {
    New-Item -ItemType Directory -Path $certDir
}

# Gerar chave privada e certificado auto-assinado usando OpenSSL
$openSSLCommand = @"
openssl req -x509 \
  -newkey rsa:4096 \
  -keyout $certDir\key.pem \
  -out $certDir\cert.pem \
  -days 365 \
  -nodes \
  -subj "/CN=localhost"
"@

# Executar o comando OpenSSL
Write-Host "Gerando certificados SSL..."
Invoke-Expression -Command $openSSLCommand

Write-Host "
Certificados gerados com sucesso em $certDir:"
Write-Host "- cert.pem (certificado)"
Write-Host "- key.pem (chave privada)"