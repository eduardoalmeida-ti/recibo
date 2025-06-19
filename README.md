
# 🧾 Gerador de Recibos Rápido e Completo

-----

Gere seu recibo de forma rápida e prática

-----

## 🚀 Visão Geral

Este projeto é um sistema web **simples, mas extremamente eficiente**, desenvolvido para **gerar recibos de prestação de serviço de forma ágil e descomplicada**. A interface intuitiva permite que você insira todas as informações necessárias em uma única página, e com **apenas um clique**, você obtém um recibo formatado em **PDF, pronto para download e impressão**, com a opção de incluir sua própria logo.

Ideal para profissionais liberais, autônomos e pequenas empresas que buscam praticidade e profissionalismo na emissão de recibos.

-----

## ✨ Funcionalidades Principais

* **Geração Instantânea:** Crie recibos completos em poucos segundos.
* **Exportação para PDF:** Gere recibos em formato PDF de alta qualidade para impressão ou arquivo.
* **Personalização com Logo:** Adicione facilmente o logotipo da sua empresa para um toque profissional.
* **Duas Vias no PDF:** O recibo é gerado automaticamente em duas vias (Tomador e Prestador), com linha de corte indicativa.
* **Campos Essenciais e Validação:** Inclui todos os dados cruciais para um recibo válido, com validação de campos obrigatórios.
* **Máscaras de Entrada Inteligentes:** Campos de CPF/CNPJ e Valor (R$) possuem máscaras automáticas para facilitar o preenchimento e garantir o formato correto.
* **Interface Intuitiva:** Design limpo e fácil de usar, focado na experiência do usuário e na rapidez do processo.

-----

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando um conjunto robusto e eficiente de tecnologias web:

* **HTML5:** Para a estrutura semântica da página.
* **CSS3:** Para a estilização, garantindo um design limpo e responsivo.
* **JavaScript:** Responsável por toda a lógica de interação, validação e manipulação de dados.
* **jsPDF:** Biblioteca JavaScript para a geração dinâmica dos documentos PDF.
* **jQuery:** Para manipulação simplificada do DOM e integração de plugins.
* **jQuery Inputmask:** Plugin utilizado para aplicar máscaras inteligentes nos campos de entrada (CPF/CNPJ e valor monetário), melhorando a usabilidade.

-----

## 🚀 Como Usar

Utilizar o gerador de recibos é um processo rápido e direto:

1.  **Acesse a Aplicação:**
      * A partir do link: https://eduardoalmeida-ti.github.io/recibo/
      * Ou você pode clonar o repositório para acesso direto por seu git.
      * Ou usando o Miniweb Server, para execução local
2.  **Preencha os Dados:** Na página principal, insira as informações do recibo nos campos correspondentes. As máscaras de entrada ajudarão no formato de CPF/CNPJ e Valor.
3.  **Adicione sua Logo (Opcional):** Clique em "Logotipo da Empresa" para fazer o upload da sua imagem.
4.  **Gere o Recibo:** Clique no botão "**Gerar PDF**".
5.  **Baixe ou Imprima:** O arquivo PDF, contendo as duas vias do recibo, será gerado e uma janela do navegador permitirá que você o baixe ou imprima diretamente.

-----

## ⚙️ Instalação (para Desenvolvedores)

Para configurar e rodar o projeto em seu ambiente de desenvolvimento local:

1.  **Clone o Repositório:**
    ```bash
    git clone https://github.com/eduardoalmeida-ti/recibo.git
    ```
2.  **Acesse o Diretório do Projeto:**
    ```bash
    cd recibo
    ```
3.  **Baixe e cole o Miniweb no Diretório do Projeto:** Basta mover os arquivos para a pasta htdocs do miniweb, executar o miniweb, posteriormente abra o navegador de sua preferência, acesso o endereço localhost:8080

-----

## 🤝 Como Contribuir

Contribuições, sugestões e relatórios de bugs são muito bem-vindos\! Se você tiver ideias para aprimorar o projeto ou encontrar algum problema, por favor:

1.  Faça um **fork** deste repositório.
2.  Crie uma nova **branch** para sua funcionalidade ou correção (`git checkout -b feature/sua-melhoria` ou `bugfix/correcao-do-problema`).
3.  Faça suas alterações e **commit**-as com mensagens claras (`git commit -m 'feat: Adiciona campo de observação no recibo'`).
4.  Envie suas alterações para a sua branch (`git push origin feature/sua-melhoria`).
5.  Abra um **Pull Request**, descrevendo detalhadamente as mudanças propostas.

-----

## 📄 Licença

Este projeto está licenciado sob a Licença MIT. Para mais informações, consulte o arquivo LICENSE neste repositório.

-----

## 👨‍💻 Sobre o Autor

Este projeto foi desenvolvido por um entusiasta da tecnologia com mais de 13 anos de experiência em suporte e infraestrutura de TI, e que está dando os primeiros passos no mundo da programação. A ideia surgiu da necessidade pessoal de uma ferramenta rápida e acessível para gerar recibos, transformando um desafio do dia a dia em uma solução prática e intuitiva para muitos.
