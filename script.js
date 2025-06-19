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

// Função para formatar data corretamente
function formatarDataCorretamente(dataString) {
    if (!dataString) return '';
    const [ano, mes, dia] = dataString.split('-');
    const meses = [
        'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    return `${dia} de ${meses[parseInt(mes) - 1]} de ${ano}`;
}

// Função para validar campos obrigatórios
function validarCampos() {
    const camposObrigatorios = [
        {id: 'nome-prestador', nome: 'Nome do Prestador'},
        {id: 'cpf1', nome: 'CPF/CNPJ do Prestador', tipo: 'cpf_cnpj'}, 
        {id: 'nome-tomador', nome: 'Nome do Tomador'},
        {id: 'servico', nome: 'Serviço Prestado'},
        {id: 'valor', nome: 'Valor'},
        {id: 'localidade', nome: 'Localidade'},
        {id: 'data', nome: 'Data'}
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

// Função principal que retorna o objeto jsPDF (para reutilização)
async function criarDocumentoRecibo() {
    if (!validarCampos()) return null;

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
    const dataFormatada = formatarDataCorretamente(data);

    // Configurações de layout
    const vias = ["Via do Tomador", "Via do Prestador"];
    const espacoEntreVias = 150;

    // Carrega o logo uma vez se ele existir
    let logoDataURL = null;
    if (logoInput.files && logoInput.files[0]) {
        try {
            logoDataURL = await readFileAsDataURL(logoInput.files[0]);
        } catch (error) {
            console.error("Erro ao carregar logo:", error);
            // Continua sem o logo se houver erro
        }
    }

    for (let i = 0; i < 2; i++) {
        const yOffset = i * espacoEntreVias;

        // Adiciona o logo se foi carregado
        if (logoDataURL) {
            doc.addImage(logoDataURL, 'JPEG', 20, 18 + yOffset, 25, 10);
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

        // Corpo do recibo
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

    return doc; // Retorna o objeto jsPDF
}

// Função para gerar o PDF e abrir em uma nova aba usando Blob URL (nome atualizado)
async function gerarRecibo() {
    const doc = await criarDocumentoRecibo();
    if (doc) {
        // Gera o PDF como um Blob
        const pdfBlob = doc.output('blob');
        // Cria um URL temporário para o Blob
        const blobUrl = URL.createObjectURL(pdfBlob);
        
        // Abre em uma nova aba
        const newWindow = window.open(blobUrl, '_blank');
        
        // Se a nova janela não abrir (bloqueador de pop-up), alertar o usuário
        if (!newWindow || newWindow.closed || typeof newWindow.closed=='undefined') {
            alert('Abertura da nova janela bloqueada. Por favor, permita pop-ups para este site para visualizar o recibo.');
        }
    }
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