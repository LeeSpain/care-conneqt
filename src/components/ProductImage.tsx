import { useProductImage } from '@/hooks/useProductImage';

interface ProductImageProps {
  slug: string;
  imageUrl: string | null;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export const ProductImage = ({ slug, imageUrl, alt, className, loading = 'lazy' }: ProductImageProps) => {
  const src = useProductImage(slug, imageUrl);
  
  return (
    <img 
      src={src} 
      alt={alt}
      className={className}
      loading={loading}
    />
  );
};
