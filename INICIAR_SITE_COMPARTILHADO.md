# ML News compartilhado na rede

As informações do painel administrativo agora ficam na pasta `dados` e não mais apenas no navegador. Para que todos os computadores vejam a mesma versão, o site deve ser aberto pelo servidor do projeto.

## No computador que ficará como servidor

1. Instale o Node.js LTS, se ainda não estiver instalado: https://nodejs.org/
2. Abra a pasta do projeto.
3. Abra o PowerShell nessa pasta e execute:

   ```powershell
   node server.js
   ```

4. No próprio computador, abra `http://localhost:5500`.
5. Para encontrar o endereço a ser usado pelos outros computadores, execute `ipconfig` e anote o endereço IPv4 da rede da escola, por exemplo `192.168.1.50`.

## Nos demais computadores

Abra no navegador o endereço do computador servidor, por exemplo:

```
http://192.168.1.50:5500
```

Não abra os arquivos com duplo clique nem use `file:///...`: assim o navegador volta ao modo local e não consegue compartilhar as alterações.

Na primeira vez, o Windows pode perguntar sobre o firewall. Permita o acesso apenas em **redes privadas** para que os computadores da escola possam acessar o portal.

## Onde ficam os registros

- `dados/conteudo.json`: conteúdo publicado pelo painel.
- `dados/jogos.json`: catálogo de jogos publicados.
- `dados/logs-de-alteracoes.json`: histórico de publicações, incluindo campos modificados e referências às fotos.
- `dados/mensagens-de-contato.json`: mensagens recebidas pelo formulário.
- `imagens/uploads`: imagens enviadas pelo painel.

Esses arquivos não são públicos pela web: o servidor bloqueia a abertura direta da pasta `dados`.

## Segurança

O usuário do painel continua sendo `admin`. A senha padrão é `@mlnews1`; antes de colocar o site em uma rede maior, defina uma senha própria no computador servidor:

```powershell
$env:ADMIN_PASSWORD = "uma-senha-forte"
node server.js
```

Mantenha a janela do servidor aberta enquanto o site estiver sendo usado.
