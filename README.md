# Portfólio de Tiago Rodrigues

Site multilíngue (PT, EN, DE) e acessível (WCAG 2.1 AA) com os projetos de software, IA e automotivo, painel administrativo e estatísticas de visita próprias.

**No ar:** https://tiagorodrigues-gith.github.io/tiago-rodrigues-portfolio/

| Pasta | O que é |
|---|---|
| `frontend/` | Angular 21 com SSR e pré-renderização (páginas estáticas no GitHub Pages). Projetos, demonstrações (triagem de defeitos, assistente de patentes, rotas em cidades brasileiras) e o jogo **Trilha da Capivara** (`/game/capybara`). |
| `backend/` | Spring Boot (Java 17): login do administrador com JWT, comentários moderados, mensagens de contato e registro de visitas (LGPD). |
| `docs/` | Implantação (`DEPLOYMENT.md`) e histórico do redesenho (`REDESIGN-2026-10.md`). |

## Rodar localmente

```bash
cd frontend
npm ci
npm start              # http://localhost:4200
npx ng test --watch=false
npx ng build           # dist/website-tiago-rodrigues/browser

cd ../backend
mvn spring-boot:run    # http://localhost:8080/api/health
```

## Custos

Tudo em planos gratuitos: GitHub Pages (site), GitHub Actions (testes e publicação), Render free (API, adormece sem uso), Neon free (PostgreSQL) e GoatCounter (estatísticas sem cookies). Detalhes em `docs/DEPLOYMENT.md`.

## Estatísticas de visita

- **GoatCounter**: contagem sem cookies, ativada por configuração.
- **Registro próprio**: a API grava as visitas e o painel `/admin` mostra páginas vistas, visitantes, sessões e as últimas visitas; a política está em `/privacy`.
