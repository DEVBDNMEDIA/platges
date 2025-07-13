export const getIconUrl = (type: string, value: string): string => {
  const baseUrl = 'https://platges.bdnmedia.cat/icons/';
  
  switch (type) {
    case 'bandera':
      switch (value.toLowerCase()) {
        case 'verda':
          return `${baseUrl}bandera_verda.png`;
        case 'groga':
          return `${baseUrl}bandera_groga.png`;
        case 'vermella':
          return `${baseUrl}bandera_vermella.png`;
        default:
          return `${baseUrl}bandera_desconegut.png`;
      }
    case 'estat':
      switch (value.toLowerCase()) {
        case 'plana':
          return `${baseUrl}estat_mar_plana.png`;
        case 'arrissada':
          return `${baseUrl}estat_mar_arrissada.png`;
        case 'maror':
          return `${baseUrl}estat_mar_maror.png`;
        default:
          return 'https://www.amb.cat/o/amb-theme/images/amb/meteo/estat_mar_desconegut.png';
      }
    case 'aspecte':
      switch (value.toLowerCase()) {
        case 'bo':
          return `${baseUrl}aigua_bo.png`;
        case 'deficient':
          return `${baseUrl}aigua_deficient.png`;
        default:
          return 'https://www.amb.cat/o/amb-theme/images/amb/meteo/aigua_desconegut.png';
      }
    case 'meduses':
      return value ? `${baseUrl}meduses_si.png` : `${baseUrl}meduses_no.png`;
    default:
      return '';
  }
};

export const formatPlatjaName = (platjaName: string): string => {
  const parts = platjaName.split('.');
  if (parts.length > 1) {
    const name = parts[1];
    // Casos especials
    if (name === 'l_estacio') return 'Estació';
    if (name === 'vela') return 'Patins de Vela';
    if (name === 'botifarreta') return 'Pont d\'en Botifarreta';
    
    return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
  return platjaName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export const getStatusColor = (bandera: string) => {
  switch (bandera.toLowerCase()) {
    case 'verda':
      return 'border-green-500 bg-green-50';
    case 'groga':
      return 'border-yellow-500 bg-yellow-50';
    case 'vermella':
      return 'border-red-500 bg-red-50';
    default:
      return 'border-gray-400 bg-gray-50';
  }
};

export const getStatusBadgeColor = (bandera: string) => {
  switch (bandera.toLowerCase()) {
    case 'verda':
      return 'bg-green-100 text-green-800';
    case 'groga':
      return 'bg-yellow-100 text-yellow-800';
    case 'vermella':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const formatMunicipi = (municipi: string): string => {
  const municipiMap: { [key: string]: string } = {
    'Badalona': 'Badalona',
    'Barcelona': 'Barcelona',
    'Castelldefels': 'Castelldefels',
    'Gavà': 'Gavà',
    'El Prat de Llobregat': 'El Prat de Llobregat',
    'Montgat': 'Montgat',
    'Sant Adrià de Besòs': 'Sant Adrià de Besòs',
    'Viladecans': 'Viladecans'
  };
  
  return municipiMap[municipi] || municipi;
};