import { useState } from 'react'
import { useCategories, useCreateCategory, useDeleteCategory } from '@/hooks/useCategories'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { IconPicker } from '@/components/IconPicker'
import { getCategoryIcon } from '@/lib/icons'
import { TRANSACTION_TYPES, DEFAULT_CATEGORY_COLORS, CATEGORY_ICONS } from '@/lib/constants'
import { Plus, Trash2, FolderOpen } from 'lucide-react'
import type { CreateCategoryInput, Category } from '@/types'
import { useToast } from '@/hooks/use-toast'

export function Categories() {
  const { data: categories, isLoading } = useCategories()
  const createMutation = useCreateCategory()
  const deleteMutation = useDeleteCategory()
  const { toast } = useToast()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState<CreateCategoryInput>({
    name: '',
    type: 'EXPENSE',
    color: DEFAULT_CATEGORY_COLORS[0],
    icon: CATEGORY_ICONS[0].name,
  })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createMutation.mutateAsync(formData)
      setIsDialogOpen(false)
      setFormData({
        name: '',
        type: 'EXPENSE',
        color: DEFAULT_CATEGORY_COLORS[0],
        icon: CATEGORY_ICONS[0].name,
      })
      toast({
        title: "Category created",
        description: "Your category has been created successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create category. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string, name: string, isDefault: boolean) => {
    if (isDefault) {
      toast({
        title: "Cannot delete default category",
        description: "Default categories cannot be deleted.",
        variant: "destructive",
      })
      return
    }
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteMutation.mutateAsync(id)
        toast({
          title: "Category deleted",
          description: "The category has been deleted successfully.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete category.",
          variant: "destructive",
        })
      }
    }
  }

  if (isLoading) {
    return (
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-5 w-64" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const groupedCategories = {
    INCOME: categories?.filter((c: Category) => c.type === 'INCOME') || [],
    EXPENSE: categories?.filter((c: Category) => c.type === 'EXPENSE') || [],
    TRANSFER: categories?.filter((c: Category) => c.type === 'TRANSFER') || [],
  }

  const renderCategoryGrid = (cats: Category[]) => {
    if (cats.length === 0) {
      return (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No categories in this section yet
            </p>
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cats.map((category) => (
          <Card key={category.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: category.color || '#ccc' }}
                  >
                    {getCategoryIcon(category.icon || 'Package', 'h-6 w-6 text-white')}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold truncate">{category.name}</h3>
                    {category.isDefault && (
                      <Badge variant="secondary" className="mt-1">
                        Default
                      </Badge>
                    )}
                  </div>
                </div>
                {!category.isDefault && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="shrink-0"
                    onClick={() => handleDelete(category.id, category.name, category.isDefault)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">Organize your transactions with categories</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>Create Category</DialogTitle>
                <DialogDescription>
                  Add a new category to organize your transactions.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    placeholder="Groceries, Salary, etc."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TRANSACTION_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <IconPicker
                  value={formData.icon}
                  onChange={(icon) => setFormData({ ...formData, icon })}
                  color={formData.color}
                />
                <div className="grid gap-2">
                  <Label htmlFor="color">Color</Label>
                  <div className="grid grid-cols-10 gap-2">
                    {DEFAULT_CATEGORY_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`h-8 w-8 rounded-full border-2 transition-all ${
                          formData.color === color
                            ? 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-background'
                            : 'border-border hover:border-primary'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setFormData({ ...formData, color })}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Creating...' : 'Create Category'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="EXPENSE" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="EXPENSE">Expenses</TabsTrigger>
          <TabsTrigger value="INCOME">Income</TabsTrigger>
          <TabsTrigger value="TRANSFER">Transfers</TabsTrigger>
        </TabsList>
        <TabsContent value="EXPENSE" className="space-y-4">
          {renderCategoryGrid(groupedCategories.EXPENSE as Category[])}
        </TabsContent>
        <TabsContent value="INCOME" className="space-y-4">
          {renderCategoryGrid(groupedCategories.INCOME as Category[])}
        </TabsContent>
        <TabsContent value="TRANSFER" className="space-y-4">
          {renderCategoryGrid(groupedCategories.TRANSFER as Category[])}
        </TabsContent>
      </Tabs>
    </div>
  )
}
