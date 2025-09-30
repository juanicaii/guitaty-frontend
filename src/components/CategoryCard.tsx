import { motion } from 'framer-motion';
import {
  ArrowUpRightIcon,
  ArrowDownLeftIcon,
  ArrowsRightLeftIcon,
  EllipsisVerticalIcon,
  HomeIcon,
  ShoppingCartIcon,
  TruckIcon as CarIcon,
  FilmIcon,
  HeartIcon as MedicalIcon,
  AcademicCapIcon,
  MusicalNoteIcon,
  CameraIcon,
  PhoneIcon,
  ComputerDesktopIcon,
  BeakerIcon as CoffeeIcon,
  GiftIcon,
  HeartIcon,
  BookOpenIcon,
  BeakerIcon,
  BriefcaseIcon,
  ClockIcon,
  CurrencyDollarIcon,
  FlagIcon,
  LightBulbIcon,
  MapPinIcon,
  PresentationChartLineIcon,
  StarIcon,
  SunIcon,
  UserIcon,
  WrenchScrewdriverIcon,
  BuildingStorefrontIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { Category, TransactionType } from '@/types';

interface CategoryCardProps {
  category: Category;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
}

const typeIcons = {
  [TransactionType.INCOME]: ArrowDownLeftIcon,
  [TransactionType.EXPENSE]: ArrowUpRightIcon,
  [TransactionType.TRANSFER]: ArrowsRightLeftIcon,
};

const typeColors = {
  [TransactionType.INCOME]: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-600 dark:text-green-400',
    badge: 'bg-green-500',
  },
  [TransactionType.EXPENSE]: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-600 dark:text-red-400',
    badge: 'bg-red-500',
  },
  [TransactionType.TRANSFER]: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-600 dark:text-blue-400',
    badge: 'bg-blue-500',
  },
};

const typeLabels = {
  [TransactionType.INCOME]: 'Ingreso',
  [TransactionType.EXPENSE]: 'Gasto',
  [TransactionType.TRANSFER]: 'Transferencia',
};

// Helper function to get icon component by name
const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, any> = {
    HomeIcon,
    ShoppingCartIcon,
    CarIcon,
    FilmIcon,
    MedicalIcon,
    AcademicCapIcon,
    MusicalNoteIcon,
    CameraIcon,
    PhoneIcon,
    ComputerDesktopIcon,
    CoffeeIcon,
    GiftIcon,
    HeartIcon,
    BookOpenIcon,
    BeakerIcon,
    BriefcaseIcon,
    ClockIcon,
    CurrencyDollarIcon,
    FlagIcon,
    LightBulbIcon,
    MapPinIcon,
    PresentationChartLineIcon,
    StarIcon,
    SunIcon,
    UserIcon,
    WrenchScrewdriverIcon,
    BuildingStorefrontIcon,
    GlobeAltIcon,
  };

  return iconMap[iconName] || HomeIcon;
};

export function CategoryCard({ category, onEdit, onDelete, onClick }: CategoryCardProps) {
  const Icon = typeIcons[category.type];
  const colors = typeColors[category.type];

  return (
    <motion.div
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`
        bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4
        border border-gray-100 dark:border-gray-700
        ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          {/* Custom icon or default icon */}
          <div className={`p-2.5 rounded-xl ${colors.bg}`}>
            {category.icon ? (
              (() => {
                const CustomIcon = getIconComponent(category.icon);
                return (
                  <CustomIcon
                    className="w-5 h-5"
                    style={{ color: category.color || colors.text.includes('green') ? '#22c55e' : colors.text.includes('red') ? '#ef4444' : '#3b82f6' }}
                  />
                );
              })()
            ) : (
              <Icon className={`w-5 h-5 ${colors.text}`} />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {category.name}
            </h3>
            <p className={`text-sm ${colors.text}`}>
              {typeLabels[category.type]}
            </p>
          </div>
        </div>

        {(onEdit || onDelete) && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <EllipsisVerticalIcon className="w-5 h-5 text-gray-400" />
          </motion.button>
        )}
      </div>

      {/* Color indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div
            className="w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"
            style={{ backgroundColor: category.color || colors.badge }}
          />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Color de categoría
          </span>
        </div>

        {/* Type badge */}
        <div className={`px-2 py-1 rounded-full ${colors.bg}`}>
          <span className={`text-xs font-medium ${colors.text}`}>
            {typeLabels[category.type]}
          </span>
        </div>
      </div>
    </motion.div>
  );
}