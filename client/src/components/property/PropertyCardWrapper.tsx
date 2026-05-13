'use client';

import { motion } from 'framer-motion';
import { PropertyCard } from './PropertyCard';
import { Property } from '@/types';

interface PropertyCardWrapperProps {
  property: Property;
  index: number;
}

export function PropertyCardWrapper({ property, index }: PropertyCardWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <PropertyCard property={property} />
    </motion.div>
  );
}