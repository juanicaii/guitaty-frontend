import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Drawer } from 'vaul';
import {
  XMarkIcon,
  ArrowUpRightIcon,
  ArrowDownLeftIcon,
  ArrowsRightLeftIcon,
  DocumentTextIcon,
  PaintBrushIcon,
  FaceSmileIcon,
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
import { TransactionType, CreateCategoryRequest, Category } from '@/types';

interface AddCategorySheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCategoryRequest) => void;
  onUpdate?: (id: string, data: CreateCategoryRequest) => void;
  isLoading?: boolean;
  editingCategory?: Category | null;
}

const transactionTypes = [
  {
    value: TransactionType.EXPENSE,
    label: 'Gasto',
    icon: ArrowUpRightIcon,
    color: 'red',
    description: 'Dinero que sale'
  },
  {
    value: TransactionType.INCOME,
    label: 'Ingreso',
    icon: ArrowDownLeftIcon,
    color: 'green',
    description: 'Dinero que entra'
  },
  {
    value: TransactionType.TRANSFER,
    label: 'Transferencia',
    icon: ArrowsRightLeftIcon,
    color: 'blue',
    description: 'Entre cuentas'
  },
];

const commonIcons = [
  { icon: HomeIcon, name: 'Hogar', id: 'HomeIcon' },
  { icon: ShoppingCartIcon, name: 'Compras', id: 'ShoppingCartIcon' },
  { icon: CarIcon, name: 'Transporte', id: 'CarIcon' },
  { icon: FilmIcon, name: 'Entretenimiento', id: 'FilmIcon' },
  { icon: MedicalIcon, name: 'Salud', id: 'MedicalIcon' },
  { icon: AcademicCapIcon, name: 'Educación', id: 'AcademicCapIcon' },
  { icon: MusicalNoteIcon, name: 'Música', id: 'MusicalNoteIcon' },
  { icon: CameraIcon, name: 'Fotografía', id: 'CameraIcon' },
  { icon: PhoneIcon, name: 'Comunicación', id: 'PhoneIcon' },
  { icon: ComputerDesktopIcon, name: 'Tecnología', id: 'ComputerDesktopIcon' },
  { icon: CoffeeIcon, name: 'Café', id: 'CoffeeIcon' },
  { icon: GiftIcon, name: 'Regalos', id: 'GiftIcon' },
  { icon: HeartIcon, name: 'Salud', id: 'HeartIcon' },
  { icon: BookOpenIcon, name: 'Libros', id: 'BookOpenIcon' },
  { icon: BeakerIcon, name: 'Ciencia', id: 'BeakerIcon' },
  { icon: BriefcaseIcon, name: 'Trabajo', id: 'BriefcaseIcon' },
  { icon: ClockIcon, name: 'Tiempo', id: 'ClockIcon' },
  { icon: CurrencyDollarIcon, name: 'Dinero', id: 'CurrencyDollarIcon' },
  { icon: FlagIcon, name: 'Viajes', id: 'FlagIcon' },
  { icon: LightBulbIcon, name: 'Ideas', id: 'LightBulbIcon' },
  { icon: MapPinIcon, name: 'Ubicación', id: 'MapPinIcon' },
  { icon: PresentationChartLineIcon, name: 'Finanzas', id: 'PresentationChartLineIcon' },
  { icon: StarIcon, name: 'Favoritos', id: 'StarIcon' },
  { icon: SunIcon, name: 'Vacaciones', id: 'SunIcon' },
  { icon: UserIcon, name: 'Personal', id: 'UserIcon' },
  { icon: WrenchScrewdriverIcon, name: 'Herramientas', id: 'WrenchScrewdriverIcon' },
  { icon: BuildingStorefrontIcon, name: 'Tienda', id: 'BuildingStorefrontIcon' },
  { icon: GlobeAltIcon, name: 'Internet', id: 'GlobeAltIcon' },
];

const colorOptions = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#64748b'
];

// Helper function to get icon component by ID
const getIconComponent = (iconId: string) => {
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

  return iconMap[iconId] || HomeIcon;
};

export function AddCategorySheet({
  isOpen,
  onClose,
  onSubmit,
  onUpdate,
  isLoading = false,
  editingCategory = null,
}: AddCategorySheetProps) {
  const isEditing = !!editingCategory;
  const [formData, setFormData] = useState<CreateCategoryRequest>({
    name: '',
    type: TransactionType.EXPENSE,
    color: '#ef4444',
    icon: 'HomeIcon',
  });

  // Load editing data or reset form
  useEffect(() => {
    if (isOpen && isEditing && editingCategory) {
      setFormData({
        name: editingCategory.name,
        type: editingCategory.type,
        color: editingCategory.color || '#ef4444',
        icon: editingCategory.icon || 'HomeIcon',
      });
    } else if (!isOpen) {
      setTimeout(() => {
        setFormData({
          name: '',
          type: TransactionType.EXPENSE,
          color: '#ef4444',
          icon: 'HomeIcon',
        });
      }, 300);
    }
  }, [isOpen, isEditing, editingCategory]);

  const handleSubmit = () => {
    if (!formData.name) return;

    if (isEditing && editingCategory && onUpdate) {
      onUpdate(editingCategory.id, formData);
    } else {
      onSubmit(formData);
    }

    // Don't close or reset form here - let the parent handle it in onSuccess
  };

  console.log('AddCategorySheet render:', { isOpen });

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(open) => {
        console.log('Category Drawer onOpenChange:', open);
        if (!open) {
          onClose();
        }
      }}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-white dark:bg-gray-900 flex flex-col rounded-t-[20px] h-[90%] fixed bottom-0 left-0 right-0 outline-none">
          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 dark:bg-gray-700 mb-4 mt-4" />

          {/* Header */}
          <div className="flex items-center justify-between px-4 pb-4 flex-shrink-0">
            <Drawer.Title className="text-xl font-semibold text-gray-900 dark:text-white">
              {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
            </Drawer.Title>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800"
              type="button"
            >
              <XMarkIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="px-4 overflow-y-auto flex-1 min-h-0 ">
            {/* Category Name */}
            <div className="mb-6">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <DocumentTextIcon className="w-4 h-4 mr-1.5" />
                Nombre de la Categoría
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Comida, Transporte, Salario"
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl
                         text-gray-900 dark:text-white placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Transaction Type */}
            <div className="mb-6">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                🔄 Tipo de Transacción
              </label>
              <div className="space-y-3">
                {transactionTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <motion.button
                      key={type.value}
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData({
                        ...formData,
                        type: type.value,
                        color: type.color === 'red' ? '#ef4444' : type.color === 'green' ? '#22c55e' : '#3b82f6'
                      })}
                      className={`
                        w-full p-4 rounded-xl border-2 transition-all text-left
                        ${formData.type === type.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`
                          p-3 rounded-xl
                          ${type.color === 'red' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                            type.color === 'green' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                            'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          }
                        `}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {type.label}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {type.description}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Icon Selector */}
            <div className="mb-6">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <FaceSmileIcon className="w-4 h-4 mr-1.5" />
                Ícono
              </label>

              {/* Icons grid */}
              <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto">
                {commonIcons.map((iconData) => {
                  const IconComponent = iconData.icon;
                  const iconId = iconData.id;
                  return (
                    <motion.button
                      key={iconId}
                      type="button"
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setFormData({ ...formData, icon: iconId })}
                      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                      className={`
                        p-3 rounded-lg border transition-all flex flex-col items-center space-y-1
                        select-none cursor-pointer
                        ${formData.icon === iconId
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }
                      `}
                    >
                      <IconComponent className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400 truncate w-full text-center select-none">
                        {iconData.name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Color Selector */}
            <div className="mb-6">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <PaintBrushIcon className="w-4 h-4 mr-1.5" />
                Color
              </label>
              <div className="grid grid-cols-9 gap-2">
                {colorOptions.map((color) => (
                  <motion.button
                    key={color}
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setFormData({ ...formData, color })}
                    className={`
                      w-10 h-10 rounded-xl border-4 transition-all
                      ${formData.color === color
                        ? 'border-gray-800 dark:border-white scale-110'
                        : 'border-gray-200 dark:border-gray-700'
                      }
                    `}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Vista Previa
              </label>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div
                    className="p-3 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${formData.color}20` }}
                  >
                    {(() => {
                      const IconComponent = getIconComponent(formData.icon || 'HomeIcon');
                      return (
                        <IconComponent
                          className="w-6 h-6"
                          style={{ color: formData.color }}
                        />
                      );
                    })()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formData.name || 'Nombre de categoría'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {transactionTypes.find(t => t.value === formData.type)?.label}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex px-4  border-gray-200 dark:border-gray-700 pb-24">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={!formData.name || isLoading}
              className={`
                w-full py-4 rounded-xl font-semibold text-white
                ${!formData.name || isLoading
                  ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
                }
                transition-colors duration-200
              `}
            >
              {isLoading
                ? (isEditing ? 'Guardando...' : 'Creando...')
                : (isEditing ? 'Guardar Cambios' : 'Crear Categoría')
              }
            </motion.button>
          </div>

          </div>

          
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}