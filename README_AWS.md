
# Portfólio CloudDev - Manual de Deploy AWS (S3)

**Status:** Pronto para Produção (Static)
**Arquiteto:** Edivaldo Junior

Este documento guia o processo de publicação manual na AWS S3.

---

## 🚨 CORREÇÃO DE ERROS (Leia Primeiro)

Se o seu VSCode ou Terminal apresentarem erros, instale as ferramentas abaixo e reinicie o computador.

### 1. Erro: "O termo 'npm' não é reconhecido"
*   **Causa:** Falta o Node.js.
*   **Solução:** Baixe e instale a versão **LTS**: [https://nodejs.org/](https://nodejs.org/)

### 2. Erro: "Unable to find git" ou "Não sincroniza com GitHub"
*   **Causa:** Falta o Git no Windows.
*   **Solução:** Baixe e instale o Git for Windows: [https://git-scm.com/download/win](https://git-scm.com/download/win)

### 3. Erro: "A execução de scripts foi desabilitada" (PowerShell)
*   **Causa:** Bloqueio de segurança padrão do Windows.
*   **Solução:** Digite este comando no terminal e aceite (S):
    ```powershell
    Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
    ```

---

## 🚀 Fase 1: Build (Gerar a pasta DIST)

1. **Abra o Terminal** na pasta do projeto.
2. **Instale as dependências (Apenas na 1ª vez):**
   ```bash
   npm install
   ```
3. **Gere o site final:**
   ```bash
   npm run build
   ```
4. **Verifique:** Uma pasta chamada `dist` aparecerá na raiz.

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

Seu site está online! Acesse o link gerado no Passo 3.
