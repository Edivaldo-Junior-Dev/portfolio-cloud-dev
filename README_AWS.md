
# Portfólio CloudDev - Manual de Deploy AWS (S3)

**Status:** Pronto para Produção (Static)
**Arquiteto:** Edivaldo Junior

Este documento guia o processo de publicação manual na AWS S3.

---

## 🛠️ Pré-requisitos (Antes de começar)

Para gerar o site no seu computador, você precisa das ferramentas básicas de desenvolvimento web:

1. **Node.js instalado:**
   * O erro `npm não é reconhecido` acontece se você não tiver isso.
   * Baixe e instale a versão **LTS** aqui: [https://nodejs.org/](https://nodejs.org/)
   * **Dica:** Após instalar, feche e abra o VSCode novamente.

---

## 🚀 Fase 1: Build (Gerar a pasta DIST)

O navegador não entende React/TypeScript nativamente. Precisamos "compilar" o projeto.

1. **Abra o Terminal** na pasta do projeto.
2. **Instale as dependências (Apenas na 1ª vez):**
   ```bash
   npm install
   ```
   *(Aguarde terminar. Uma pasta `node_modules` vai aparecer)*.

3. **Gere o site final:**
   ```bash
   npm run build
   ```

4. **Verifique:** Uma pasta chamada `dist` aparecerá na raiz.
   * Conteúdo esperado: `index.html`, pasta `assets/`, `vite.svg`, etc.
   * **IMPORTANTE:** São *estes* arquivos (o conteúdo da pasta dist) que subirão para a nuvem.

---

## ☁️ Fase 2: Infraestrutura AWS (Console)

### 1. Criar o Bucket (Armazenamento)
1. Acesse o Console AWS -> Serviço **S3**.
2. Clique **Create bucket**.
3. **Bucket name:** `portfolio-cloud-[seu-nome]-2025` (deve ser único globalmente).
4. **Block Public Access:**
   * [ ] Block all public access (**DESMARCAR**)
   * [x] I acknowledge that... (**MARCAR O AVISO**)
5. Clique **Create bucket**.

### 2. Upload dos Arquivos
1. Entre no bucket criado.
2. Clique em **Upload**.
3. Selecione ou arraste **todo o conteúdo DE DENTRO** da pasta `dist`.
   * **NÃO ARRASTE** a pasta `dist` fechada. Abra ela e arraste os arquivos (`index.html`, `assets`, etc).
   * O `index.html` deve ficar solto na raiz do bucket.
4. Clique no botão laranja **Upload**.

### 3. Configurar Hospedagem Estática
1. Vá na aba **Properties**.
2. Role até o final: "Static website hosting".
3. Clique **Edit** -> Selecione **Enable**.
4. **Index document:** `index.html`
5. **Error document:** `index.html` (Essencial para React Router).
6. Clique **Save changes**.
7. *Copie a URL que apareceu lá no final (Bucket website endpoint).*

### 4. Permissões de Leitura (Bucket Policy)
1. Vá na aba **Permissions**.
2. Em "Bucket policy", clique **Edit**.
3. Cole o JSON abaixo (Substitua `NOME-DO-SEU-BUCKET`):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::NOME-DO-SEU-BUCKET/*"
        }
    ]
}
```
4. Clique **Save changes**.

---

## ✅ Conclusão

Seu site está online! Acesse o link gerado no Passo 3.7.
