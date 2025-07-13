import React from 'react';
import { Helmet } from 'react-helmet-async';

interface MetaTagsProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export const MetaTags: React.FC<MetaTagsProps> = ({ 
  title = "Platges de Badalona - Estat en temps real",
  description = "Consulta l'estat actual de les platges de Badalona en temps real. Informació sobre banderes, estat del mar, qualitat de l'aigua i presència de meduses.",
  image = "https://platges.bdnmedia.cat/fotos/portada.webp",
  url = "https://platges.bdnmedia.cat/"
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  );
};