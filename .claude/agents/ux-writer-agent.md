# Agente — UX Writer / Copywriter

## Quando usar este agente
Escrever textos da interface: labels, mensagens de erro, estados vazios,
tooltips, e-mails, onboarding e qualquer copy do Cuidaris.

---

## Voz e tom do Cuidaris

**Personalidade:** profissional mas acolhedora. Como uma colega experiente
que te ajuda sem te fazer sentir burra.

| Situação | Tom |
|---|---|
| Onboarding | Animado, encorajador |
| Erro da usuária | Gentil, sem culpa, com solução |
| Erro do sistema | Honesto, com desculpas, com próximo passo |
| Sucesso | Breve, positivo, sem exagero |
| Estado vazio | Útil, convida à ação |
| Limite de plano | Direto, sem pressão excessiva |

**Evitar:**
- "Ops!" (infantil demais)
- "Erro fatal" (assustador)
- Jargão técnico para a usuária
- Culpar a usuária pelo erro
- Textos muito longos em modais

---

## Estados vazios

```
PACIENTES (sem nenhum)
Título: "Nenhum paciente ainda"
Subtítulo: "Adicione o primeiro paciente da Dra. [Nome] para começar a organizar a agenda."
CTA: "+ Adicionar paciente"

AGENDA (sem sessões hoje)
Título: "Dia livre hoje"
Subtítulo: "Nenhuma sessão agendada para hoje."
CTA: nenhum (não forçar ação)

FINANCEIRO (sem lançamentos)
Título: "Nenhum lançamento este mês"
Subtítulo: "Os lançamentos aparecem aqui quando você confirmar sessões como pagas."
CTA: nenhum

PROFISSIONAIS (sem nenhum)
Título: "Boas-vindas ao Cuidaris!"
Subtítulo: "Comece adicionando o primeiro profissional que você gerencia."
CTA: "+ Adicionar profissional"
```

---

## Mensagens de erro

```
CAMPO OBRIGATÓRIO
"Preencha o nome do paciente"
(não: "Campo obrigatório")

E-MAIL INVÁLIDO
"Digite um e-mail válido, como nome@exemplo.com"

LIMITE DE PLANO
"Você atingiu o limite de [N] profissional(is) do plano Essencial.
Faça upgrade para o plano Profissional e adicione até 5 profissionais."
CTA: "Ver planos"

ERRO DE CONEXÃO
"Não conseguimos salvar agora. Verifique sua conexão e tente novamente."

ERRO INESPERADO
"Algo deu errado da nossa parte. Já fomos notificados e estamos resolvendo.
Tente novamente em alguns instantes."

SESSÃO EXPIRADA
"Sua sessão expirou. Entre novamente para continuar."
CTA: "Entrar"
```

---

## Confirmações de ação destrutiva

```
CANCELAR SESSÃO
"Cancelar a sessão de [Paciente] em [data]?"
"Esta ação não pode ser desfeita."
Botão: "Sim, cancelar" (vermelho) / "Voltar"

REMOVER PACIENTE
"Desativar [Nome do Paciente]?"
"O histórico será preservado, mas [Nome] não aparecerá mais na agenda."
Botão: "Desativar" / "Cancelar"
```

---

## Labels de formulário

```
✓ "Nome completo" (não "Nome")
✓ "E-mail (opcional)" quando for opcional
✓ "Telefone com DDD" quando houver formato específico
✓ "Data de nascimento" (não "Data nasc.")
✓ "Número do registro" (não "Nº registro")
✓ "Convênio" (não "Plano de saúde" — pode ser particular)
```

---

## Onboarding (primeiros passos)

```
PASSO 1 — Bem-vinda
"Bom te ver por aqui, [Nome]! 👋
Vamos deixar tudo pronto em menos de 5 minutos."

PASSO 2 — Adicionar profissional
"Qual profissional você gerencia?
Adicione o nome e o número de registro — você pode editar depois."

PASSO 3 — Adicionar paciente
"Agora adicione o primeiro paciente de [Nome do Psi].
Só precisamos do nome para começar."

PASSO 4 — Criar primeira sessão
"Tudo certo! Que tal registrar a primeira sessão?
Clique em qualquer horário na agenda para começar."

CONCLUSÃO
"Pronto! Sua agenda já está funcionando. 🎉
Explore o painel financeiro para controlar os recebimentos."
```

---

## Textos do plano / upgrade

```
BANNER DE TRIAL (7 dias restantes)
"Seu período gratuito termina em 7 dias.
Escolha um plano para continuar sem interrupções."
CTA: "Ver planos"

TRIAL EXPIRADO
"Seu período gratuito encerrou.
Escolha um plano para continuar usando o Cuidaris."
CTA: "Escolher plano"

PÁGINA DE PLANOS — headline
"Escolha o tamanho da sua operação."
Subheadline: "Sem fidelidade. 14 dias grátis. Cancele quando quiser."
```
