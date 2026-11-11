import type { StaticImageData } from 'next/image';

import birriaNeon from '@/assets/photos/v2/birria-neon.jpg';
import birriaConsome from '@/assets/photos/v2/birria-consome.jpg';
import birriaSalsas from '@/assets/photos/v2/birria-salsas.jpg';
import cenitalBirria from '@/assets/photos/v2/cenital-birria.jpg';
import cazuela10l from '@/assets/photos/v2/cazuela-10l.jpg';
import cantaritoNeon from '@/assets/photos/v2/cantarito-neon.jpg';
import barraCantaritos from '@/assets/photos/v2/barra-cantaritos.jpg';
import barraTequila from '@/assets/photos/v2/barra-tequila.jpg';
import barraMojito from '@/assets/photos/v2/barra-mojito.jpg';
import mojitosTrio from '@/assets/photos/v2/mojitos-trio.jpg';
import alitasPapas from '@/assets/photos/v2/alitas-papas.jpg';
import alitasMojito from '@/assets/photos/v2/alitas-mojito.jpg';
import papasMojito from '@/assets/photos/v2/papas-mojito.jpg';
import tacosLengua from '@/assets/photos/v2/tacos-lengua.jpg';
import tacosNeon from '@/assets/photos/v2/tacos-neon.jpg';
import carneJugo from '@/assets/photos/v2/carne-jugo.jpg';
import desayuno from '@/assets/photos/v2/desayuno.jpg';
import chilaquilesPollo from '@/assets/photos/v2/chilaquiles-pollo.jpg';
import enchiladasPour from '@/assets/photos/v2/enchiladas-pour.jpg';
import gente1 from '@/assets/photos/v2/gente-1.jpg';
import gente2 from '@/assets/photos/v2/gente-2.jpg';
import gente3 from '@/assets/photos/v2/gente-3.jpg';
import birriaNoodles from '@/assets/photos/birria-noodles.jpg';
import aguaJamaica from '@/assets/photos/agua-jamaica.jpg';
import aguaFresca from '@/assets/photos/agua-fresca-splash.jpg';
import cantaritoPour from '@/assets/photos/cantarito-pour.jpg';

export const SITE = {
  name: 'El Agave',
  legalName: 'El Agave — Birria & Cantaritos',
  url: 'https://el-agave-arandas.com',
  tagline: 'Birria que abraza, cantaritos que prenden',
  phoneDisplay: '55 1069 9414',
  phoneTel: '+525510699414',
  whatsapp: '525510699414',
  email: 'elagavearandas@gmail.com',
  instagram: 'https://instagram.com/el_agave_arandas',
  instagramHandle: '@el_agave_arandas',
  rating: 4.4,
};

export function waLink(text: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
}

export type Branch = {
  id: 'arboledas' | 'centro';
  name: string;
  street: string;
  area: string;
  postalCode: string;
  mapsQuery: string;
  facebook: string;
  facebookHandle: string;
  placeId: string;
  rating: number;
  reviewCount: number;
};

export const BRANCHES: Branch[] = [
  {
    id: 'arboledas',
    name: 'Arboledas',
    street: 'Av. Niños Héroes #26',
    area: 'Res. El Dorado, Tlalnepantla',
    postalCode: '54026',
    mapsQuery: 'Av. Niños Héroes 26, Residencial El Dorado, Tlalnepantla de Baz, Estado de México',
    facebook: 'https://facebook.com/Agavearboledas',
    facebookHandle: 'Agavearboledas',
    placeId: 'ChIJv3R-YwAd0oUR7bI8fhf2seM',
    rating: 4.4,
    reviewCount: 57,
  },
  {
    id: 'centro',
    name: 'Centro',
    street: 'Av. Morelos #39',
    area: 'San Javier, Tlalnepantla Centro',
    postalCode: '54030',
    mapsQuery: 'Av. Morelos 39, San Javier, Tlalnepantla de Baz, Estado de México',
    facebook: 'https://facebook.com/cantaritoselagave',
    facebookHandle: 'cantaritoselagave',
    placeId: 'ChIJDUTgGB330YURjObAqnz2DSA',
    rating: 4.4,
    reviewCount: 294,
  },
];

export const TOTAL_REVIEWS = BRANCHES.reduce((n, b) => n + b.reviewCount, 0);

export function placeUrl(b: Branch) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`El Agave ${b.name}`)}&query_place_id=${b.placeId}`;
}

export function writeReviewUrl(b: Branch) {
  return `https://search.google.com/local/writereview?placeid=${b.placeId}`;
}

export function directionsUrl(b: Branch) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(b.mapsQuery)}&destination_place_id=${b.placeId}`;
}

export function mapEmbedUrl(b: Branch) {
  return `https://www.google.com/maps?q=${encodeURIComponent(b.mapsQuery)}&output=embed`;
}

// ------------------------------------------------------------------
// Menú — transcrito del menú impreso final.
// ------------------------------------------------------------------
export type MenuItem = { name: string; note?: string; desc?: string; price?: number; price2?: number };
export type MenuCategory = {
  id: string;
  label: string;
  intro?: string;
  img?: StaticImageData;
  cols?: [string, string];
  footnote?: string;
  items: MenuItem[];
};
export type MenuGroup = { id: string; label: string; categories: MenuCategory[] };

const SALSAS = 'BBQ, mango-habanero, tamarindo, chipotle o lemon pepper';

export const MENU: MenuGroup[] = [
  {
    id: 'comer',
    label: 'Para comer',
    categories: [
      {
        id: 'birria',
        label: 'Birria',
        intro: 'Birria estilo Jalisco, la especialidad de la casa.',
        img: birriaConsome,
        items: [
          { name: 'Birria mediana', note: '120 g de proteína', price: 150 },
          { name: 'Birria grande', note: '170 g de proteína', price: 175 },
          { name: 'Consomé', price: 40 },
          { name: 'Birriamen', note: '100 g de proteína', price: 150 },
          { name: 'Carne en su jugo', note: '100 g de proteína', price: 155 },
          { name: 'Chamorro', note: '700 g aprox.', desc: 'Acompañado de nopales y arroz.', price: 185 },
          { name: 'Taco de birria', note: '60 g', price: 42 },
          { name: 'Orden de tacos de birria', note: '3 piezas', price: 120 },
          { name: 'Quesadilla frita de birria', note: '60 g', price: 45 },
          { name: 'Quesabirria', note: '60 g', price: 48 },
          { name: 'Orden de quesabirrias', note: '2 piezas', price: 85 },
          { name: 'Flautas de birria', note: '3 piezas de 100 g', price: 95 },
          { name: 'Torta de birria', note: '100 g', price: 95 },
        ],
      },
      {
        id: 'tacos',
        label: 'Tacos',
        img: tacosLengua,
        items: [
          { name: 'Lengua', note: '50 g', price: 59 },
          { name: 'Bistec', note: '60 g', price: 42 },
          { name: 'Costilla de res', note: '60 g', price: 42 },
          { name: 'Cecina de res', note: '60 g', price: 42 },
          { name: 'Cecina adobada', note: '60 g', price: 42 },
          { name: 'Longaniza', note: '60 g', price: 42 },
          { name: 'Campechano', note: '60 g', price: 42 },
          { name: 'Queso extra', note: '30 g', price: 10 },
          { name: 'Chiles toreados', price: 25 },
          { name: 'Orden de cebollitas cambray', price: 35 },
          { name: 'Orden de aguacate', price: 45 },
          { name: 'Guacamole', price: 70 },
        ],
      },
      {
        id: 'asada',
        label: 'Carne asada',
        intro: 'Incluye papas, nopales y cebollitas cambray.',
        img: tacosNeon,
        items: [
          { name: 'Arrachera', note: '200 g', price: 179 },
          { name: 'Costilla de res', note: '200 g', price: 159 },
          { name: 'Cecina de res', note: '200 g', price: 159 },
          { name: 'Cecina adobada', note: '200 g', price: 159 },
        ],
      },
      {
        id: 'snacks',
        label: 'Snacks',
        img: alitasPapas,
        items: [
          { name: 'Papas a la francesa', note: '250 g', price: 65 },
          { name: 'Cazuelitas de carne', note: '120 g', price: 72 },
          { name: 'Nachos Agave', note: '120 g', price: 110 },
          { name: 'Orden de dobladitas', note: '6 piezas de 30 g', desc: 'Rellenas de frijol y papa.', price: 39 },
          { name: 'Boneless', note: '300 g', desc: SALSAS, price: 155 },
          { name: 'Alitas', note: '10 piezas', desc: SALSAS, price: 155 },
          { name: 'Nuggets', note: '5 piezas', desc: 'Con papas a la francesa (125 g).', price: 89 },
        ],
      },
      {
        id: 'postres',
        label: 'Postres',
        items: [
          { name: 'Duraznos con crema', note: '120 g', price: 55 },
          { name: 'Flan de cajeta', note: '230 g aprox.', price: 55 },
          { name: 'Flan napolitano', note: '230 g aprox.', price: 55 },
          { name: 'Pastel', note: '230 g aprox.', price: 60 },
        ],
      },
    ],
  },
  {
    id: 'desayunar',
    label: 'Para desayunar',
    categories: [
      {
        id: 'chilaquiles',
        label: 'Chilaquiles',
        intro: 'Totopos bañados en salsa verde o roja, con frijoles.',
        img: chilaquilesPollo,
        cols: ['Solo', 'Paquete*'],
        items: [
          { name: 'Sencillos', price: 85, price2: 130 },
          { name: 'Con huevo', note: '2 piezas', price: 95, price2: 135 },
          { name: 'Con pollo', note: '60 g', price: 105, price2: 150 },
          { name: 'Con carne asada', note: '120 g', price: 125, price2: 170 },
        ],
      },
      {
        id: 'enchiladas',
        label: 'Enchiladas',
        intro: 'Orden de 3, verdes o rojas, rellenas de pollo (100 g).',
        img: enchiladasPour,
        cols: ['Solo', 'Paquete*'],
        items: [
          { name: 'Sencillas', price: 100, price2: 145 },
          { name: 'Con huevo estrellado', price: 125, price2: 170 },
          { name: 'Con carne asada', note: '120 g', price: 165, price2: 200 },
          {
            name: 'Enfrijoladas Agave',
            desc: '3 enfrijoladas rellenas de pollo con la salsa de la casa, longaniza, cilantro, crema y queso.',
            price: 145,
            price2: 190,
          },
        ],
      },
      {
        id: 'huevos',
        label: 'Huevos al gusto',
        intro: '3 piezas de huevo, acompañadas con frijoles.',
        img: desayuno,
        cols: ['Solo', 'Paquete*'],
        items: [
          { name: 'Estrellados', price: 75, price2: 120 },
          { name: 'Con jamón', price: 85, price2: 130 },
          { name: 'Con tocino', price: 85, price2: 130 },
          { name: 'A la mexicana', price: 85, price2: 130 },
          { name: 'Al albañil', price: 85, price2: 130 },
          { name: 'Rancheros', price: 85, price2: 130 },
          { name: 'Tirados', price: 95, price2: 140 },
        ],
      },
      {
        id: 'extras-desayuno',
        label: 'Extras',
        items: [
          { name: 'Pan de dulce', note: 'pieza', price: 25 },
          { name: 'Paquete desayuno', desc: 'Jugo o fruta y café.', price: 60 },
          { name: 'Queso cottage', note: '150 g', price: 30 },
          { name: 'Yogurt de fresa', note: '200 ml', price: 25 },
        ],
      },
    ],
  },
  {
    id: 'beber',
    label: 'Para beber',
    categories: [
      {
        id: 'cantaritos',
        label: 'Cantaritos',
        intro: 'Tequila Arandas con jugos de limón, naranja y toronja, refresco de toronja y sal.',
        img: barraCantaritos,
        items: [
          { name: 'Tradicional', note: '800 ml · 90 ml de tequila', price: 105 },
          { name: 'Cazuela 5 L', note: '990 ml de tequila', price: 990 },
          { name: 'Cazuela 10 L', note: '1,980 ml de tequila', price: 1799 },
        ],
      },
      {
        id: 'mezcalinas',
        label: 'Mezcalinas',
        intro: 'Mezcal (60 ml) con jugo de tu elección y agua mineral, en vaso escarchado con sal de gusano.',
        img: aguaJamaica,
        items: [
          { name: 'Frutos rojos', note: '450 ml', price: 110 },
          { name: 'Jamaica y chile ancho', note: '450 ml', price: 110 },
          { name: 'Pepino y Tajín', note: '450 ml', price: 110 },
          { name: 'Mango', note: '450 ml', price: 99 },
          { name: 'Tamarindo', note: '450 ml', price: 99 },
          { name: 'Piña', note: '450 ml', price: 99 },
        ],
      },
      {
        id: 'mega',
        label: 'Mega bebidas',
        intro: 'De un litro, para que dure la plática.',
        img: mojitosTrio,
        items: [
          { name: 'Mojito de sabores', note: '1 L', desc: 'Bacardí (90 ml), limón, agua mineral y jarabe: mango, piña, tamarindo, naranja, arándano, frutos rojos, coco, kiwi o sandía.', price: 140 },
          { name: 'Mojito', note: '1 L', desc: 'Bacardí (90 ml) con agua mineral, limón y jarabe.', price: 130 },
          { name: 'Margarita frozen', note: '1 L', desc: 'Tequila Arandas (90 ml) y Controy (45 ml): clásica, mango o tamarindo.', price: 130 },
          { name: 'Azulito', note: '1 L', desc: 'Vodka Wyborowa (90 ml) con agua mineral y curazao.', price: 130 },
          { name: 'Cuba', note: '1 L', desc: 'Bacardí (90 ml) con refresco.', price: 130 },
          { name: 'Bull', note: '500 ml', desc: 'Levanta muertos: ron (45 ml) con cerveza, limón y jarabe.', price: 135 },
          { name: 'Piedra', note: '90 ml', desc: 'Levanta muertos: Tequila Arandas con licor de anís y fernet.', price: 95 },
        ],
      },
      {
        id: 'cocteleria',
        label: 'Coctelería',
        img: barraMojito,
        items: [
          { name: 'Piña colada', note: '400 ml', desc: 'Frappé con Bacardí blanco (90 ml), piña y crema de coco.', price: 125 },
          { name: 'Derrame', note: '45 ml', desc: 'Baileys, licor de durazno y granadina.', price: 120 },
          { name: 'Gin & Tonic frutos rojos', note: '350 ml', desc: 'Bombay (60 ml), agua tónica y hierbabuena.', price: 170 },
          { name: 'Gin & Tonic cucumber', note: '350 ml', price: 159 },
          { name: 'Gin & Tonic clásico', note: '350 ml', price: 159 },
          { name: 'Sangría', note: '500 ml', desc: 'Vino tinto (150 ml), jarabe natural, limón y agua mineral.', price: 99 },
          { name: 'Clericot', note: '500 ml', desc: 'Vino tinto con jarabe natural, limón, agua mineral y fruta picada.', price: 110 },
          { name: 'Flotante Wine & Lemon', price: 125 },
          { name: 'Flotante Wine & Vanilla', price: 125 },
        ],
      },
      {
        id: 'cervezas',
        label: 'Cervezas',
        img: papasMojito,
        items: [
          { name: 'Corona · Victoria · Pacífico', note: '355 ml', price: 55 },
          { name: 'Modelo Especial · Negra Modelo', note: '355 ml', price: 60 },
          { name: 'Heineken · Heineken 0.0', note: '355 ml', price: 60 },
          { name: 'Mega Corona · Victoria · León', note: '1,200 ml', price: 109 },
          { name: 'Mega Modelo Especial · Negra Modelo', note: '1,200 ml', price: 120 },
          { name: 'Cubeta nacional', note: '6 × 355 ml', desc: 'Corona, Victoria o Pacífico.', price: 270 },
          { name: 'Cubeta premium', note: '6 × 355 ml', desc: 'Modelo Especial, Negra Modelo o Heineken.', price: 320 },
          { name: 'Tarro chelado', desc: 'Escarchado con limón y sal.', price: 10 },
          { name: 'Tarro michelado', desc: 'Limón, sal y salsas negras.', price: 10 },
          { name: 'Tarro cubano', desc: 'Tajín, limón y salsas negras.', price: 15 },
          { name: 'Tarro chamoy', desc: 'Chamoy, limón y sal.', price: 19 },
          { name: 'Tarro clamato', desc: 'Tajín y clamato.', price: 25 },
        ],
      },
      {
        id: 'pulques',
        label: 'Pulques',
        cols: ['½ litro', '1 litro'],
        items: [
          { name: 'Natural', price: 35, price2: 60 },
          { name: 'Curado', desc: 'Piña, mango, guayaba o fresa.', price: 50, price2: 95 },
          { name: 'Curado de mazapán', price: 55, price2: 105 },
        ],
      },
      {
        id: 'sin-alcohol',
        label: 'Sin alcohol',
        img: aguaFresca,
        items: [
          { name: 'Cantarito sin tequila', note: '750 ml', price: 65 },
          { name: 'Margarita sin alcohol', note: '1 L', price: 90 },
          { name: 'Azulito sin alcohol', note: '1 L', price: 90 },
          { name: 'Mega mojito sin alcohol', note: '1 L', price: 90 },
          { name: 'Clamato natural', note: '500 ml', price: 65 },
          { name: 'Piñada', note: '500 ml', price: 75 },
          { name: 'Limonada · Naranjada', note: '500 ml', price: 45 },
          { name: 'Jugo', note: '355 ml', price: 45 },
          { name: 'Agua mineral preparada', note: '500 ml', price: 49 },
          { name: 'Refresco preparado', note: '500 ml', price: 49 },
          { name: 'Refresco', note: '355 ml', price: 39 },
          { name: 'Volt Mora', note: '473 ml', price: 78 },
          { name: 'Boost', note: '235 ml', price: 60 },
          { name: 'Agua mineral', note: '600 ml', price: 42 },
          { name: 'Agua embotellada', note: '600 ml', price: 35 },
          { name: 'Mezclador', note: '235 ml aprox.', price: 30 },
        ],
      },
      {
        id: 'cafes',
        label: 'Cafés',
        items: [
          { name: 'Café de olla', price: 35 },
          { name: 'Café americano', price: 40 },
          { name: 'Capuccino', price: 65 },
          { name: 'Capuccino con licor', desc: "Baileys, Licor 43 o Jack Daniel's.", price: 135 },
          { name: 'Carajillo', price: 170 },
        ],
      },
    ],
  },
  {
    id: 'barra',
    label: 'Barra',
    categories: [
      {
        id: 'tequila',
        label: 'Tequila',
        img: barraTequila,
        cols: ['Botella', 'Copa 45 ml'],
        items: [
          { name: 'Maestro Dobel', note: '1.75 L', price: 5200 },
          { name: 'Don Julio 70', note: '700 ml', price: 2600, price2: 325 },
          { name: 'El Patrón', note: '700 ml', price: 2450, price2: 320 },
          { name: '1800 Cristalino', note: '700 ml', price: 2400, price2: 310 },
          { name: 'Contraluz', note: '700 ml', price: 2300, price2: 290 },
          { name: '1800 Añejo', note: '700 ml', price: 2150, price2: 270 },
          { name: '1800 Reposado', note: '700 ml', price: 1950, price2: 255 },
          { name: 'Don Julio Reposado', note: '700 ml', price: 1950, price2: 255 },
          { name: 'Maestro Dobel', note: '700 ml', price: 1950, price2: 255 },
          { name: 'Herradura Reposado', note: '700 ml', price: 1700, price2: 220 },
          { name: 'Tradicional Plata', note: '695 ml', price: 1500, price2: 190 },
          { name: 'Centenario Plata', note: '695 ml', price: 1400, price2: 180 },
          { name: 'Tradicional Reposado', note: '695 ml', price: 1300, price2: 170 },
          { name: 'Centenario Reposado', note: '700 ml', price: 1150, price2: 165 },
          { name: 'Arandas', note: '990 ml', price: 1050, price2: 130 },
          { name: 'José Cuervo Especial', note: '695 ml', price: 1050, price2: 130 },
        ],
      },
      {
        id: 'mezcal',
        label: 'Mezcal y ginebra',
        cols: ['Botella', 'Copa 45 ml'],
        items: [
          { name: 'Montelobos', note: '750 ml', price: 2100, price2: 265 },
          { name: '400 Conejos', note: '700 ml', price: 1600, price2: 210 },
          { name: 'Mezcal de la casa', price2: 110 },
          { name: 'Bombay', note: '750 ml', price: 1450, price2: 185 },
        ],
      },
      {
        id: 'ron',
        label: 'Ron',
        cols: ['Botella', 'Copa 45 ml'],
        items: [
          { name: 'Bacardí Blanco', note: '3 L', price: 3300 },
          { name: 'Flor de Caña 7 años', note: '750 ml', price: 1150, price2: 145 },
          { name: 'Havana 7', note: '700 ml', price: 1150, price2: 145 },
          { name: 'Matusalem Clásico', note: '750 ml', price: 1150, price2: 145 },
          { name: 'Flor de Caña 5 años', note: '750 ml', price: 1100, price2: 135 },
          { name: 'Matusalem Platino', note: '750 ml', price: 1100, price2: 135 },
          { name: 'Malibú', note: '750 ml', price: 1100, price2: 135 },
          { name: 'Bacardí Blanco', note: '700 ml', price: 1049, price2: 130 },
          { name: 'Bacardí Raspberry', note: '750 ml', price: 990, price2: 130 },
          { name: 'Bacardí Mango', note: '750 ml', price: 990, price2: 130 },
          { name: 'Capitán Morgan', note: '700 ml', price: 990, price2: 130 },
        ],
      },
      {
        id: 'whisky',
        label: 'Whisky',
        cols: ['Botella', 'Copa 45 ml'],
        items: [
          { name: 'Johnnie Walker Red Label', note: '1.75 L', price: 3300 },
          { name: "Buchanan's 12", note: '750 ml', price: 2100, price2: 265 },
          { name: 'Chivas Regal 12', note: '750 ml', price: 2100, price2: 265 },
          { name: 'Johnnie Walker Black Label', note: '750 ml', price: 2100, price2: 265 },
          { name: "Jack Daniel's 7", note: '700 ml', price: 1650, price2: 210 },
          { name: 'Johnnie Walker Red Label', note: '700 ml', price: 1450, price2: 185 },
          { name: 'Black & White', note: '700 ml', price: 990, price2: 130 },
          { name: "William Lawson's", note: '700 ml', price: 990, price2: 130 },
        ],
      },
      {
        id: 'vodka',
        label: 'Vodka',
        cols: ['Botella', 'Copa 45 ml'],
        items: [
          { name: 'Grey Goose', note: '700 ml', price: 2400, price2: 300 },
          { name: 'Stolichnaya', note: '700 ml', price: 1250, price2: 155 },
          { name: 'Absolut Azul · Citron · Mandarin', note: '750 ml', price: 1100, price2: 150 },
          { name: 'Smirnoff Tamarindo', note: '750 ml', price: 1050, price2: 145 },
          { name: 'Smirnoff', note: '750 ml', price: 990, price2: 130 },
          { name: 'Wyborowa', note: '750 ml', price: 990, price2: 130 },
        ],
      },
      {
        id: 'licores',
        label: 'Licores y más',
        cols: ['Botella', 'Copa 45 ml'],
        footnote: 'Hypnotic y Jägermeister no entran al 2×1 en ninguna preparación.',
        items: [
          { name: 'Hypnotic', note: '750 ml', price: 2000, price2: 180 },
          { name: 'Jägermeister', note: '700 ml', price: 1700, price2: 180 },
          { name: 'Baileys', note: '700 ml', price: 1300, price2: 170 },
          { name: 'Sambuca Negro', note: '700 ml', price: 1300, price2: 170 },
          { name: 'Licor 43', note: '700 ml', price: 1300, price2: 170 },
          { name: 'Fernet', note: '750 ml', price: 800, price2: 110 },
          { name: 'Torres 10', note: 'Brandy · 700 ml', price: 1250, price2: 155 },
          { name: 'Terry 1900', note: 'Brandy · 700 ml', price: 1100, price2: 150 },
          { name: 'Fundador', note: 'Brandy · 700 ml', price: 990, price2: 130 },
          { name: 'Azteca de Oro', note: 'Brandy · 700 ml', price: 990, price2: 130 },
          { name: 'Martell', note: 'Coñac · 700 ml', price: 2300, price2: 310 },
          { name: 'Chinchón', note: 'Anís · 1 L', price2: 110 },
          { name: 'Mico', note: 'Anís · 990 ml', price2: 100 },
          { name: 'Moët & Chandon', note: 'Champagne · 750 ml', price: 3200 },
        ],
      },
    ],
  },
];

export const MENU_NOTES: Record<string, string> = {
  desayunar: '*El paquete incluye jugo o fruta y café. Horario de desayunos: 10:00 a 14:00 h.',
  barra: '2×1 en copeo todos los días. Promoción personal, incluye un mezclador. Aplican restricciones.',
};

export function money(n: number) {
  return `$${n.toLocaleString('es-MX')}`;
}

export const SIGNATURE = [
  { n: '01', name: 'Birria estilo Jalisco', copy: 'La especialidad de la casa. Mediana con 120 g de proteína o grande con 170 g, y el consomé que vas a pedir otra vez.', price: 'Desde $150', img: birriaNeon },
  { n: '02', name: 'Birriamen', copy: 'Fideo bañado en consomé de birria. Suena raro, sabe a que siempre debió existir.', price: '$150', img: birriaNoodles },
  { n: '03', name: 'Cantarito tradicional', copy: '800 ml en barro con 90 ml de Tequila Arandas, limón, naranja, toronja y escarchado.', price: '$105', img: cantaritoNeon },
  { n: '04', name: 'Cazuela de 10 litros', copy: 'Casi dos litros de tequila en una sola cazuela. Para la mesa que vino a quedarse.', price: '$1,799', img: cazuela10l },
  { n: '05', name: 'Alitas o boneless', copy: 'BBQ, mango-habanero, tamarindo, chipotle o lemon pepper. Con una mega bebida al lado.', price: '$155', img: alitasMojito },
];

export const PROMOS = [
  '2×1 en copeo todos los días',
  'Cantarito chico de cortesía con mesa de 4+',
  'Cazuelas de 5 y 10 litros para la mesa',
  'Pulque 2×1 miércoles y jueves',
  'Karaoke viernes y sábado',
  'Birria estilo Jalisco desde $150',
];

export const WEEK = [
  { day: 2, short: 'Mar', name: 'Martes', hours: '10 AM – 2 AM', plan: '2×1 en copeo' },
  { day: 3, short: 'Mié', name: 'Miércoles', hours: '10 AM – 2 AM', plan: 'Pulque 2×1' },
  { day: 4, short: 'Jue', name: 'Jueves', hours: '10 AM – 2 AM', plan: 'Pulque 2×1' },
  { day: 5, short: 'Vie', name: 'Viernes', hours: '10 AM – 2 AM', plan: 'Karaoke' },
  { day: 6, short: 'Sáb', name: 'Sábado', hours: '10 AM – 2 AM', plan: 'Karaoke' },
  { day: 0, short: 'Dom', name: 'Domingo', hours: '10 AM – 2 AM', plan: 'Desayuno y birria' },
];

export const GALLERY: { img: StaticImageData; alt: string; label: string; span?: 'tall' | 'wide' }[] = [
  { img: barraCantaritos, alt: 'Bartender preparando cantaritos de barro en la barra', label: 'La barra', span: 'tall' },
  { img: gente1, alt: 'Grupo de amigos en una mesa de El Agave', label: 'Las noches' },
  { img: cenitalBirria, alt: 'Birria vista desde arriba con cebolla, cilantro y limón', label: 'Birria' },
  { img: alitasPapas, alt: 'Alitas y papas a la francesa bajo el letrero de neón', label: 'Snacks', span: 'wide' },
  { img: mojitosTrio, alt: 'Tres mega mojitos de sabores bajo el letrero de neón', label: 'Mega bebidas', span: 'tall' },
  { img: gente2, alt: 'Pareja brindando en El Agave', label: 'Brindis' },
  { img: carneJugo, alt: 'Carne en su jugo con frijoles y chiles', label: 'Carne en su jugo' },
  { img: birriaSalsas, alt: 'Birria con salsas y limones en mesa de madera', label: 'Consomé' },
  { img: gente3, alt: 'Amigos reunidos en la cantina', label: 'La mesa llena', span: 'wide' },
  { img: cantaritoPour, alt: 'Cantarito servido con escarchado de chile', label: 'Cantaritos', span: 'wide' },
];

export const FAQ = [
  { q: '¿Dónde están?', a: 'Tenemos dos sucursales en Tlalnepantla de Baz: Arboledas en Av. Niños Héroes #26, Res. El Dorado, y Centro en Av. Morelos #39, San Javier.' },
  { q: '¿Qué horario tienen?', a: 'De martes a domingo, de 10:00 AM a 2:00 AM. Los desayunos se sirven de 10:00 a 14:00 h. Los lunes descansamos.' },
  { q: '¿Cuánto cuesta la birria?', a: 'La birria estilo Jalisco mediana (120 g) cuesta $150 y la grande (170 g) $175. El consomé solo está en $40, el birriamen en $150 y la orden de 3 tacos de birria en $120.' },
  { q: '¿Cómo funciona el 2×1 en copeo?', a: 'Es todos los días, por persona e incluye un mezclador. Aplican restricciones: Hypnotic y Jägermeister no entran en ninguna preparación.' },
  { q: '¿Necesito reservar?', a: 'No es obligatorio, pero viernes y sábado se llena. Aparta tu mesa desde esta página o por WhatsApp al 55 1069 9414 y te confirmamos por el mismo chat.' },
  { q: '¿Hacen eventos y grupos?', a: 'Sí: cumpleaños, grupos de trabajo y reuniones. Para mesas grandes tenemos cazuelas de cantarito de 5 y 10 litros. Escríbenos por WhatsApp con anticipación.' },
  { q: '¿La propina está incluida?', a: 'No. La propina es opcional.' },
];
