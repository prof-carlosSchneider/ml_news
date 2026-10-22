# 🎨 Painel Administrativo ML News - Guia de Uso

## 📋 Alterações Realizadas

### 1. **Interface Administrativo (admin.html) - TOTALMENTE REDESENHADO**

✅ **Novo Design Moderno**
- Interface mais elegante e profissional
- Cores consistentes com o portal (vermelho, azul, ciano)
- Tipografia melhorada (Barlow Condensed + Inter)
- Animações e transições suaves nos botões

✅ **Melhorias na Seção de Notícias**
- Editor com **preview em tempo real** de títulos e categorias
- Dropdown de categorias pré-configuradas (Educação, Tecnologia, Cultura, Esportes, Comunidade Escolar, Projetos)
- Visualização clara do que aparecerá no portal
- Campos melhorados: título, resumo, categoria e data

✅ **Gerenciador de Imagens Aprimorado**
- Seção completa dedicada à gestão de imagens
- **Preview de imagens em tempo real** conforme você adiciona URLs
- Logo: área maior para visualizar sem cortes
- Imagens principais: hero, escola, história
- Imagens de notícias: até 6 imagens listadas
- Imagens de galeria: com categorias (Eventos, Projetos, Esportes)
- Instruções claras sobre formato e requisitos

✅ **Comunicados Melhorados**
- Seleção de tipo: Urgente, Informativo, Importante
- Interface limpa e organizada
- Melhor layout para visualização

✅ **Cardápio Semanal**
- Cada dia com seus campos: prato principal, café, almoço, lanche
- Interface expandida para melhor usabilidade
- Todos os 5 dias da semana configuráveis

✅ **Configurações Gerais e Contato**
- Campos para personalizar título, slogan e descrição
- Informações de contato: endereço, telefone, email, horário

### 2. **Tamanho da Logo no Portal (style.css)**

✅ **Aumentado de 120px para 150px de largura**
✅ **Aumentado de 110px para 140px max-width**
✅ **A nova logo NÃO será cortada**

---

## 🔐 Credenciais de Acesso

**Usuário:** `admin`  
**Senha:** `@mlnews1`

---

## 📸 Usando a Nova Logo

### Opção 1: Logo Local (Recomendado)
1. Salve a imagem do peixe/ML como `logo-ml-news.png` na pasta raiz do projeto (mesma pasta que index.html)
2. No painel administrativo, deixe o campo de logo como: `logo-ml-news.png`
3. Clique em "Salvar Todas as Alterações"
4. A logo aparecerá sem cortes, pois aumentamos o espaço para ela

### Opção 2: Logo Online
1. Faça upload da imagem para um serviço como Imgur ou tinypng
2. Copie o URL completo (exemplo: `https://imgur.com/xxxxx.png`)
3. No campo de URL da logo, cole: `https://seu-url-da-logo.com/logo.png`
4. Você verá o preview em tempo real

---

## 🎯 Principais Recursos do Novo Painel

### 📰 Notícias
- **3 slots de notícias** configuráveis
- **Preview em tempo real** - veja exatamente como aparecerá no portal
- Títulos e resumos podem ter qualquer tamanho
- Categorias pré-definidas para consistência

### 🖼️ Imagens
- **Logo:** Agora com espaço maior (150x70px)
- **Hero:** Imagem de fundo da seção principal
- **Escola:** Foto que aparece na notícia destaque
- **História:** Imagem para a seção histórica
- **Notícias:** Até 6 URLs de imagens alternadas nas notícias
- **Galeria:** Imagens organizadas por categoria

#### Preview de Imagens
Conforme você edita as URLs, você vê o preview em tempo real:
- ✅ Se a imagem carregar → preview aparece
- ❌ Se der erro → mensagem de erro clara
- Imagens escalam automaticamente

### 📢 Comunicados
- Tipos: URGENTE, INFORMATIVO, IMPORTANTE
- Cada um com estilo diferente no portal

### 🍽️ Cardápio
- Todos os 5 dias da semana (segunda a sexta)
- 4 refeições por dia: prato principal, café, almoço e lanche
- Totalmente customizável

### ⚙️ Configurações
- Título do portal
- Slogan/Subtítulo
- Descrição para buscadores
- Dados de contato completos

---

## 💾 Como Salvar as Alterações

1. Edite os campos que desejar
2. Clique no botão **"✓ Salvar Todas as Alterações"** (verde, no final da página)
3. Veja a mensagem: "✓ Alterações salvas com sucesso!"
4. As mudanças são publicadas pelo servidor para todos os computadores que acessarem o mesmo endereço do portal.

⚠️ **Importante:** Abra o portal pelo servidor (por exemplo, `http://192.168.1.50:5500`) e não pelo arquivo com duplo clique. Consulte `INICIAR_SITE_COMPARTILHADO.md` para iniciar o servidor e acessar pela rede da escola.

---

## 🔄 Sincronizar com Portal

Após salvar no admin:
1. Abra uma nova aba com o portal (`index.html`)
2. **Recarregue a página** (F5 ou Ctrl+R)
3. As alterações aparecem automaticamente

---

## 📱 Responsividade

O painel administrativo funciona em:
- ✅ Desktop (recomendado)
- ✅ Tablet
- ✅ Celular

Em dispositivos pequenos, os campos se reorganizam automaticamente.

---

## 🎨 Dicas de Design

### Para Notícias
- **Títulos:** 50-80 caracteres (aparecem em 2 linhas no máximo)
- **Resumos:** 120-180 caracteres (resumo da notícia)
- **Datas:** Formato DD/MM/YYYY

### Para Imagens
- **Resolução:** Mínimo 800x600px
- **Formato:** JPG ou PNG (PNG para logo com transparência)
- **Tamanho:** Até 5MB por imagem
- **URLs válidas:** Devem começar com `http://` ou `https://`

### Fontes de Imagens Gratuitas
- Unsplash: https://unsplash.com
- Pexels: https://pexels.com
- Pixabay: https://pixabay.com

---

## 🆘 Resolução de Problemas

### "Alterações não aparecem no portal"
→ Recarregue a página do portal (F5)

### "Imagem não aparece no preview"
→ Verifique se a URL é válida e começa com http:// ou https://

### "Perdi as alterações"
→ As alterações são salvas localmente. Se limpou o cache/histórico, serão perdidas.

### "Esqueci a senha"
→ Entre em contato com o administrador do sistema

---

## 🚀 Próximas Sugestões

- [ ] Adicionar mais de 3 notícias
- [ ] Implementar upload de imagens direto (sem URLs)
- [ ] Adicionar agendamento de publicação
- [ ] Sistema de backup automático
- [ ] Sincronização em nuvem

---

**Última atualização:** 2026-08-18  
**Versão do Painel:** 2.0 (Redesign Completo)
