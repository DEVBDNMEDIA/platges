import { PlatjaInfo } from '../types/platges';

export const platgesInfo: PlatjaInfo[] = [
  {
    name: 'La Mora',
    apiName: 'platja_badalona.mora',
    description: 'Platja situada al sud de Badalona, punt d\'inici del nostre litoral urbà.',
    length: 0,
    surface: 0,
    image: 'https://platges.bdnmedia.cat/wp-content/uploads/2025/01/great.jpg',
    order: 1,
    googleMapsUrl: 'https://maps.app.goo.gl/po5tGm44apJ8mKXU7',
    specialFeatures: {
      tancada: true,
      tancadaReason: 'El 2019 es va posar de manifest que la sorra de la platja estava contaminada amb metalls pesants (arsènic, seleni i crom) procedents de l\'antiga fàbrica Cros, que suposen un problema de salut pública per a les persones. La platja es va tancar al públic amb tanques a l\'espera que el Ministeri de Transició Ecològica i Repte Demogràfic es faci càrrec de la descontaminació. La previsió d\'aquest Ministeri és que les tasques de descontaminació no es faran abans del 2027.',
      accessibilitat: {
        acompanyament: false,
        passera: false,
        dutxes: false,
        baranes: false,
        banderesInclusives: false
      }
    },
    secondaryImages: [
      'https://platges.bdnmedia.cat/wp-content/uploads/2025/01/great.jpg',
      'https://www.amb.cat/documents/11656/486081/BDN_Coco_2025.jpg'
    ]
  },
  {
    name: 'La Marina',
    apiName: 'platja_badalona.la_marina',
    description: 'Platja Marina, situada al sector sud del litoral badaloní.',
    length: 0,
    surface: 0,
    image: 'https://platges.bdnmedia.cat/wp-content/uploads/2025/01/great.jpg',
    order: 2,
    googleMapsUrl: 'https://maps.app.goo.gl/kNDCC8n2NRvc6d2AA',
    specialFeatures: {
      banderaBlava: true,
      accessibilitat: {
        acompanyament: false,
        passera: true,
        dutxes: true,
        baranes: false,
        banderesInclusives: false
      }
    },
    secondaryImages: [
      'https://platges.bdnmedia.cat/wp-content/uploads/2025/01/great.jpg',
      'https://www.amb.cat/documents/11656/486081/BDN_Coco_2025.jpg'
    ]
  },
  {
    name: 'Coco',
    apiName: 'platja_badalona.coco',
    description: 'Ubicada entre el carrer Cervantes i la plaça dels Patins de Vela, la platja del Coco rep el seu nom per l\'activitat de l\'antiga fàbrica CACI, sigla de la Companyia Auxiliar del Comerç i la Indústria coneguda popularment com "la fàbrica del coco".',
    length: 170,
    surface: 13579.35,
    image: 'https://www.amb.cat/documents/11656/486081/BDN_Coco_2025.jpg',
    order: 3,
    googleMapsUrl: 'https://maps.app.goo.gl/WnHfKxLeR4BFCpsv7',
    specialFeatures: {
      banderaBlava: true,
      accessibilitat: {
        acompanyament: false,
        passera: false,
        dutxes: true,
        baranes: false,
        banderesInclusives: false
      }
    },
    secondaryImages: [
      'https://www.amb.cat/documents/11656/486081/BDN_Coco_2025.jpg',
      'https://platges.bdnmedia.cat/wp-content/uploads/2025/01/great.jpg'
    ]
  },
  {
    name: 'Pont del Petroli',
    apiName: 'platja_badalona.pont_del_petroli',
    description: 'Ubicada entre l\'avinguda Sant Ignasi de Loiola i la plaça dels Patins de Vela, rep el seu nom del pont del Petroli, utilitzat avui en dia com a mirador de la ciutat. En aquesta platja podem trobar la fàbrica d\'Anís del Mono.',
    length: 420,
    surface: 29488.67,
    image: 'https://www.amb.cat/documents/11656/486083/BDN_pont_petroli_2025.jpg',
    order: 4,
    googleMapsUrl: 'https://maps.app.goo.gl/AiS3qe5mdRWpEWqEA',
    specialFeatures: {
      banderaBlava: true,
      accessibilitat: {
        acompanyament: false,
        passera: true,
        dutxes: true,
        baranes: true,
        banderesInclusives: true
      }
    },
    secondaryImages: [
      'https://www.amb.cat/documents/11656/486083/BDN_pont_petroli_2025.jpg',
      'https://platges.bdnmedia.cat/wp-content/uploads/2025/01/great.jpg'
    ]
  },
  {
    name: 'L\'Estació',
    apiName: 'platja_badalona.l_estaci',
    description: 'Anomenada així donat que es troba situada just al davant de l\'estació de tren de Badalona. Està ubicada entre l\'avinguda Martí Pujol i l\'avinguda Sant Ignasi de Loiola. És una platja molt animada i amb una ampla oferta de serveis d\'oci i esport.',
    length: 355,
    surface: 18315.08,
    image: 'https://www.amb.cat/documents/11656/486088/BDN_estacio_2025.jpg',
    order: 5,
    googleMapsUrl: 'https://maps.app.goo.gl/61wT3Cj7qDjmKGoL9',
    specialFeatures: {
      banderaBlava: true,
      accessibilitat: {
        acompanyament: false,
        passera: false,
        dutxes: true,
        baranes: false,
        banderesInclusives: false
      }
    },
    secondaryImages: [
      'https://www.amb.cat/documents/11656/486088/BDN_estacio_2025.jpg',
      'https://platges.bdnmedia.cat/wp-content/uploads/2025/01/great.jpg'
    ]
  },
  {
    name: 'Patins de Vela',
    apiName: 'platja_badalona.patins_de_vela',
    description: 'És la platja més coneguda de Badalona ja què és on es troba el Club Natació Badalona i on es concentren tots els amants de la vela. Està ubicada entre l\'avinguda Martí Pujol i el carrer de Mar. Disposa d\'una zona específica per a gossos.',
    length: 120,
    surface: 5768.57,
    image: 'https://www.amb.cat/documents/11656/486091/BDN_patinsvela_2025.jpg',
    order: 6,
    googleMapsUrl: 'https://maps.app.goo.gl/2MpAfZfbNkjDKrw17',
    specialFeatures: {
      platjaGossos: true,
      accessibilitat: {
        acompanyament: false,
        passera: false,
        dutxes: true,
        baranes: false,
        banderesInclusives: false
      }
    },
    secondaryImages: [
      'https://www.amb.cat/documents/11656/486091/BDN_patinsvela_2025.jpg',
      'https://platges.bdnmedia.cat/wp-content/uploads/2025/01/great.jpg'
    ]
  },
  {
    name: 'Pescadors',
    apiName: 'platja_badalona.pescadors',
    description: 'Ubicada entre el Carrer de Mar i la Riera Matamoros és la platja més accessible des del centre. Transcorre en paral·lel amb la Rambla de Badalona, i com el seu nom indica és la platja on feinegen els pescadors.',
    length: 470,
    surface: 32561.17,
    image: 'https://www.amb.cat/documents/11656/486093/BDN_pescadors_2025.jpg',
    order: 7,
    googleMapsUrl: 'https://maps.app.goo.gl/EnxxXdZnczrjRqMH6',
    specialFeatures: {
      banderaBlava: true,
      accessibilitat: {
        acompanyament: true,
        passera: true,
        dutxes: true,
        baranes: true,
        banderesInclusives: true
      }
    },
    secondaryImages: [
      'https://www.amb.cat/documents/11656/486093/BDN_pescadors_2025.jpg',
      'https://platges.bdnmedia.cat/wp-content/uploads/2025/01/great.jpg'
    ]
  },
  {
    name: 'Pont d\'en Botifarreta',
    apiName: 'platja_badalona.pont_d_en_botifarreta',
    description: 'La platja del Pont d\'en Botifarreta està situada entre el carrer la Riera Matamoros i la Riera Canyadó. És una de les més concorregudes de Badalona on es troba l\'actiu Club Nàutic Bétulo, que organitza tot tipus d\'activitats esportives.',
    length: 625,
    surface: 23272.35,
    image: 'https://www.amb.cat/documents/11656/486095/BDN_botifarreta_2025.jpg',
    order: 8,
    googleMapsUrl: 'https://maps.app.goo.gl/A2EaxcPdzdbCAxEKA',
    specialFeatures: {
      accessibilitat: {
        acompanyament: true,
        passera: true,
        dutxes: true,
        baranes: false,
        banderesInclusives: true
      }
    },
    secondaryImages: [
      'https://www.amb.cat/documents/11656/486095/BDN_botifarreta_2025.jpg',
      'https://platges.bdnmedia.cat/wp-content/uploads/2025/01/great.jpg'
    ]
  },
  {
    name: 'Cristall',
    apiName: 'platja_badalona.cristall',
    description: 'Situada entre la Riera Canyadó i el Torrent Vallmajor, la platja del Cristall rep el seu nom de l\'antiga fàbrica anomenada originàriament Cristall Badalona dedicada a la producció artesanal del vidre.',
    length: 300,
    surface: 12732.66,
    image: 'https://www.amb.cat/documents/11656/486098/BDN_cristall_2025.jpg',
    order: 9,
    googleMapsUrl: 'https://maps.app.goo.gl/ymVJAntLNDyUhWhy5',
    specialFeatures: {
      accessibilitat: {
        acompanyament: false,
        passera: false,
        dutxes: true,
        baranes: false,
        banderesInclusives: false
      }
    },
    secondaryImages: [
      'https://www.amb.cat/documents/11656/486098/BDN_cristall_2025.jpg',
      'https://platges.bdnmedia.cat/wp-content/uploads/2025/01/great.jpg'
    ]
  },
  {
    name: 'Barca Maria',
    apiName: 'platja_badalona.barca_maria',
    description: 'La platja que està situada al nord ubicada entre el Torrent Vallmajor i el límit amb Montgat, es troba davant del conegut barri de la Manresà.',
    length: 660,
    surface: 35736.61,
    image: 'https://www.amb.cat/documents/11656/486100/BDN_barca_maria_2025.jpg',
    order: 10,
    googleMapsUrl: 'https://maps.app.goo.gl/T8D1d6C2BXmBJd21A',
    specialFeatures: {
      noDutxes: true, // Especial per Barca Maria - no té dutxes
      accessibilitat: {
        acompanyament: false,
        passera: false,
        dutxes: false,
        baranes: false,
        banderesInclusives: false
      }
    },
    secondaryImages: [
      'https://www.amb.cat/documents/11656/486100/BDN_barca_maria_2025.jpg',
      'https://platges.bdnmedia.cat/wp-content/uploads/2025/01/great.jpg'
    ]
  }
];