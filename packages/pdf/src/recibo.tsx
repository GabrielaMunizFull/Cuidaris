import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

interface ReciboProps {
  numero: string;
  data: string;
  pacienteNome: string;
  profissionalNome: string;
  profissionalRegistro?: string | null;
  profissionalEspecialidade: string;
  descricao: string;
  valor: number;
  formaPagamento: string;
  assistenteNome: string;
}

const formasPagamento: Record<string, string> = {
  dinheiro: "Dinheiro",
  pix: "PIX",
  cartao_credito: "Cartão de Crédito",
  cartao_debito: "Cartão de Débito",
  transferencia: "Transferência Bancária",
  convenio: "Convênio",
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    padding: 48,
    backgroundColor: "#ffffff",
    color: "#0F172A",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 32,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8ECF1",
  },
  titulo: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#10B981",
  },
  numeroRecibo: {
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 4,
  },
  dataEmissao: {
    fontSize: 10,
    color: "#475569",
    textAlign: "right",
  },
  secao: {
    marginBottom: 24,
  },
  secaoTitulo: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  linha: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    fontSize: 10,
    color: "#475569",
    width: 120,
  },
  valor: {
    fontSize: 10,
    color: "#0F172A",
    flex: 1,
  },
  valorDestaque: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#10B981",
    marginTop: 4,
  },
  rodape: {
    position: "absolute",
    bottom: 48,
    left: 48,
    right: 48,
    borderTopWidth: 1,
    borderTopColor: "#E8ECF1",
    paddingTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rodapeTexto: {
    fontSize: 8,
    color: "#94A3B8",
  },
});

export function Recibo({
  numero,
  data,
  pacienteNome,
  profissionalNome,
  profissionalRegistro,
  profissionalEspecialidade,
  descricao,
  valor,
  formaPagamento,
  assistenteNome,
}: ReciboProps) {
  const dataFormatada = new Date(data + "T12:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View>
            <Text style={styles.titulo}>Cuidaris</Text>
            <Text style={styles.numeroRecibo}>Recibo nº {numero}</Text>
          </View>
          <View>
            <Text style={styles.dataEmissao}>Emitido em {dataFormatada}</Text>
          </View>
        </View>

        {/* Paciente */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Paciente</Text>
          <View style={styles.linha}>
            <Text style={styles.label}>Nome</Text>
            <Text style={styles.valor}>{pacienteNome}</Text>
          </View>
        </View>

        {/* Profissional */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Profissional</Text>
          <View style={styles.linha}>
            <Text style={styles.label}>Nome</Text>
            <Text style={styles.valor}>{profissionalNome}</Text>
          </View>
          <View style={styles.linha}>
            <Text style={styles.label}>Especialidade</Text>
            <Text style={styles.valor}>{profissionalEspecialidade}</Text>
          </View>
          {profissionalRegistro && (
            <View style={styles.linha}>
              <Text style={styles.label}>Registro</Text>
              <Text style={styles.valor}>{profissionalRegistro}</Text>
            </View>
          )}
        </View>

        {/* Serviço */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Serviço prestado</Text>
          <View style={styles.linha}>
            <Text style={styles.label}>Descrição</Text>
            <Text style={styles.valor}>{descricao}</Text>
          </View>
          <View style={styles.linha}>
            <Text style={styles.label}>Data</Text>
            <Text style={styles.valor}>{dataFormatada}</Text>
          </View>
          <View style={styles.linha}>
            <Text style={styles.label}>Forma de pagamento</Text>
            <Text style={styles.valor}>{formasPagamento[formaPagamento] ?? formaPagamento}</Text>
          </View>
        </View>

        {/* Valor */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Valor total recebido</Text>
          <Text style={styles.valorDestaque}>
            R$ {valor.toFixed(2).replace(".", ",")}
          </Text>
        </View>

        {/* Rodapé */}
        <View style={styles.rodape} fixed>
          <Text style={styles.rodapeTexto}>Gerado por Cuidaris · cuidaris.com.br</Text>
          <Text style={styles.rodapeTexto}>Gerenciado por {assistenteNome}</Text>
        </View>
      </Page>
    </Document>
  );
}
