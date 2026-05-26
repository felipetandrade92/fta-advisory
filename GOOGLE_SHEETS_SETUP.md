# Como configurar o Google Sheets como banco de dados

## Passo 1: Criar a planilha
1. Acesse https://sheets.google.com
2. Crie uma planilha nova chamada "FTA Advisory - Leads"
3. Na primeira linha, coloque estes cabeçalhos:
   - A1: Data
   - B1: Servico
   - C1: Nome
   - D1: Email
   - E1: Telefone
   - F1: CPF
   - G1: Profissao
   - H1: Renda
   - I1: Patrimonio
   - J1: Estado Civil
   - K1: Dependentes
   - L1: Objetivo

## Passo 2: Criar o Apps Script
1. Na planilha, vá em Extensoes > Apps Script
2. Apague tudo e cole o codigo abaixo:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    data.data,
    data.servico,
    data.nome,
    data.email,
    data.telefone,
    data.cpf,
    data.profissao,
    data.renda,
    data.patrimonio,
    data.estadoCivil,
    data.dependentes,
    data.objetivo
  ]);
  
  return ContentService
    .createTextOutput(JSON.stringify({result: 'success'}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Clique em Salvar (Ctrl+S)
4. Clique em Implantar > Nova implantacao
5. Em "Tipo", selecione "App da Web"
6. Em "Executar como", selecione "Eu"
7. Em "Quem tem acesso", selecione "Qualquer pessoa"
8. Clique em Implantar
9. Copie a URL que aparece

## Passo 3: Colar a URL no site
1. Abra o arquivo script.js
2. Na linha 3, substitua 'SUA_URL_DO_GOOGLE_APPS_SCRIPT_AQUI' pela URL copiada
3. Salve e faca push para o GitHub

Pronto! Cada formulario preenchido no site vai criar uma linha na planilha.
