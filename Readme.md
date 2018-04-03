Alguns pensamentos

why exportar functions ao invés de arrow anonymous functions?
Apesar de ser mais verboso, é mais fácil o debug

Why classes?
Apesar de ser mais verboso, é mais fácil interpretar uma classe, além do fato de incluir programadores não tão habituados à linguagem

A solução pode ser interpretada como over engineered, porém, a idéia é que a estrutura da tabela seja dinamica e facilmente alterada dores,
Os cabecalhos são responsáveis por definir quais dados serão exibidos (através da propriedade `key`), assim como a formatação de cada coluna, e qual delas será aplicada o sort.

nota importante: a `key` de cada linha a ser adicionada/atualizada deve bater com a `key` definida no header.

A solução foi pensada visando segurança (XSS), padronização, e o menor número de modificações diretas no DOM

npm run test

npm run test:coverage

es6/index.js -- responsável pelo bootstrap da tabela e atualização de dados
es6/constants.js -- ponto focal de variáveis estáticas
es6/utils.js -- funções auxiliares
es6/controller -- responsável por definir como os dados serão exibidos
es6/html-elements/table -- responsável por montar e atualizar a tabela no DOM

Agradeço a oportunidade. Gostaria de um feedback se possível.