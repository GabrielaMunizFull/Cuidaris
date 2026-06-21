Faz code review comprimido do diff atual. Um problema por linha.

**Formato:** `<arquivo>:L<linha>: <emoji> <severidade>: <problema>. <fix>.`

Severidades:
- 🔴 bug — comportamento quebrado, vai causar incidente
- 🟡 risk — funciona mas frágil (race condition, null check faltando, erro engolido)
- 🔵 nit — estilo, naming, micro-otimização (autor pode ignorar)
- ❓ q — dúvida genuína, não sugestão

**Descartar:** "Percebi que...", "Parece que...", "Você pode considerar...", "Ótimo trabalho!"
**Preservar:** número de linha exato, símbolos em backtick, fix concreto, o *porquê* se não for óbvio.

Prosa normal para: findings de segurança crítica (CVE-class), desacordos arquiteturais.

Saída: lista de findings ordenada por arquivo → linha. Totais ao final: `N🔴 N🟡 N🔵 N❓`
Sem findings: `Sem problemas.`
