export interface TransportInfo {
  platjaKey: string;
  platjaName: string;
  publicTransport: {
    bus?: {
      direct?: string[];
      walking5min?: string[];
      walking8min?: string[];
      walking10min?: string[];
    };
    metro?: {
      line: string;
      station: string;
      walkingTime: string;
    }[];
    train?: {
      station: string;
      walkingTime?: string;
      notes?: string;
    }[];
    tram?: {
      station: string;
      walkingTime?: string;
      notes?: string;
    }[];
  };
  privateTransport: {
    parking: string;
    notes?: string;
  };
  occupation: string;
  beachType?: string;
  status?: string;
}

export const transportData: TransportInfo[] = [
  {
    platjaKey: 'mora',
    platjaName: 'La Mora',
    publicTransport: {
      bus: {
        direct: ['B7']
      },
      tram: [
        {
          station: 'Sant Adrià del Besòs',
          walkingTime: 'lluny',
          notes: 'connectable amb B7'
        }
      ],
      train: [
        {
          station: 'Sant Adrià del Besòs',
          walkingTime: 'lluny',
          notes: 'connectable amb B7'
        }
      ]
    },
    privateTransport: {
      parking: 'Mitjà. Al barri de la Mora (espai moderat)'
    },
    occupation: 'Nul·la',
    status: 'Tancada'
  },
  {
    platjaKey: 'la_marina',
    platjaName: 'La Marina',
    publicTransport: {
      bus: {
        direct: ['B7']
      },
      tram: [
        {
          station: 'Sant Adrià del Besòs',
          walkingTime: 'lluny',
          notes: 'connectable amb B7'
        }
      ],
      train: [
        {
          station: 'Sant Adrià del Besòs',
          walkingTime: 'lluny',
          notes: 'connectable amb B7'
        }
      ]
    },
    privateTransport: {
      parking: 'Mitjà. També pel barri de la Mora'
    },
    occupation: 'Normal (platja petita)'
  },
  {
    platjaKey: 'coco',
    platjaName: 'Coco',
    publicTransport: {
      bus: {
        direct: ['B7'],
        walking5min: ['B3', 'B4', 'B5']
      },
      metro: [
        {
          line: 'L2',
          station: 'Pep Ventura',
          walkingTime: '10 min'
        },
        {
          line: 'L2 I L10N',
          station: 'Gorg',
          walkingTime: '10 min'
        }
      ]
    },
    privateTransport: {
      parking: 'Molt limitat. Dins ciutat, a proximitat de les vies del tren (costat ciutat)'
    },
    occupation: 'Elevada',
    beachType: 'Naturalista'
  },
  {
    platjaKey: 'pont_del_petroli',
    platjaName: 'Pont del Petroli',
    publicTransport: {
      bus: {
        direct: ['M1', 'B4', 'B5', 'B7', 'M6'],
        walking5min: ['B3', 'B29', 'M26']
      },
      metro: [
        {
          line: 'L2',
          station: 'Pep Ventura',
          walkingTime: '10 min'
        }
      ],
      train: [
        {
          station: 'Badalona',
          walkingTime: '5 min'
        }
      ]
    },
    privateTransport: {
      parking: 'Molt limitat. Dins ciutat, a proximitat de les vies del tren (costat ciutat)'
    },
    occupation: 'Elevada'
  },
  {
    platjaKey: 'l_estaci',
    platjaName: 'L\'Estació',
    publicTransport: {
      bus: {
        direct: ['M1', 'B4', 'B5', 'B7', 'M6'],
        walking5min: ['B3', 'B29', 'M26']
      },
      metro: [
        {
          line: 'L2',
          station: 'Badalona Pompeu Fabra',
          walkingTime: '10 min'
        }
      ],
      train: [
        {
          station: 'Badalona'
        }
      ]
    },
    privateTransport: {
      parking: 'Concorregut. Hi ha parking zona blava just davant de la platja'
    },
    occupation: 'Elevada'
  },
  {
    platjaKey: 'patins_de_vela',
    platjaName: 'Patins de Vela',
    publicTransport: {
      bus: {
        direct: ['M1', 'B4', 'B5', 'B7', 'M6'],
        walking5min: ['B3', 'B29', 'M26']
      },
      metro: [
        {
          line: 'L2',
          station: 'Badalona Pompeu Fabra',
          walkingTime: '10 min'
        }
      ],
      train: [
        {
          station: 'Badalona'
        }
      ]
    },
    privateTransport: {
      parking: 'Concorregut. També amb zona blava davant de l\'estació'
    },
    occupation: 'Normal - Elevada'
  },
  {
    platjaKey: 'pescadors',
    platjaName: 'Pescadors',
    publicTransport: {
      bus: {
        direct: ['M1', 'B4', 'B5', 'B7'],
        walking8min: ['B3', 'B29', 'M26'],
        walking10min: ['B2', 'B8', 'B25', 'M27', 'M28', 'M30', 'N2', 'N9', 'N11']
      },
      metro: [
        {
          line: 'L2',
          station: 'Badalona Pompeu Fabra',
          walkingTime: '10 min'
        }
      ],
      train: [
        {
          station: 'Badalona',
          walkingTime: '5 min'
        }
      ]
    },
    privateTransport: {
      parking: 'No hi ha aparcament directe a la zona'
    },
    occupation: 'Elevada'
  },
  {
    platjaKey: 'pont_d_en_botifarreta',
    platjaName: 'Pont d\'en Botifarreta',
    publicTransport: {
      bus: {
        walking5min: ['B2', 'B4', 'B7', 'B29', 'M30', 'C10', 'N9']
      }
    },
    privateTransport: {
      parking: 'Escàs. Dins ciutat, a proximitat de les vies del tren (costat ciutat)'
    },
    occupation: 'Normal'
  },
  {
    platjaKey: 'cristall',
    platjaName: 'Cristall',
    publicTransport: {
      bus: {
        walking5min: ['B2', 'B29', 'M30', 'C10', 'N9']
      }
    },
    privateTransport: {
      parking: 'Pot haver-n\'hi a prop de les vies (costat ciutat). També al polígon de Can Ribó'
    },
    occupation: 'Normal - Baixa'
  },
  {
    platjaKey: 'barca_maria',
    platjaName: 'Barca Maria',
    publicTransport: {
      bus: {
        walking5min: ['B29', 'M30', 'C10', 'N9']
      }
    },
    privateTransport: {
      parking: 'Possible a prop de les vies (costat ciutat, lateral N-II). També al polígon de Can Ribó o al barri de Manresà',
      notes: '⚠️ Diverses Zones de residents al barri de Manresà'
    },
    occupation: 'Normal - Baixa'
  }
];