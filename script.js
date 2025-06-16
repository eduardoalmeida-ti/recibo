const cleaveCPF1 = new Cleave('#cpf1', {
  delimiters: ['.', '.', '-', '/'],
  blocks: [3, 3, 3, 2],
  numericOnly: true
});

const cleaveCPF2 = new Cleave('#cpf2', {
  delimiters: ['.', '.', '-', '/'],
  blocks: [3, 3, 3, 2],
  numericOnly: true
});

new Cleave('#valor', {
  numeral: true,
  numeralDecimalMark: ',',
  delimiter: '.',
  numeralThousandsGroupStyle: 'thousand'
});

async function gerarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const nomePrestador = document.getElementById("nome-prestador").value;
  const cpfPrestador = document.getElementById("cpf1").value;
  const nomeTomador = document.getElementById("nome-tomador").value;
  const cpfTomador = document.getElementById("cpf2").value;
  const valor = document.getElementById("valor").value;
  const servico = document.getElementById("servico").value;
  const localidade = document.getElementById("localidade").value;
  const data = document.getElementById("data").value;

  const dataFormatada = new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  const vias = ["Via do Tomador", "Via do Prestador"];

  // Logo
  const logoInput = document.getElementById("logo");
  let logoDataURL = null;
  if (logoInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = function(e) {
      logoDataURL = e.target.result;
      desenharPDF(doc, vias, logoDataURL);
    };
    reader.readAsDataURL(logoInput.files[0]);
  } else {
    desenharPDF(doc, vias, null);
  }

  function desenharPDF(doc, vias, logo) {
    for (let i = 0; i < 2; i++) {
      const yOffset = i * 145;

      doc.setDrawColor(0);
      doc.rect(10, 10 + yOffset, 190, 130);

      if (logo) {
        doc.addImage(logo, "PNG", 12, 12 + yOffset, 30, 20);
      }

      doc.setFontSize(14);
      doc.setFont("times", "bold");
      doc.text("RECIBO DE PRESTAÇÃO DE SERVIÇO", 105, 20 + yOffset, { align: "center" });

      doc.setFontSize(10);
      doc.setFont("times", "normal");
      doc.text(vias[i], 170, 25 + yOffset);

      let y = 40 + yOffset;
      doc.setFontSize(12);
      doc.text(`Eu, ${nomePrestador}, inscrito(a) no CPF/CNPJ sob o n.º ${cpfPrestador},`, 15, y);
      y += 8;
      doc.text(`recebi de ${nomeTomador}, CPF/CNPJ nº ${cpfTomador},`, 15, y);
      y += 8;
      doc.text(`a importância de R$ ${valor}, pelos serviços de ${servico}.`, 15, y);
      y += 8;
      doc.text(`Não resta nenhum pagamento pendente.`, 15, y);
      y += 20;
      doc.text(`${localidade}, ${dataFormatada}.`, 15, y);
      y += 25;
      doc.text(`_________________________________`, 15, y);
      y += 6;
      doc.text(`Assinatura do prestador de serviço`, 15, y);
    }

    doc.setLineDashPattern([2, 2], 0);
    doc.line(10, 145, 200, 145);
    doc.setLineDashPattern([], 0);
    doc.setFontSize(8);
    doc.text("Corte aqui", 100, 148, { align: "center" });

    doc.save("recibo_duas_vias.pdf");
  }
}
