Gera mensagem de commit comprimida no formato Conventional Commits.

**Formato:** `<type>(<scope>): <resumo imperativo>`
Types: `feat`, `fix`, `refactor`, `perf`, `docs`, `test`, `chore`, `build`, `ci`, `style`, `revert`

**Regras:**
- Imperativo: "add", "fix", "remove" — não "added", "adds"
- Subject ≤ 50 chars, hard cap 72, sem ponto final
- Body só se necessário: breaking change, migração, issue linkado
- Nunca: "This commit does X", atribuição ao Claude, emoji (salvo convenção do projeto)

**Body obrigatório para:** breaking changes, fixes de segurança, migrações de banco, reverts.

Saída: bloco de código pronto para colar. Não executa `git commit`.
