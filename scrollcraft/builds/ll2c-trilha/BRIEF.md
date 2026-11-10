# BRIEF · ll2c-trilha

Entrevistado (respostas do Lucas, literais). Decisões que eu tomei a partir delas
estão marcadas como **[decisão]**.

## As oito perguntas

1. **Vibe:** "Minimalista, calmo, simples, sem complexidade." Referências: "nenhuma."
2. **Sequência:** "Ainda sem ordem definida. A única diretriz é que seja clean.
   Pelas respostas 4 e 5, os blocos principais são: hero → projetos →
   tecnologias/ferramentas. mas pode deixar a ordem atual do site"
   **[decisão]** Ordem atual do site: Início → Serviços → Ferramentas → Projetos → Sobre → Contato.
3. **Energia:** "Calma em todo o site."
4. **Sentimento:** "surpresa, o 'uau'. Partes de maior impacto: o hero, os projetos
   e a seção de tecnologias."
   **[decisão]** A skill exige UM pico. O pico é Ferramentas (é onde mora o pedido
   da pergunta 5). Hero e Projetos ficam como surpresa contida, não picos concorrentes.
5. **Só este site faz:** "Na seção de ferramentas que você usa, um carrossel animado
   diferente do comum, que tire do site a cara de produto em massa feito com IA."
6. **Estilo:** "Premium-minimalista."
7. **Estrutura:** "Um mundo contínuo que o scroll atravessa."
8. **Materiais:** marca LL2C em `/brand` (guia de marca, logo completo, símbolo,
   banner). "Não vou gerar nada pelo kie.ai, então não há gasto de créditos."

## Fatos da marca (do guia em /brand)

- Paleta: #031B2F Azul Principal, #0B3954 Azul Secundário, #BFD7EA Azul Claro,
  #FFFFFF, #70E4EF Água Elétrica (+ alerta/destaque, não usados).
- Tipografia: Plus Jakarta Sans (principal).
- Elementos gráficos: o símbolo de dois "L" encaixados; linhas finas de circuito
  com dobras de 45°; colchetes gigantes e apagados ao fundo.

## Mundo **[decisão]**

Sem fotografia e sem geração: o mundo é a própria linguagem gráfica da marca,
desenhada em SVG. Um plano azul profundo com grade de pontos, onde corre UMA linha
de circuito (a "trilha") com dobras de 45°. A câmera segue a trilha do começo ao
fim; a linha se acende atrás dela. Colchetes LL2C enormes e desfocados ficam ao
fundo e se movem mais devagar (profundidade). Nada de brilho neon: linhas de 1.5px.

## Crença final e ação **[decisão, a partir do conteúdo atual do site]**

- Acreditar: "O Lucas entrega front-end e automação que funcionam de verdade."
- Ação única: **Mande uma mensagem** (mesmo rótulo em todo lugar). Leva ao LinkedIn,
  porque o formulário real do site depende de uma chave Web3Forms que não está neste build.

## Jornada

```
1  Início       quem é, numa frase, dentro do símbolo da marca
2  Serviços     o que ele faz, três paradas na trilha
3  Ferramentas  com o que ele faz (o pico)
4  Projetos     a prova: três coisas reais com links
5  Sobre        de onde vem, curto e honesto
6  Contato      chegada: o símbolo se fecha em volta do convite
```

## Curva de sentimento

```
1  Curiosidade   os dois "L" do símbolo se afastam e a câmera passa entre eles
2  Calma         só a trilha e três paradas de texto; o silêncio antes do pico
3  Encanto       o colchete da marca agarra cada uma das 6 ferramentas que passa pela trilha
4  Confiança     projetos reais, um de cada vez, com rótulo de fato e link
5  Proximidade   texto pequeno, a trilha desacelera
6  Resolução     o símbolo que abriu no começo se fecha em volta do botão
```

Nenhum par vizinho repete sentimento.

## O pico

> "as ferramentas vão passando por uma linha e o logo dele fecha em volta de cada uma"

Vive em Ferramentas e vem logo depois do trecho mais quieto (Serviços).

**Revisão 2 (pedido do Lucas):** só as 6 ferramentas que ele mais usa (React,
TypeScript, Node.js, Supabase, n8n, Python), e Projetos com mais rolagem, porque
"duas rodelinhas de scroll já faz o projeto subir". Pesos: Início 1.6, Serviços 1.4,
Ferramentas 2.2, Projetos 3.6 (1.2 por projeto), Sobre 1.0, Contato 1.2 = 11.0.
Ferramentas deixa de ser o trecho mais longo; com 6 itens cada uma ainda segura
~0.39 altura de tela no foco (antes eram ~0.19 com 18).

## Frase do "conta pra alguém"

> É o site onde o logo do cara é o próprio carrossel: os colchetes abrem no começo,
> agarram cada ferramenta no meio e fecham em volta do botão de contato no final.

## Movimento de assinatura

**O colchete que escolhe.** As 6 ferramentas correm sobre um trecho da trilha
(rolagem = posição). No ponto de foco estão os dois "L" do símbolo LL2C; quando uma
ferramenta chega ao foco, os "L" deslizam e travam em volta dela exatamente como no
logo, e o rótulo mostra o nome e onde ele usa. Entre ferramentas, o colchete abre.
Botões anterior/próxima levam a rolagem até a ferramenta vizinha.

## Silêncios intencionais (não são scroll morto)

- Entre o fim do texto do hero (~0.09) e Serviços (~0.155): a câmera atravessa o
  símbolo aberto. Só mundo, sem texto.
- Entre Sobre (~0.886) e o final (~0.935): a trilha chega e o símbolo começa a fechar.
