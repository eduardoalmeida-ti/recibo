
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
  const logoFile = document.getElementById("logo").files[0];

  const dataFormatada = new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric"
  });

  const vias = ["Via do Tomador", "Via do Prestador"];
  const logoBase64 = logoFile ? await toBase64(logoFile) : null;

  for (let i = 0; i < 2; i++) {
    const yOffset = i * 145;
    doc.setFillColor(240, 240, 240);
    doc.rect(10, 10 + yOffset, 190, 130, 'F');

    if (logoBase64) doc.addImage(logoBase64, "PNG", 15, 14 + yOffset, 30, 15);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("RECIBO DE PRESTAÇÃO DE SERVIÇO", 105, 20 + yOffset, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(vias[i], 170, 25 + yOffset);

    let y = 35 + yOffset;
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
    doc.text(`_______________________________  🖋️`, 15, y);
    y += 6;
    doc.text(`Assinatura do prestador de serviço`, 15, y);
    doc.setFontSize(9);
    doc.text("Este recibo comprova o pagamento pelo serviço descrito acima.", 15, y + 12);
  }

  doc.setLineDashPattern([3, 3], 0);
  doc.line(10, 145, 200, 145);
  doc.setFontSize(9);
  doc.text("---- CORTE AQUI ----", 105, 148, { align: "center" });

  doc.save("recibo_visual.pdf");
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
