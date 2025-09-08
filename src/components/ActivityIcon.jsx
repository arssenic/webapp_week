import React from 'react';
import {
  SunIcon,
  FilmIcon,
  BookOpenIcon,
  ShoppingBagIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const iconMap = {
  Outdoors: <SunIcon className="h-6 w-6 text-green-500" />,
  Entertainment: <FilmIcon className="h-6 w-6 text-purple-500" />,
  Solo: <BookOpenIcon className="h-6 w-6 text-blue-500" />,
  Food: <ShoppingBagIcon className="h-6 w-6 text-orange-500" />,
  Default: <SparklesIcon className="h-6 w-6 text-gray-400" />,
};

export default function ActivityIcon({ category }) {
  return iconMap[category] || iconMap.Default;
}