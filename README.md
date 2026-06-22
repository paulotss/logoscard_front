# LogosCard Front-End

O LogosCard é um sistema de cartão de benefícios para clientes a partir de uma assinatura anual. O sistema faz o controle e gerenciamento dos planos e faturas mensais. Aqui você encontrará o código front-end da aplicação. <a href="https://github.com/paulotss/logoscard_back" target="_blank">Clique aqui</a> para acessar o repositório do back-end.

### Tecnologias utilizadas

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

### Execução

Crie um arquivo `.env` a partir do `.envexample` e ajuste o IP da máquina na rede local. O `REACT_APP_API_BASE_URL` deve apontar para o backend acessível pelos outros computadores da intranet (não use `localhost`).

```bash
cp .envexample .env
```

#### Desenvolvimento (hot reload)

```bash
docker compose --profile dev up --build
```

#### Produção (build estático + nginx)

```bash
docker compose --profile prod up --build -d
```

Se alterar variáveis `REACT_APP_*` em produção, é necessário rebuild:

```bash
docker compose --profile prod up --build -d
```

### Acesso na intranet

A aplicação fica disponível em `http://<IP_DA_MAQUINA>:3000` para outros computadores na rede.

Garanta que as portas **3000** (front-end) e **3001** (back-end) estejam liberadas no firewall do host.

Em modo dev, o hot reload funciona melhor no próprio host; outros PCs na rede carregam a aplicação normalmente, mas o live reload remoto pode ser instável.
