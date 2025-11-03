import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { X, UtensilsCrossed, Car, ShoppingCart, Home, Clapperboard, Heart, GraduationCap, Dumbbell, Plane, PawPrint, Gift, MoreHorizontal, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCategory, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/lib/hooks'
import { Skeleton } from '@/components/ui/Skeleton'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import type { TransactionType } from '@/lib/api/types'

interface IconOption {
  id: string
  name: string
  icon: React.ReactNode
}

const ICON_OPTIONS: IconOption[] = [
  { id: 'UtensilsCrossedIcon', name: 'Comida', icon: <UtensilsCrossed className="size-7" /> },
  { id: 'CarIcon', name: 'Transporte', icon: <Car className="size-7" /> },
  { id: 'ShoppingCartIcon', name: 'Compras', icon: <ShoppingCart className="size-7" /> },
  { id: 'HomeIcon', name: 'Hogar', icon: <Home className="size-7" /> },
  { id: 'ClapperboardIcon', name: 'Ocio', icon: <Clapperboard className="size-7" /> },
  { id: 'HeartIcon', name: 'Salud', icon: <Heart className="size-7" /> },
  { id: 'GraduationCapIcon', name: 'Educación', icon: <GraduationCap className="size-7" /> },
  { id: 'DumbbellIcon', name: 'Deportes', icon: <Dumbbell className="size-7" /> },
  { id: 'PlaneIcon', name: 'Viajes', icon: <Plane className="size-7" /> },
  { id: 'PawPrintIcon', name: 'Mascotas', icon: <PawPrint className="size-7" /> },
  { id: 'GiftIcon', name: 'Regalos', icon: <Gift className="size-7" /> },
  { id: 'MoreHorizontalIcon', name: 'Otros', icon: <MoreHorizontal className="size-7" /> },
]

const CategoryForm = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)

  const [categoryName, setCategoryName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState<string>('CarIcon')
  const [categoryType, setCategoryType] = useState<TransactionType>('EXPENSE')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Fetch category if editing
  const { data: category, isLoading: isLoadingCategory } = useCategory(id || '', isEditing)

  // Mutations
  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()
  const deleteMutation = useDeleteCategory()

  // Load category data when editing
  useEffect(() => {
    if (category) {
      setCategoryName(category.name)
      setSelectedIcon(category.icon || 'transport')
      setCategoryType(category.type)
    }
  }, [category])

  const handleSave = async () => {
    if (!categoryName.trim()) return

    try {
      if (isEditing && id) {
        await updateMutation.mutateAsync({
          id,
          data: {
            name: categoryName,
            icon: selectedIcon,
            type: categoryType,
          },
        })
      } else {
        await createMutation.mutateAsync({
          name: categoryName,
          icon: selectedIcon,
          type: categoryType,
        })
      }
      navigate(-1)
    } catch (error) {
      // Error is handled by mutation
    }
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = async () => {
    if (!id) return

    try {
      await deleteMutation.mutateAsync(id)
      setShowDeleteConfirm(false)
      navigate(-1)
    } catch (error) {
      // Error is handled by mutation
      setShowDeleteConfirm(false)
    }
  }

  const handleCancel = () => {
    navigate(-1)
  }

  if (isEditing && isLoadingCategory) {
    return (
      <div className="relative flex w-full flex-col flex-1 bg-background-light dark:bg-background-dark">
        <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 pt-safe">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-6 w-32" />
          <div className="w-12" />
        </div>
        <main className="flex-grow pb-32 p-4">
          <Skeleton className="h-14 w-full mb-6" />
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="grid grid-cols-3 gap-3">
            <Skeleton className="aspect-square" />
            <Skeleton className="aspect-square" />
            <Skeleton className="aspect-square" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="relative flex w-full flex-col flex-1 bg-background-light dark:bg-background-dark">
      {/* Header */}
      <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 pt-safe">
        <div className="flex size-12 shrink-0 items-center justify-start">
          <button onClick={handleCancel} className="text-text-primary dark:text-white">
            <X className="size-6" />
          </button>
        </div>
        <h1 className="text-text-primary dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
        </h1>
        <div className="flex w-12 items-center justify-end">
          {isEditing && (
            <button
              onClick={handleDeleteClick}
              className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              <Trash2 className="size-5" />
            </button>
          )}
        </div>
      </div>

      <main className="flex-grow pb-32">
        {/* TextField */}
        <div className="flex max-w-full flex-wrap items-end gap-4 px-4 py-3 pt-6">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-text-primary dark:text-slate-300 text-base font-medium leading-normal pb-2">
              Nombre de la categoría
            </p>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-primary dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 h-14 placeholder:text-text-secondary p-[15px] text-base font-normal leading-normal"
              placeholder="Ej. Transporte, Comida, Ocio"
            />
          </label>
        </div>

        {/* Type Selection */}
        <div className="px-4 py-3">
          <p className="text-text-primary dark:text-slate-300 text-base font-medium leading-normal pb-2">
            Tipo
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setCategoryType('EXPENSE')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                categoryType === 'EXPENSE'
                  ? 'bg-red-500 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              Gasto
            </button>
            <button
              onClick={() => setCategoryType('INCOME')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                categoryType === 'INCOME'
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              Ingreso
            </button>
          </div>
        </div>

        {/* Icon Selection */}
        <h2 className="text-text-primary dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-6">
          Elige un icono
        </h2>

        {/* Icon Grid */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,1fr))] gap-3 p-4">
          {ICON_OPTIONS.map((option, index) => {
            const isSelected = selectedIcon === option.id
            return (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => setSelectedIcon(option.id)}
                className={`flex flex-col flex-1 gap-2 rounded-lg p-4 items-center justify-center aspect-square cursor-pointer transition-all ${
                  isSelected
                    ? 'border-2 border-primary bg-primary/10 dark:bg-primary/20'
                    : 'border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 hover:border-primary/50 dark:hover:border-primary/50'
                }`}
              >
                <div className={isSelected ? 'text-primary dark:text-accent' : 'text-text-primary dark:text-white'}>
                  {option.icon}
                </div>
                <h3
                  className={`text-sm font-medium text-center ${
                    isSelected
                      ? 'text-primary dark:text-accent font-bold'
                      : 'text-text-secondary dark:text-slate-400'
                  }`}
                >
                  {option.name}
                </h3>
              </motion.button>
            )
          })}
        </div>
      </main>

      {/* Save Button */}
      <div className="sticky bottom-0 bg-background-light dark:bg-background-dark p-4 border-t border-gray-200 dark:border-gray-800 pb-safe">
        <button
          onClick={handleSave}
          disabled={!categoryName.trim() || createMutation.isPending || updateMutation.isPending}
          className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background-light dark:focus:ring-offset-background-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="truncate">
            {createMutation.isPending || updateMutation.isPending
              ? 'Guardando...'
              : isEditing
                ? 'Actualizar Categoría'
                : 'Guardar Categoría'}
          </span>
        </button>
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
        title="¿Eliminar categoría?"
        message="Esta acción eliminará permanentemente esta categoría. Las transacciones asociadas no se eliminarán."
        confirmText="Eliminar"
        cancelText="Cancelar"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}

export default CategoryForm
