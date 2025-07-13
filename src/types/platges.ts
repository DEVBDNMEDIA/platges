export interface Platja {
  _id: string;
  meduses: boolean | string;
  data_report_ocupacio: string;
  estat_aigua: string;
  municipi: string;
  platja: string;
  bandera: string;
  aspecte_aigua: string;
  lang: string;
  ocupacio: string;
  disponible: boolean | string;
  date_updated: string;
}

export interface PlatgesResponse {
  num: number;
  count: number;
  start: number;
  offset: number;
  isCursor: boolean;
  items: Platja[];
}

export interface PlatjaInfo {
  name: string;
  apiName: string;
  description: string;
  length: number;
  surface: number;
  image: string;
  order: number;
  googleMapsUrl: string;
  specialFeatures?: {
    banderaBlava?: boolean;
    platjaGossos?: boolean;
    tancada?: boolean;
    tancadaReason?: string;
    noDutxes?: boolean;
    accessibilitat?: {
      acompanyament?: boolean;
      passera?: boolean;
      dutxes?: boolean;
      baranes?: boolean;
      banderesInclusives?: boolean;
    };
  };
  secondaryImages?: string[];
}

export interface Servei {
  geolocalitzacio: [number, number][];
  tipus_key: string;
  tipus: string;
}

export interface PlatjaServei {
  _id: string;
  platja_municipi_key: string;
  platja: string;
  serveis: Servei[];
  lang: string;
  platja_key: string;
  date_updated: string;
}

export interface ServeisResponse {
  num: number;
  count: number;
  start: number;
  offset: number;
  isCursor: boolean;
  items: PlatjaServei[];
}

export interface Avis {
  id: number;
  titol: string;
  contingut: string;
  platges_afectades: string[];
  nivell: 'perill' | 'precaucio' | 'informatiu';
  date_created: string;
  date_updated: string;
}

export interface AvisosResponse {
  count: number;
  items: Avis[];
}