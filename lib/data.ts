import type { Channel, Media } from './types';

/**
 * Catálogo do protótipo (`RAW`), portado item a item.
 * Conteúdo 100% fictício/demo. Pôsteres locais vivem em `public/posters/`;
 * os demais apontam para o TMDB, como no original.
 *
 * Seis pôsteres não vieram do protótipo (a API corta arquivos acima de 256 KiB).
 * Esses itens estão com `img: ''` e um TODO: enquanto o arquivo não existir, o
 * card cai no bloco em degradê. Basta soltar o PNG em `public/posters/` e
 * devolver o caminho indicado no comentário.
 */
export const RAW: readonly Media[] = [
  {
    id: 1,
    type: 'movie',
    title: 'Dune 3: A Guerra Sagrada',
    genre: 'Sci-Fi',
    year: 2026,
    durMin: 170,
    rating: 8.6,
    img: '', // TODO: restaurar '/posters/dune3.png' quando o arquivo for adicionado
    cast: 'Timothée Chalamet, Zendaya, Rebecca Ferguson',
    synopsis:
      'Paul Atreides conduz os Fremen numa guerra santa pelo deserto de Arrakis, enquanto o poder da especiaria decide o destino do universo.',
  },
  {
    id: 2,
    type: 'movie',
    title: 'Ingrid Goes West',
    genre: 'Drama',
    year: 2017,
    durMin: 98,
    rating: 7.0,
    img: '', // TODO: restaurar '/posters/ingrid.png' quando o arquivo for adicionado
    cast: "Aubrey Plaza, Elizabeth Olsen, O'Shea Jackson Jr.",
    synopsis:
      'Obcecada por uma influenciadora, uma jovem se muda para o oeste e assume uma vida inteira só para entrar no círculo dela.',
  },
  {
    id: 3,
    type: 'movie',
    title: 'Project Hail Mary',
    genre: 'Sci-Fi',
    year: 2026,
    durMin: 130,
    rating: 8.2,
    img: '', // TODO: restaurar '/posters/hailmary.png' quando o arquivo for adicionado
    cast: 'Ryan Gosling, Sandra Hüller',
    synopsis:
      'Um professor acorda sozinho numa nave, sem memória, como a última esperança para salvar a Terra de uma extinção solar.',
  },
  {
    id: 4,
    type: 'movie',
    title: 'Homem-Aranha: Sem Volta Para Casa',
    genre: 'Ação',
    year: 2021,
    durMin: 148,
    rating: 8.4,
    img: '', // TODO: restaurar '/posters/spiderman.png' quando o arquivo for adicionado
    cast: 'Tom Holland, Zendaya, Benedict Cumberbatch',
    synopsis:
      'Com sua identidade exposta, Peter Parker pede ajuda ao Doutor Estranho, e um feitiço rompe as barreiras do multiverso.',
  },
  {
    id: 5,
    type: 'movie',
    title: 'Harry Potter e a Pedra Filosofal',
    genre: 'Fantasia',
    year: 2001,
    durMin: 152,
    rating: 7.6,
    img: '', // TODO: restaurar '/posters/harrypotter.png' quando o arquivo for adicionado
    cast: 'Daniel Radcliffe, Emma Watson, Rupert Grint',
    synopsis:
      'Um garoto órfão descobre que é bruxo e embarca para Hogwarts, onde um mistério guarda a lendária Pedra Filosofal.',
  },
  {
    id: 7,
    type: 'movie',
    title: 'A Odisseia',
    genre: 'Aventura',
    year: 2026,
    durMin: 165,
    rating: 8.1,
    img: '/posters/odisseia.png',
    cast: 'Matt Damon, Anne Hathaway, Tom Holland',
    synopsis:
      'Após uma década de guerra, Ulisses enfrenta deuses, monstros e o próprio destino numa jornada épica de volta para casa.',
  },
  {
    id: 8,
    type: 'movie',
    title: 'Oppenheimer',
    genre: 'Drama',
    year: 2023,
    durMin: 180,
    rating: 8.4,
    img: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    cast: 'Cillian Murphy, Emily Blunt, Robert Downey Jr.',
    synopsis:
      'A história do físico que liderou a criação da bomba atômica e as consequências que assombrariam o mundo para sempre.',
  },
  {
    id: 9,
    type: 'movie',
    title: 'Gladiador II',
    genre: 'Ação',
    year: 2024,
    durMin: 148,
    rating: 7.2,
    img: 'https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg',
    cast: 'Paul Mescal, Pedro Pascal, Denzel Washington',
    synopsis:
      'Anos após a queda de Máximo, um novo guerreiro é forçado à arena para lutar pela liberdade e pela alma de Roma.',
  },
  {
    id: 10,
    type: 'movie',
    title: 'Interestelar',
    genre: 'Sci-Fi',
    year: 2014,
    durMin: 169,
    rating: 8.7,
    img: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    cast: 'Matthew McConaughey, Anne Hathaway, Jessica Chastain',
    synopsis:
      'Com a Terra morrendo, um grupo de exploradores cruza um buraco de minhoca em busca de um novo lar para a humanidade.',
  },
  {
    id: 11,
    type: 'movie',
    title: 'Coringa: Delírio a Dois',
    genre: 'Drama',
    year: 2024,
    durMin: 138,
    rating: 5.9,
    img: '/posters/coringa2.png',
    cast: 'Joaquin Phoenix, Lady Gaga',
    synopsis:
      'Internado em Arkham, Arthur Fleck encontra o amor e a loucura em um musical sombrio sobre fama e identidade.',
  },
  {
    id: 12,
    type: 'movie',
    title: 'Duna',
    genre: 'Sci-Fi',
    year: 2021,
    durMin: 155,
    rating: 8.0,
    img: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
    cast: 'Timothée Chalamet, Rebecca Ferguson, Oscar Isaac',
    synopsis:
      'Um jovem herdeiro é lançado num planeta desértico e mortal, o único capaz de produzir a substância mais valiosa do universo.',
  },

  {
    id: 21,
    type: 'series',
    title: 'A Casa do Dragão',
    genre: 'Fantasia',
    year: 2022,
    epMin: 60,
    rating: 8.4,
    img: 'https://image.tmdb.org/t/p/w500/7QMsOTMUswlwxJP0rTTZfmz2tX2.jpg',
    seasons: 2,
    epCount: 10,
    cast: 'Emma D’Arcy, Matt Smith, Olivia Cooke',
    synopsis:
      'Dois séculos antes de Daenerys, a Casa Targaryen mergulha numa guerra civil sangrenta pelo Trono de Ferro.',
  },
  {
    id: 22,
    type: 'series',
    title: 'Breaking Bad',
    genre: 'Crime',
    year: 2008,
    epMin: 49,
    rating: 9.5,
    img: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
    seasons: 5,
    epCount: 13,
    cast: 'Bryan Cranston, Aaron Paul, Anna Gunn',
    synopsis:
      'Um professor de química com câncer terminal passa a fabricar metanfetamina para garantir o futuro da família.',
  },
  {
    id: 23,
    type: 'series',
    title: 'The Boys',
    genre: 'Ação',
    year: 2019,
    epMin: 60,
    rating: 8.7,
    img: 'https://image.tmdb.org/t/p/w500/stTEycfG9928HYGEISBFaG1ngjM.jpg',
    seasons: 4,
    epCount: 8,
    cast: 'Karl Urban, Antony Starr, Jack Quaid',
    synopsis:
      'Num mundo onde super-heróis são corruptos e famosos, um grupo de justiceiros decide expô-los a qualquer custo.',
  },
  {
    id: 24,
    type: 'series',
    title: 'Wandinha',
    genre: 'Fantasia',
    year: 2022,
    epMin: 50,
    rating: 8.1,
    img: 'https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg',
    seasons: 1,
    epCount: 8,
    cast: 'Jenna Ortega, Catherine Zeta-Jones',
    synopsis:
      'Wandinha Addams investiga uma série de assassinatos numa escola para os estranhos, enquanto domina seus poderes.',
  },
  {
    id: 25,
    type: 'series',
    title: 'Smallville',
    genre: 'Aventura',
    year: 2001,
    epMin: 45,
    rating: 7.5,
    img: '', // TODO: restaurar '/posters/smallville.png' quando o arquivo for adicionado
    seasons: 10,
    epCount: 10,
    cast: 'Tom Welling, Kristin Kreuk, Michael Rosenbaum',
    synopsis:
      'Antes da capa, um jovem Clark Kent descobre seus poderes e seu destino na pacata cidade de Smallville.',
  },
  {
    id: 26,
    type: 'series',
    title: 'Round 6',
    genre: 'Drama',
    year: 2021,
    epMin: 55,
    rating: 8.0,
    img: 'https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg',
    seasons: 2,
    epCount: 9,
    cast: 'Lee Jung-jae, Park Hae-soo',
    synopsis:
      'Endividados e desesperados, 456 pessoas entram em jogos infantis mortais por um prêmio milionário.',
  },
  {
    id: 27,
    type: 'series',
    title: 'Stranger Things',
    genre: 'Sci-Fi',
    year: 2016,
    epMin: 55,
    rating: 8.7,
    img: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
    seasons: 4,
    epCount: 9,
    cast: 'Millie Bobby Brown, Finn Wolfhard, Winona Ryder',
    synopsis:
      'Em Hawkins, o desaparecimento de um garoto revela experimentos secretos, uma menina com poderes e um mundo invertido.',
  },
  {
    id: 28,
    type: 'series',
    title: 'O Mentalista',
    genre: 'Crime',
    year: 2008,
    epMin: 42,
    rating: 8.1,
    img: '/posters/mentalista.png',
    seasons: 7,
    epCount: 12,
    cast: 'Simon Baker, Robin Tunney, Tim Kang',
    synopsis:
      'Patrick Jane usa sua incrível percepção para ajudar a polícia a resolver crimes, enquanto caça o assassino que destruiu sua família.',
  },

  {
    id: 41,
    type: 'anime',
    title: 'Attack on Titan',
    genre: 'Ação',
    year: 2013,
    epMin: 24,
    rating: 9.0,
    img: 'https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg',
    seasons: 4,
    epCount: 12,
    cast: 'Estúdio: Wit Studio / MAPPA',
    synopsis:
      'A humanidade vive cercada por muralhas para se proteger de titãs devoradores. Eren jura exterminá-los após uma tragédia.',
  },
  {
    id: 42,
    type: 'anime',
    title: 'Jujutsu Kaisen',
    genre: 'Ação',
    year: 2020,
    epMin: 24,
    rating: 8.6,
    img: 'https://image.tmdb.org/t/p/w500/fHpKWq9ayzSk8nSwqRuaAUemRKh.jpg',
    seasons: 2,
    epCount: 12,
    cast: 'Estúdio: MAPPA',
    synopsis:
      'Para salvar amigos, Yuji engole um dedo amaldiçoado e passa a caçar maldições ao lado de feiticeiros jujutsu.',
  },
  {
    id: 43,
    type: 'anime',
    title: 'Demon Slayer',
    genre: 'Aventura',
    year: 2019,
    epMin: 24,
    rating: 8.5,
    img: 'https://image.tmdb.org/t/p/w500/wrCVHdkBlBWdJUZPvnJWcBRuhSY.jpg',
    seasons: 4,
    epCount: 11,
    cast: 'Estúdio: ufotable',
    synopsis:
      'Após sua família ser massacrada e a irmã virar um demônio, Tanjiro embarca para se tornar um caçador de demônios.',
  },
  {
    id: 44,
    type: 'anime',
    title: 'One Piece',
    genre: 'Aventura',
    year: 1999,
    epMin: 24,
    rating: 8.9,
    img: 'https://image.tmdb.org/t/p/w500/e3NBGiAifW9Xt8xD5tpARskjccO.jpg',
    seasons: 1,
    epCount: 12,
    cast: 'Estúdio: Toei Animation',
    synopsis:
      'Luffy e seus piratas navegam por um mundo de ilhas fantásticas em busca do maior tesouro de todos: o One Piece.',
  },
  {
    id: 45,
    type: 'anime',
    title: 'Chainsaw Man',
    genre: 'Ação',
    year: 2022,
    epMin: 24,
    rating: 8.4,
    img: 'https://image.tmdb.org/t/p/w500/npdB6eFzizki0WaZ1OvKcJrWe97.jpg',
    seasons: 1,
    epCount: 12,
    cast: 'Estúdio: MAPPA',
    synopsis:
      'Endividado, Denji funde-se ao seu demônio de estimação e vira o Chainsaw Man, caçando demônios para uma agência secreta.',
  },
  {
    id: 46,
    type: 'anime',
    title: 'Solo Leveling',
    genre: 'Ação',
    year: 2024,
    epMin: 24,
    rating: 8.3,
    img: '/posters/sololeveling.png',
    seasons: 2,
    epCount: 12,
    cast: 'Estúdio: A-1 Pictures',
    synopsis:
      'O caçador mais fraco do mundo ganha a habilidade única de evoluir sem limites e ascende como o mais poderoso de todos.',
  },
  {
    id: 47,
    type: 'anime',
    title: 'Frieren',
    genre: 'Fantasia',
    year: 2023,
    epMin: 24,
    rating: 8.9,
    img: 'https://image.tmdb.org/t/p/w500/dqZENchTd7lp5zht7BdlqM7RBhD.jpg',
    seasons: 1,
    epCount: 12,
    cast: 'Estúdio: Madhouse',
    synopsis:
      'Uma maga elfa quase imortal parte numa jornada para entender os humanos e os laços que deixou para trás.',
  },
  {
    id: 48,
    type: 'anime',
    title: 'Dandadan',
    genre: 'Comédia',
    year: 2024,
    epMin: 24,
    rating: 8.4,
    img: '/posters/dandadan.png',
    seasons: 1,
    epCount: 12,
    cast: 'Estúdio: Science SARU',
    synopsis:
      'Dois adolescentes discutem se fantasmas ou aliens existem, e acabam mergulhados numa aventura sobrenatural caótica.',
  },
];

/** Canais de TV ao vivo (`CHRAW` do protótipo). */
export const CHANNELS: readonly Channel[] = [
  { id: 101, name: 'Globo', cat: 'Variedades', color: '#e63946', now: 'Jornal Nacional', next: 'Novela das 9', prog: 64 },
  { id: 102, name: 'GloboNews', cat: 'Notícias', color: '#2b6fe0', now: 'Edição das 10', next: 'Em Pauta', prog: 30 },
  { id: 103, name: 'CNN Brasil', cat: 'Notícias', color: '#cc0000', now: 'CNN Prime Time', next: 'Live CNN', prog: 52 },
  { id: 104, name: 'SporTV', cat: 'Esportes', color: '#00a859', now: 'Brasileirão · 2º tempo', next: 'Seleção SporTV', prog: 70 },
  { id: 105, name: 'ESPN', cat: 'Esportes', color: '#d40000', now: 'NBA: Lakers x Celtics', next: 'SportsCenter', prog: 41 },
  { id: 106, name: 'Premiere', cat: 'Esportes', color: '#1450b4', now: 'Flamengo x Palmeiras', next: 'Pós-Jogo', prog: 80 },
  { id: 107, name: 'Telecine', cat: 'Filmes', color: '#e8b100', now: 'Interestelar', next: 'Duna', prog: 22 },
  { id: 108, name: 'HBO', cat: 'Filmes', color: '#8a4bff', now: 'A Casa do Dragão', next: 'The Last of Us', prog: 15 },
  { id: 109, name: 'Megapix', cat: 'Filmes', color: '#ff5a1f', now: 'Gladiador II', next: 'Coringa', prog: 60 },
  { id: 110, name: 'Cartoon', cat: 'Infantil', color: '#12b5e5', now: 'Steven Universo', next: 'Apenas um Show', prog: 35 },
  { id: 111, name: 'Gloob', cat: 'Infantil', color: '#ff2d78', now: 'D.P.A.', next: 'Show da Luna', prog: 48 },
  { id: 112, name: 'Discovery', cat: 'Documentário', color: '#0a77c8', now: 'Ouro de Alasca', next: 'Mundo Perdido', prog: 12 },
  { id: 113, name: 'Nat Geo', cat: 'Documentário', color: '#f0c000', now: 'Cosmos', next: 'Planeta Hostil', prog: 57 },
  { id: 114, name: 'Multishow', cat: 'Variedades', color: '#7b2ff7', now: 'Lady Night', next: 'Mais Você Show', prog: 66 },
  { id: 115, name: 'MTV', cat: 'Música', color: '#ff004c', now: 'MTV Hits', next: 'Top 20 Brasil', prog: 90 },
  { id: 116, name: 'SBT', cat: 'Variedades', color: '#0aa0e0', now: 'Programa Silvio Santos', next: 'Cine Espetacular', prog: 28 },
];

/** Nomes de episódio (`EPN`). */
export const EP_NAMES: readonly string[] = [
  'Recomeço', 'Sob Pressão', 'Ponto Cego', 'Fogo Cruzado', 'Herança', 'O Acordo', 'Zona Morta',
  'Vertigem', 'Contagem Regressiva', 'A Queda', 'Renascer', 'Último Suspiro', 'Ecos', 'Fronteira',
  'Revelação',
];

/** Sinopses de episódio (`EPDESC`). */
export const EP_DESCRIPTIONS: readonly string[] = [
  'As peças começam a se mover e ninguém sai ileso.',
  'Uma revelação muda tudo o que os personagens acreditavam.',
  'Segredos vêm à tona no pior momento possível.',
  'Uma escolha impossível divide o grupo.',
  'O passado volta para cobrar o seu preço.',
  'A tensão explode num confronto inevitável.',
  'Aliados se tornam ameaças da noite para o dia.',
  'Um plano audacioso é colocado à prova.',
  'Nem todos vão sobreviver ao que vem a seguir.',
  'A verdade tem um custo alto demais.',
  'Um reencontro reacende feridas antigas.',
  'O ponto sem retorno finalmente chega.',
  'Cada decisão ecoa em consequências brutais.',
  'A caçada se inverte de forma surpreendente.',
  'O plano perfeito encontra a falha fatal.',
];

/**
 * Pôsteres locais usados como miniatura de episódio quando o título não tem
 * imagem (`LOCAL` no protótipo).
 *
 * Só entram aqui arquivos que existem de fato em `public/posters/`: apontar
 * para um arquivo ausente faz o `next/image` falhar em toda visita.
 */
export const LOCAL_POSTERS: readonly string[] = [
  '/posters/odisseia.png',
  '/posters/coringa2.png',
  '/posters/mentalista.png',
  '/posters/sololeveling.png',
  '/posters/dandadan.png',
];

/** Legendas exibidas no player: variam por título (`CAP`). */
export const CAPTIONS: readonly string[] = [
  'Você precisa confiar em mim. Não temos muito tempo.',
  'Nada será como antes depois desta noite.',
  'Eles não sabem do que somos capazes.',
  'Corra e não olhe para trás.',
  'A verdade sempre encontra um jeito de aparecer.',
  'Foi tudo planejado desde o começo.',
  'Se falharmos agora, acabou para todos.',
  'Eu faria tudo de novo por você.',
];

/** Progresso pré-existente por episódio, chave `id-temporada-episódio` (`EPSTATE`). */
export const EP_STATE: Readonly<Record<string, number>> = {
  '22-1-1': 100, '22-1-2': 100, '22-1-3': 80,
  '41-1-1': 100, '41-1-2': 100, '41-1-3': 100, '41-1-4': 100, '41-1-5': 40,
  '28-1-1': 100, '28-1-2': 22,
};

/** Fila inicial de "Continuar assistindo" antes de qualquer interação do usuário. */
export const SEED_CONTINUE = [
  { key: 'm1', id: 1, kind: 'movie' as const, progress: 62 },
  { key: 'm4', id: 4, kind: 'movie' as const, progress: 38 },
  { key: 'e22-1-3', id: 22, kind: 'ep' as const, season: 1, n: 3, progress: 80 },
  { key: 'e41-1-5', id: 41, kind: 'ep' as const, season: 1, n: 5, progress: 40 },
  { key: 'e28-1-2', id: 28, kind: 'ep' as const, season: 1, n: 2, progress: 22 },
];

/** Títulos marcados como já assistidos por padrão. */
export const SEED_WATCHED: readonly number[] = [5, 10];

/** Título em destaque no hero da Home. */
export const HERO_TITLE = 'Dune 3: A Guerra Sagrada';

/** Os quatro títulos que se alternam no carrossel do hero. */
export const HERO_IDS: readonly number[] = [1, 4, 21, 41];

export const TOP10_IDS: readonly number[] = [4, 1, 21, 3, 41, 22, 5, 27, 44, 24];

/** Grade "Chegando em breve": [id, data de estreia]. */
export const COMING_SOON: readonly (readonly [number, string])[] = [
  [7, '12 SET'],
  [9, '28 SET'],
  [11, '20 OUT'],
  [46, '05 NOV'],
  [48, '18 NOV'],
];

export const SEARCH_GENRES: readonly string[] = [
  'Todos', 'Ação', 'Sci-Fi', 'Fantasia', 'Drama', 'Aventura', 'Crime', 'Comédia', 'Romance',
  'Suspense', 'Época',
];

export const POPULAR_SEARCHES: readonly string[] = [
  'Ação', 'Sci-Fi', 'Anime', 'Breaking Bad', 'Interestelar', 'One Piece',
];

export const LIVE_CATEGORIES: readonly string[] = [
  'Todos', 'Notícias', 'Esportes', 'Filmes', 'Infantil', 'Variedades', 'Documentário', 'Música',
];

/** Programas genéricos usados para preencher as faixas futuras do EPG. */
export const EPG_POOL: readonly string[] = [
  'Cine Sessão', 'Debate ao Vivo', 'Documentário', 'Sessão Coruja', 'Talk Show', 'Boletim',
  'Maratona', 'Especial',
];

/** Marcas exibidas na faixa de estúdios da Home. Puramente decorativas. */
export const BRANDS: readonly { label: string; className: string }[] = [
  { label: 'NETFLIX', className: 'font-extrabold text-[19px] tracking-[.18em] text-[#e50914]' },
  { label: 'Disney+', className: 'font-bold text-[23px] italic -tracking-[.01em]' },
  { label: 'max', className: 'font-extrabold text-[30px] -tracking-[.03em]' },
  { label: 'PRIME', className: 'font-extrabold text-[20px] tracking-[.14em] text-[#00a8e1]' },
  { label: 'MARVEL', className: 'font-extrabold text-[22px] tracking-[.02em] bg-[#ec1d24] px-2 py-0.5 rounded-[3px]' },
  { label: 'DC', className: 'font-extrabold text-[22px] border-2 border-white rounded-full w-11 h-11 grid place-items-center' },
  { label: 'HBO', className: 'font-extrabold text-[26px] tracking-[.02em]' },
  { label: '007', className: 'font-extrabold text-[26px] italic tracking-[.04em]' },
];

export const KIND_META = {
  movie: {
    title: 'Filmes',
    sub: 'Blockbusters, clássicos e lançamentos em 4K com áudio dublado e legendado.',
    genres: ['Todos', 'Ação', 'Sci-Fi', 'Fantasia', 'Drama', 'Aventura'],
  },
  series: {
    title: 'Séries',
    sub: 'Maratone temporadas completas com todos os episódios liberados.',
    genres: ['Todos', 'Crime', 'Fantasia', 'Ação', 'Sci-Fi', 'Drama', 'Aventura'],
  },
  anime: {
    title: 'Anime',
    sub: 'Do shounen ao slice-of-life, legendado e dublado, novos episódios toda semana.',
    genres: ['Todos', 'Ação', 'Aventura', 'Fantasia', 'Comédia'],
  },
  dorama: {
    title: 'Doramas',
    sub: 'Romances, thrillers e dramas da Coreia, Japão, China e Tailândia: legendado e dublado.',
    genres: ['Todos', 'Romance', 'Drama', 'Fantasia', 'Crime', 'Suspense', 'Comédia'],
  },
  turca: {
    title: 'Novelas Turcas',
    sub: 'Paixões, vinganças e dramas de Istambul: capítulos longos, dublados e legendados.',
    genres: ['Todos', 'Romance', 'Drama', 'Comédia', 'Ação', 'Suspense', 'Época'],
  },
} as const;

