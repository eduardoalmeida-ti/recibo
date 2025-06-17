// Função auxiliar para ler arquivo (usada para o logo)
function readFileAsDataURL(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}

// Função para formatar valores monetários
function formatarMoeda(valor) {
  const numero = parseFloat(valor.toString().replace(/[^0-9,-]/g, '').replace(',', '.'));
  return isNaN(numero) ? '0,00' : numero.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Função para remover máscaras de CPF/CNPJ
function removerMascara(valor) {
  return valor ? valor.toString().replace(/[^\d]/g, '') : '';
}

// Função para formatar CPF/CNPJ para exibição
function formatarCpfCnpj(valor) {
  const valorLimpo = removerMascara(valor);
  if (valorLimpo.length === 11) {
    return valorLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } else if (valorLimpo.length === 14) {
    return valorLimpo.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  return valorLimpo;
}

// Função para validar campos obrigatórios
function validarCampos() {
  const camposObrigatorios = [
    {id: 'nome-prestador', nome: 'Nome do Prestador'},
    {id: 'cpf1', nome: 'CPF/CNPJ do Prestador', tipo: 'cpf_cnpj'}, 
    {id: 'nome-tomador', nome: 'Nome do Tomador'},
    {id: 'servico', nome: 'Serviço Prestado'},
    {id: 'valor', nome: 'Valor'}
  ];
  
  for (const campo of camposObrigatorios) {
    const valor = document.getElementById(campo.id).value;
    if (!valor || valor.trim() === '') {
      alert(`Por favor, preencha o campo: ${campo.nome}`);
      document.getElementById(campo.id).focus();
      return false;
    }
    
    if (campo.tipo === 'cpf_cnpj') {
      const valorNumerico = removerMascara(valor);
      if (!(valorNumerico.length === 11 || valorNumerico.length === 14)) {
        alert(`${campo.nome} inválido! CPF deve ter 11 dígitos e CNPJ 14 dígitos.`);
        document.getElementById(campo.id).focus();
        return false;
      }
    }
  }
  return true;
}

// Função principal para gerar o PDF (VERSÃO CORRIGIDA - SEM SOBREPOSIÇÃO)
async function gerarPDF() {
  if (!validarCampos()) return;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Obtém e formata os valores dos campos
  const nomePrestador = document.getElementById("nome-prestador").value;
  const cpfPrestador = formatarCpfCnpj(document.getElementById("cpf1").value);
  const nomeTomador = document.getElementById("nome-tomador").value;
  const cpfTomador = formatarCpfCnpj(document.getElementById("cpf2").value);
  const valor = document.getElementById("valor").value;
  const servico = document.getElementById("servico").value;
  const localidade = document.getElementById("localidade").value;
  const data = document.getElementById("data").value;
  const logoInput = document.getElementById("logo");

  // Formata a data
  const dataFormatada = new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  // Configurações de layout corrigidas
  const vias = ["Via do Tomador", "Via do Prestador"];
  const espacoEntreVias = 150;  // Aumentado para evitar sobreposição

  for (let i = 0; i < 2; i++) {
    const yOffset = i * espacoEntreVias;

    // Adiciona o logo se foi enviado
    if (logoInput.files && logoInput.files[0]) {
      try {
        const logo = await readFileAsDataURL(logoInput.files[0]);
        const img = new Image();
        img.src = logo;
        await new Promise((resolve) => { img.onload = resolve; });
        doc.addImage(img, 'JPEG', 20, 18 + yOffset, 25, 10);
      } catch (error) {
        console.error("Erro ao carregar logo:", error);
      }
    }

    // Moldura principal (ajustes de posição)
    doc.setDrawColor(153, 193, 241);
    doc.roundedRect(15, 10 + yOffset, 180, 130, 4, 4);

    // Cabeçalho
    doc.setDrawColor(153, 193, 241);
    doc.roundedRect(17, 16 + yOffset, 176, 18, 3, 3);
    doc.setFontSize(14);
    doc.setFont("times", "bold");
    doc.text("RECIBO DE PRESTAÇÃO DE SERVIÇO", 105, 25 + yOffset, { align: "center" });

    // Texto da via
    doc.setFontSize(9);
    doc.setFont("times", "normal");
    doc.text(vias[i], 160, 24 + yOffset);

    // Corpo do recibo (com espaçamento ajustado)
    doc.setDrawColor(153, 193, 241);
    doc.roundedRect(17, 38 + yOffset, 176, 90, 3, 3);
    let y = 45 + yOffset;

    doc.setFontSize(12);
    doc.text(`Eu, ${nomePrestador}, inscrito(a) no CPF/CNPJ sob o n.º ${cpfPrestador},`, 20, y);
    y += 8;
    doc.text(`recebi de ${nomeTomador}, CPF/CNPJ nº ${cpfTomador},`, 20, y);
    y += 8;
    doc.text(`a importância de R$ ${formatarMoeda(valor)}, pelos serviços de ${servico}.`, 20, y);
    y += 8;
    doc.text(`Não resta nenhum pagamento pendente.`, 20, y);
    y += 20;
    doc.text(`${localidade}, ${dataFormatada}.`, 20, y);
    y += 25;
    doc.text(`_________________________________`, 110, y);
    y += 6;
    doc.text(`Assinatura do prestador de serviço`, 116, y);
  }

  // Linha de corte entre as vias (posição ajustada)
  doc.setLineDashPattern([2, 2], 0);
  doc.line(15, espacoEntreVias, 195, espacoEntreVias);
  doc.setLineDashPattern([], 0);
  doc.setFontSize(8);
  doc.text("Corte aqui", 105, espacoEntreVias + 3, { align: "center" });

  doc.save("recibo_duas_vias.pdf");
}

// Inicializa as máscaras quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  // Máscara para CPF/CNPJ
  if (typeof Inputmask !== 'undefined') {
    Inputmask({
      mask: ['999.999.999-99', '99.999.999/9999-99'],
      keepStatic: true
    }).mask(document.getElementById('cpf1'));
    
    Inputmask({
      mask: ['999.999.999-99', '99.999.999/9999-99'],
      keepStatic: true
    }).mask(document.getElementById('cpf2'));
    
    // Máscara para valor monetário
    Inputmask('currency', {
      radixPoint: ",",
      groupSeparator: ".",
      allowMinus: false,
      prefix: "R$ ",
      digits: 2,
      digitsOptional: false,
      rightAlign: false,
      autoUnmask: true
    }).mask(document.getElementById('valor'));
  }
});