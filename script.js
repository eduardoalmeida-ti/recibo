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
  // Remove caracteres não numéricos e formata com 2 decimais
  const numero = parseFloat(valor.toString().replace(/[^0-9,-]/g, '').replace(',', '.'));
  return isNaN(numero) ? '0,00' : numero.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Função para validar campos obrigatórios
function validarCampos() {
  const camposObrigatorios = [
    {id: 'nome-prestador', nome: 'Nome do Prestador'},
    {id: 'cpf1', nome: 'CPF/CNPJ do Prestador'}, 
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
  }
  return true;
}

// Função principal para gerar o PDF
async function gerarPDF() {
  // Valida os campos antes de continuar
  if (!validarCampos()) return;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Obtém os valores dos campos
  const nomePrestador = document.getElementById("nome-prestador").value;
  const cpfPrestador = document.getElementById("cpf1").value;
  const nomeTomador = document.getElementById("nome-tomador").value;
  const cpfTomador = document.getElementById("cpf2").value;
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

  // Array com as vias do recibo
  const vias = ["Via do Tomador", "Via do Prestador"];

  // Gera as duas vias do recibo
  for (let i = 0; i < 2; i++) {
    const yOffset = i * 145;

    // Adiciona o logo se foi enviado
    if (logoInput.files && logoInput.files[0]) {
      try {
        const logo = await readFileAsDataURL(logoInput.files[0]);
        const img = new Image();
        img.src = logo;
        await new Promise((resolve) => { img.onload = resolve; });
        doc.addImage(img, 'JPEG', 15, 18 + yOffset, 30, 10);
      } catch (error) {
        console.error("Erro ao carregar logo:", error);
      }
    }

    // Moldura principal
    doc.setDrawColor(153, 193, 241);
    doc.roundedRect(10, 10 + yOffset, 190, 130, 4, 4);

    // Cabeçalho
    doc.setDrawColor(153, 193, 241);
    doc.roundedRect(12, 16 + yOffset, 186, 18, 3, 3);
    doc.setFontSize(14);
    doc.setFont("times", "bold");
    doc.text("RECIBO DE PRESTAÇÃO DE SERVIÇO", 105, 26 + yOffset, { align: "center" });

    // Texto da via
    doc.setFontSize(10);
    doc.setFont("times", "normal");
    doc.text(vias[i], 170, 25 + yOffset);

    // Corpo do recibo
    doc.setDrawColor(153, 193, 241);
    doc.roundedRect(12, 38 + yOffset, 186, 98, 3, 3);
    let y = 45 + yOffset;

    doc.setFontSize(12);
    doc.text(`Eu, ${nomePrestador}, inscrito(a) no CPF/CNPJ sob o n.º ${cpfPrestador},`, 15, y);
    y += 8;
    doc.text(`recebi do (a) ${nomeTomador}, CPF/CNPJ nº ${cpfTomador},`, 15, y);
    y += 8;
    doc.text(`a importância de R$ ${formatarMoeda(valor)}, pelos serviços de ${servico}.`, 15, y);
    y += 8;
    doc.text(`Não resta nenhum pagamento pendente.`, 15, y);
    y += 20;
    doc.text(`${localidade}, ${dataFormatada}.`, 15, y);
    y += 25;
    doc.text(`_________________________________`, 15, y);
    y += 6;
    doc.text(`Assinatura do prestador de serviço`, 15, y);
  }

  // Linha de corte entre as vias
  doc.setLineDashPattern([2, 2], 0);
  doc.line(10, 145, 200, 145);
  doc.setLineDashPattern([], 0);
  doc.setFontSize(8);
  doc.text("Corte aqui", 100, 148, { align: "center" });

  // Salva o PDF
  doc.save("recibo_duas_vias.pdf");
}