# Cuidaris — Design System

## Referência: Linear, Notion, Cal.com
Clean, espaçado, profissional. Sem poluição visual.

---

## Tokens CSS obrigatórios

```css
:root {
  /* Marca */
  --green: #10B981;
  --green-600: #059669;
  --blue: #3B82F6;
  --blue-600: #2563EB;

  /* Acento (trocável em runtime) */
  --accent: var(--green);
  --accent-hover: #059669;
  --accent-soft: #ecfdf5;

  /* Texto */
  --ink: #0F172A;
  --ink-2: #475569;
  --ink-3: #94A3B8;

  /* Superfícies */
  --bg: #F6F8FA;
  --surface: #FFFFFF;
  --surface-2: #FBFCFD;

  /* Bordas */
  --line: #E8ECF1;
  --line-2: #F0F3F6;

  /* Layout */
  --radius-sm: 10px;
  --radius: 14px;
  --radius-lg: 20px;
  --font: "Inter", system-ui, sans-serif;

  /* Sombras */
  --shadow-sm: 0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04);
  --shadow: 0 4px 12px rgba(0,0,0,.08);
  --shadow-lg: 0 8px 32px rgba(0,0,0,.12);

  /* Espaçamento (base 8px) */
  --gap-sm: 8px;
  --gap: 16px;
  --gap-lg: 24px;
  --pad: 28px;

  /* Densidade padrão */
  --row-h: 56px;
}

[data-density="compact"] {
  --pad: 18px;
  --row-h: 46px;
}
```

---

## Tipografia

| Uso | Tamanho | Peso | Letter-spacing |
|---|---|---|---|
| Stat / número grande | 30px | 800 | -0.03em |
| Título de página | 26px | 700 | -0.025em |
| Título de seção | 16–18px | 700 | -0.02em |
| Corpo padrão | 14–15px | 400–500 | normal |
| Célula de tabela | 13px | 500–600 | normal |
| OVERLINE | 11.5px | 700 | uppercase |

Números em tabelas: `font-variant-numeric: tabular-nums`
Mínimo absoluto: 11.5px

---

## Componentes

### Botões
```
.btn-primary   → fundo --accent, texto branco, hover --accent-hover
.btn-ghost     → sem fundo, borda --line, hover --surface-2
.btn-soft      → fundo --accent-soft, texto --accent
```
**Regra:** apenas 1 botão primário verde por tela.

### Badges de status
```
Confirmado / Pago / Ativo  → texto #10B981, fundo #ECFDF5
Pendente                   → texto #F59E0B, fundo #FFFBEB
Cancelado / Atrasado       → texto #EF4444, fundo #FEF2F2
Remarcado                  → texto #3B82F6, fundo #EFF6FF
```
Formato: pílula com ponto colorido + rótulo.

### Campos de formulário
- Estado padrão: borda --line
- Estado foco: borda --accent + halo 3px a 16% opacidade
- Border-radius: --radius-sm

### Avatar (iniciais)
- Gradiente da cor do profissional → escuro
- Iniciais do nome em branco
- Tamanhos: 32px (sidebar), 40px (cards), 48px (header)

### Cards de estatística
```
↗ +2 vs. ontem
18
Consultas hoje
```
- Fundo --surface, sombra --shadow-sm
- Número: 30px/800
- Rótulo: 13px/500 --ink-2
- Variação: 12px, verde se positivo, vermelho se negativo

### Chips de filtro
- Inativo: fundo --surface, borda --line
- Ativo: fundo --accent-soft, borda --accent

---

## Layout do app

```
┌─ Sidebar (240px) ─┬─────── Main content ────────┐
│ Logo Cuidaris     │ Header (busca + notif + CTA) │
│ ─────────────     │ ─────────────────────────── │
│ Visão geral       │                              │
│ Agenda            │   Conteúdo da página         │
│ Financeiro        │                              │
│ ─────────────     │                              │
│ PROFISSIONAIS     │                              │
│ • Dra. Mariana    │                              │
│ • Dr. Rafael      │                              │
│ + Adicionar       │                              │
│ ─────────────     │                              │
│ Avatar + nome →   │                              │
└───────────────────┴──────────────────────────────┘
```

---

## Do's e Don'ts

**✓ Fazer:**
- Um botão verde primário por tela
- Tabelas limpas com paginação
- Modais para cadastros rápidos
- Espaço em branco generoso
- Alvos de toque ≥ 44px

**✗ Evitar:**
- Múltiplos botões verdes competindo
- Poluição visual e excesso de cores
- Texto abaixo de 11.5px
- Misturar dados de profissionais diferentes na mesma view
- Hex avulso no código
