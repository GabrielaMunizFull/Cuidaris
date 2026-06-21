# Design / UX

## Quando usar
Definir fluxos de tela, escrever copy da interface, revisar se algo segue o design system, estados vazios, mensagens de erro, onboarding.

---

## Voz e tom

**Personalidade:** profissional mas acolhedora. Como uma colega experiente que ajuda sem fazer sentir burra.

| Situação | Tom |
|---|---|
| Onboarding | Animado, encorajador |
| Erro da usuária | Gentil, sem culpa, com solução |
| Erro do sistema | Honesto, com desculpas e próximo passo |
| Sucesso | Breve, positivo, sem exagero |
| Estado vazio | Útil, convida à ação |
| Limite de plano | Direto, sem pressão excessiva |

**Evitar:** "Ops!" (infantil), "Erro fatal" (assustador), jargão técnico, culpar a usuária, textos longos em modais.

---

## Design system

```css
--accent: #10B981;       /* verde — ação principal */
--accent-hover: #059669;
--accent-soft: #ecfdf5;
--blue: #3B82F6;         /* links e secundário */
--ink: #0F172A;          /* texto principal */
--ink-2: #475569;        /* texto secundário */
--ink-3: #94A3B8;        /* texto terciário */
--bg: #F6F8FA;
--surface: #FFFFFF;
--line: #E8ECF1;
--radius: 14px;
```

**Regras:**
- Um botão verde primário por tela
- Badges: verde=confirmado, amarelo=pendente, vermelho=cancelado, azul=remarcado
- Alvos de toque ≥ 44px no mobile
- Referências visuais: Linear, Notion, Cal.com

---

## Estados vazios

```
PROFISSIONAIS (sem nenhum)
Título: "Boas-vindas ao Cuidaris!"
Subtítulo: "Comece adicionando o primeiro profissional que você gerencia."
CTA: "+ Adicionar profissional"

PACIENTES (sem nenhum)
Título: "Nenhum paciente ainda"
Subtítulo: "Adicione o primeiro paciente da Dra. [Nome] para começar a organizar a agenda."
CTA: "+ Adicionar paciente"

AGENDA (sem sessões hoje)
Título: "Dia livre hoje"
Subtítulo: "Nenhuma sessão agendada para hoje."
CTA: nenhum

FINANCEIRO (sem lançamentos)
Título: "Nenhum lançamento este mês"
Subtítulo: "Os lançamentos aparecem aqui quando você confirmar sessões como pagas."
CTA: nenhum
```

---

## Mensagens de erro

```
CAMPO OBRIGATÓRIO: "Preencha o nome do paciente" (não "Campo obrigatório")
E-MAIL INVÁLIDO: "Digite um e-mail válido, como nome@exemplo.com"
ERRO DE CONEXÃO: "Não conseguimos salvar agora. Verifique sua conexão e tente novamente."
ERRO INESPERADO: "Algo deu errado da nossa parte. Já fomos notificados e estamos resolvendo."
SESSÃO EXPIRADA: "Sua sessão expirou. Entre novamente para continuar." CTA: "Entrar"
LIMITE DE PLANO: "Você atingiu o limite de [N] profissional(is). Faça upgrade para continuar." CTA: "Ver planos"
```

---

## Confirmações destrutivas

```
CANCELAR SESSÃO
"Cancelar a sessão de [Paciente] em [data]?"
"Esta ação não pode ser desfeita."
Botão: "Sim, cancelar" (vermelho) / "Voltar"

REMOVER PACIENTE
"Desativar [Nome]?"
"O histórico será preservado, mas [Nome] não aparecerá mais na agenda."
Botão: "Desativar" / "Cancelar"
```

---

## Labels de formulário

```
✓ "Nome completo" (não "Nome")
✓ "E-mail (opcional)" quando for opcional
✓ "Telefone com DDD"
✓ "Data de nascimento" (não "Data nasc.")
✓ "Número do registro" (não "Nº registro")
✓ "Convênio" (não "Plano de saúde")
```
