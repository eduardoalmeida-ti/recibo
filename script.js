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

  // Cores para azul claro (exemplo: RGB(173, 216, 230) ou personalize)
  const azulClaro = { r: 173, g: 216, b: 230 };
  const raioCaixa = 6; // Raio de arredondamento dos cantos das caixas

  for (let i = 0; i < 2; i++) {
    const yOffset = i * 145;

    // Caixa geral de fundo (se desejar, pode remover se não precisar)
    // doc.setFillColor(240, 240, 240);
    // doc.rect(10, 10 + yOffset, 190, 130, 'F');

    // --- Caixa do Título ---
    doc.setFillColor(azulClaro.r, azulClaro.g, azulClaro.b);
    doc.roundedRect(20, 18 + yOffset, 170, 18, raioCaixa, raioCaixa, 'F');
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 51, 102); // azul escuro para o título
    doc.text("RECIBO DE PRESTAÇÃO DE SERVIÇO", 105, 30 + yOffset, { align: "center" });

    // Logo opcional, acima ou ao lado do título
    if (logoBase64) doc.addImage(logoBase64, "PNG", 25, 20 + yOffset, 30, 15);

    // Via no topo direito
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0,0,0);
    doc.text(vias[i], 180, 24 + yOffset, { align: "right" });

    // --- Caixa do Conteúdo ---
    const caixaY = 40 + yOffset;
    const caixaAltura = 80;
    doc.setFillColor(azulClaro.r, azulClaro.g, azulClaro.b);
    doc.roundedRect(20, caixaY, 170, caixaAltura, raioCaixa, raioCaixa, 'F');

    let y = caixaY + 12;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Eu, ${nomePrestador}, inscrito(a) no CPF/CNPJ sob o n.º ${cpfPrestador},`, 30, y);
    y += 8;
    doc.text(`recebi de ${nomeTomador}, CPF/CNPJ nº ${cpfTomador},`, 30, y);
    y += 8;
    doc.text(`a importância de R$ ${valor}, pelos serviços de ${servico}.`, 30, y);
    y += 8;
    doc.text(`Não resta nenhum pagamento pendente.`, 30, y);
    y += 20;
    doc.text(`${localidade}, ${dataFormatada}.`, 30, y);
    y += 20;
    doc.text(`_______________________________  🖋️`, 30, y);
    y += 6;
    doc.text(`Assinatura do prestador de serviço`, 30, y);

    doc.setFontSize(9);
    doc.text("Este recibo comprova o pagamento pelo serviço descrito acima.", 30, caixaY + caixaAltura - 8);

  }

  // Linha de corte
  doc.setLineDashPattern([3, 3], 0);
  doc.setDrawColor(130, 130, 130);
  doc.line(10, 145, 200, 145);
  doc.setFontSize(9);
  doc.setTextColor(100,100,100);
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