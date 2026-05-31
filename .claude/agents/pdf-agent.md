# Agente — PDF e Recibos

## Quando usar este agente
Gerar recibos em PDF, criar templates de documentos, implementar
download de arquivos no Cuidaris.

## Biblioteca: @react-pdf/renderer

```bash
pnpm add @react-pdf/renderer
```

## Template de recibo

```typescript
// packages/pdf/src/Recibo.tsx
import {
  Document, Page, Text, View, StyleSheet, Font
} from '@react-pdf/renderer';

Font.register({
  family: 'Inter',
  src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2'
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    padding: 48,
    backgroundColor: '#FFFFFF',
    color: '#0F172A',
  },
  header: {
    borderBottom: '2px solid #10B981',
    paddingBottom: 16,
    marginBottom: 24,
  },
  nome: { fontSize: 16, fontWeight: 700 },
  registro: { fontSize: 12, color: '#475569', marginTop: 4 },
  badge: {
    backgroundColor: '#ECFDF5',
    color: '#10B981',
    padding: '4 10',
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 600,
  },
  valor: { fontSize: 28, fontWeight: 800, color: '#10B981', marginTop: 24 },
  descricao: { fontSize: 13, color: '#475569', marginTop: 8, lineHeight: 1.6 },
  footer: {
    marginTop: 48,
    borderTop: '1px solid #E8ECF1',
    paddingTop: 16,
    fontSize: 11,
    color: '#94A3B8',
  },
});

interface ReciboProps {
  numero: string;           // ex: "2026/0042"
  profissional: {
    nome: string;
    especialidade: string;
    registro_tipo: string;  // CRP | CRN | CREFITO | CRM
    registro_numero: string;
  };
  paciente: { nome: string };
  valor: number;
  data: string;             // ex: "28 de maio de 2026"
  cidade: string;           // ex: "São Paulo"
  descricao?: string;       // ex: "sessão de psicologia"
}

export function Recibo({
  numero, profissional, paciente, valor, data, cidade, descricao
}: ReciboProps) {
  const desc = descricao ?? `sessão de ${profissional.especialidade.toLowerCase()}`;
  const valorFormatado = valor.toLocaleString('pt-BR', {
    style: 'currency', currency: 'BRL'
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.nome}>{profissional.nome}</Text>
          <Text style={styles.registro}>
            {profissional.especialidade} · {profissional.registro_tipo} {profissional.registro_numero}
          </Text>
        </View>

        {/* Número do recibo */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 13, color: '#475569' }}>
            RECIBO Nº {numero}
          </Text>
          <View style={styles.badge}>
            <Text>Pago</Text>
          </View>
        </View>

        {/* Valor */}
        <Text style={styles.valor}>{valorFormatado}</Text>

        {/* Descrição */}
        <Text style={styles.descricao}>
          Recebi de {paciente.nome} a importância de {valorFormatado},
          referente a {desc} realizada no mês de {data.split(' de ').slice(1).join(' de ')}.
        </Text>

        {/* Assinatura */}
        <View style={{ marginTop: 64 }}>
          <View style={{ width: 200, borderTop: '1px solid #0F172A', paddingTop: 8 }}>
            <Text style={{ fontSize: 13, fontWeight: 600 }}>{profissional.nome}</Text>
            <Text style={{ fontSize: 11, color: '#475569' }}>
              {profissional.registro_tipo} {profissional.registro_numero}
            </Text>
          </View>
          <Text style={{ marginTop: 16, fontSize: 12, color: '#475569' }}>
            {cidade}, {data}.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Gerado pelo Cuidaris · cuidaris.com.br</Text>
        </View>
      </Page>
    </Document>
  );
}
```

## Gerar e fazer download no browser

```typescript
// app/(app)/[profissionalId]/financeiro/actions.ts
'use server';
import { pdf } from '@react-pdf/renderer';
import { Recibo } from '@cuidaris/pdf';

export async function gerarRecibo(lancamentoId: string) {
  // 1. Buscar dados do lançamento
  const supabase = createClient();
  const { data } = await supabase
    .from('lancamentos')
    .select('*, profissionais(*), pacientes(*)')
    .eq('id', lancamentoId)
    .single();

  // 2. Gerar PDF
  const blob = await pdf(
    <Recibo
      numero={data.recibo_numero}
      profissional={data.profissionais}
      paciente={data.pacientes}
      valor={data.valor}
      data={formatarData(data.data)}
      cidade="São Paulo"
    />
  ).toBlob();

  // 3. Retornar como base64 para download no cliente
  const buffer = await blob.arrayBuffer();
  return Buffer.from(buffer).toString('base64');
}
```

## Numeração de recibos

```sql
-- Função para gerar número sequencial por assistente
create or replace function gerar_numero_recibo(p_assistente_id uuid)
returns text as $$
declare
  v_ano int := extract(year from now());
  v_seq int;
begin
  select coalesce(max(
    cast(split_part(recibo_numero, '/', 2) as int)
  ), 0) + 1
  into v_seq
  from lancamentos
  where assistente_id = p_assistente_id
    and extract(year from created_at) = v_ano
    and recibo_numero is not null;

  return v_ano || '/' || lpad(v_seq::text, 4, '0');
end;
$$ language plpgsql;
```
