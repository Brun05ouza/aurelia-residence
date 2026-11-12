# Aurelia Residence

Página em Astro + React, com os arquivos originais de marca e fotografia, fonte Manrope local, animações CSS e GSAP e adaptação para desktop e celular.

## Desenvolvimento

```sh
npm install
npm run dev
```

## Verificação e produção

```sh
npm run build
npm run preview
```

O hero está em `src/components/Hero.tsx` e os estilos em `src/styles/global.css`. O layout usa `svh` para respeitar a área disponível em navegadores móveis; telas excepcionalmente baixas e zoom permitem rolagem para preservar a leitura.

O link Projeto e o botão Conhecer o projeto levam à seção `src/components/Project.tsx`, com estilos em `src/styles/project.css`. Os textos e a casa entram uma vez na rolagem com GSAP SplitText e ScrollTrigger. A preferência de movimento reduzido mantém o conteúdo visível, sem deslocamento. A imagem original em `src/assets/modern-house.png` é otimizada pelo Astro para WebP com transparência no build.

Os demais itens de navegação abrem apresentações resumidas em diálogos acessíveis. As áreas, suítes e tempo de deslocamento são os dados fornecidos na referência e precisam de confirmação antes da publicação. O botão de agendamento informa a disponibilidade futura; não envia dados nem simula um agendamento. Conectar o canal real de atendimento quando ele for definido.
