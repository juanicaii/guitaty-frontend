import { useState, useEffect } from 'react'
import { useSubscriptions, useCreateSubscription, useDeleteSubscription, useUpdateSubscription } from '@/hooks/useSubscriptions'
import { useAccounts } from '@/hooks/useAccounts'
import { useCategories } from '@/hooks/useCategories'
import { useExchangeRate } from '@/hooks/useExchangeRate'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency, formatDate } from '@/lib/utils'
import { BILLING_CYCLES, CURRENCIES, convertCurrency, USD_TO_ARS_RATE } from '@/lib/constants'
import { Plus, Trash2, Calendar, DollarSign } from 'lucide-react'
import type { CreateSubscriptionInput } from '@/types'
import { useToast } from '@/hooks/use-toast'

export function Subscriptions() {
  const { data: subscriptions, isLoading } = useSubscriptions()
  const { data: accounts } = useAccounts()
  const { data: categories } = useCategories()
  const { data: liveExchangeRate } = useExchangeRate()
  const createMutation = useCreateSubscription()
  const updateMutation = useUpdateSubscription()
  const deleteMutation = useDeleteSubscription()
  const { toast } = useToast()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [inputCurrency, setInputCurrency] = useState<string>('USD')
  const [exchangeRate, setExchangeRate] = useState<number>(liveExchangeRate || USD_TO_ARS_RATE)

  // Update exchange rate when live rate is fetched
  useEffect(() => {
    if (liveExchangeRate && !isDialogOpen) {
      setExchangeRate(liveExchangeRate)
    }
  }, [liveExchangeRate, isDialogOpen])
  const [formData, setFormData] = useState<CreateSubscriptionInput>({
    name: '',
    amount: 0,
    billingCycle: 'MONTHLY',
    nextBillingDate: new Date().toISOString().split('T')[0],
    accountId: '',
    description: '',
    categoryId: '',
  })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Get the selected account's currency
      const selectedAccount = accounts?.find(a => a.id === formData.accountId)
      const accountCurrency = selectedAccount?.currency || 'USD'

      // Convert amount if currencies differ
      const finalAmount = convertCurrency(formData.amount, inputCurrency, accountCurrency, exchangeRate)

      await createMutation.mutateAsync({
        ...formData,
        amount: finalAmount,
        nextBillingDate: new Date(formData.nextBillingDate).toISOString(),
      })
      setIsDialogOpen(false)
      setInputCurrency('USD')
      setExchangeRate(liveExchangeRate || USD_TO_ARS_RATE)
      setFormData({
        name: '',
        amount: 0,
        billingCycle: 'MONTHLY',
        nextBillingDate: new Date().toISOString().split('T')[0],
        accountId: '',
        description: '',
        categoryId: '',
      })
      toast({
        title: "Subscription created",
        description: "Your subscription has been created successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create subscription. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      await updateMutation.mutateAsync({ id, data: { isActive: !currentStatus } })
      toast({
        title: currentStatus ? "Subscription deactivated" : "Subscription activated",
        description: `Subscription has been ${currentStatus ? 'deactivated' : 'activated'}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update subscription.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteMutation.mutateAsync(id)
        toast({
          title: "Subscription deleted",
          description: "The subscription has been deleted successfully.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete subscription.",
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
          <p className="text-muted-foreground">Manage your recurring payments</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) {
            setIsDialogOpen(false)
            setInputCurrency('USD')
            setExchangeRate(liveExchangeRate || USD_TO_ARS_RATE)
            setFormData({
              name: '',
              amount: 0,
              billingCycle: 'MONTHLY',
              nextBillingDate: new Date().toISOString().split('T')[0],
              accountId: '',
              description: '',
              categoryId: '',
            })
          } else {
            setIsDialogOpen(true)
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Subscription
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>Create Subscription</DialogTitle>
                <DialogDescription>
                  Add a new recurring payment to track automatically.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Subscription Name</Label>
                  <Input
                    id="name"
                    placeholder="Netflix, Spotify, etc."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    placeholder="Add a description..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 grid gap-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.amount || ''}
                      onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="inputCurrency">Currency</Label>
                    <Select
                      value={inputCurrency}
                      onValueChange={(value) => setInputCurrency(value)}
                    >
                      <SelectTrigger id="inputCurrency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map((currency) => (
                          <SelectItem key={currency.value} value={currency.value}>
                            {currency.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {formData.accountId && accounts && formData.amount > 0 && (() => {
                  const selectedAccount = accounts.find(a => a.id === formData.accountId)
                  const accountCurrency = selectedAccount?.currency || 'USD'
                  if (inputCurrency !== accountCurrency) {
                    const convertedAmount = convertCurrency(formData.amount, inputCurrency, accountCurrency, exchangeRate)
                    return (
                      <div className="space-y-3">
                        <div className="grid gap-2">
                          <Label htmlFor="exchangeRate">Exchange Rate (1 USD = X ARS)</Label>
                          <Input
                            id="exchangeRate"
                            type="number"
                            step="0.01"
                            placeholder="1421.5"
                            value={exchangeRate}
                            onChange={(e) => setExchangeRate(parseFloat(e.target.value) || USD_TO_ARS_RATE)}
                          />
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50 border border-border">
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">Conversion:</span> {formatCurrency(formData.amount, inputCurrency)} → {formatCurrency(convertedAmount, accountCurrency)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Using rate: 1 USD = {exchangeRate.toFixed(2)} ARS
                          </p>
                        </div>
                      </div>
                    )
                  }
                  return null
                })()}
                <div className="grid gap-2">
                  <Label htmlFor="billingCycle">Billing Cycle</Label>
                  <Select
                    value={formData.billingCycle}
                    onValueChange={(value: any) => setFormData({ ...formData, billingCycle: value })}
                  >
                    <SelectTrigger id="billingCycle">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BILLING_CYCLES.map((cycle) => (
                        <SelectItem key={cycle.value} value={cycle.value}>
                          {cycle.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="account">Account</Label>
                    <Select
                      value={formData.accountId}
                      onValueChange={(value) => setFormData({ ...formData, accountId: value })}
                    >
                      <SelectTrigger id="account">
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts?.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{account.name}</span>
                              <Badge variant="outline" className="ml-2">
                                {account.currency}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formData.accountId && accounts && (
                      <p className="text-xs text-muted-foreground">
                        Currency: {accounts.find(a => a.id === formData.accountId)?.currency || 'N/A'}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category (Optional)</Label>
                    <Select
                      value={formData.categoryId}
                      onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories
                          ?.filter((cat) => cat.type === 'EXPENSE')
                          .map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.icon} {category.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="nextBillingDate">Next Billing Date</Label>
                  <Input
                    id="nextBillingDate"
                    type="date"
                    value={formData.nextBillingDate}
                    onChange={(e) => setFormData({ ...formData, nextBillingDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Creating...' : 'Create Subscription'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {!subscriptions || subscriptions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No subscriptions yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Get started by adding your first subscription
            </p>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              if (!open) {
                setIsDialogOpen(false)
                setInputCurrency('USD')
                setExchangeRate(liveExchangeRate || USD_TO_ARS_RATE)
                setFormData({
                  name: '',
                  amount: 0,
                  billingCycle: 'MONTHLY',
                  nextBillingDate: new Date().toISOString().split('T')[0],
                  accountId: '',
                  description: '',
                  categoryId: '',
                })
              } else {
                setIsDialogOpen(true)
              }
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Subscription
                </Button>
              </DialogTrigger>
            </Dialog>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subscriptions?.map((subscription) => (
            <Card key={subscription.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>{subscription.name}</CardTitle>
                    {subscription.description && (
                      <CardDescription>{subscription.description}</CardDescription>
                    )}
                  </div>
                  <Switch
                    checked={subscription.isActive}
                    onCheckedChange={() => handleToggle(subscription.id, subscription.isActive)}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">
                    {formatCurrency(parseFloat(subscription.amount), subscription.account?.currency || 'USD')}
                  </span>
                  <span className="text-muted-foreground">
                    /{subscription.billingCycle === 'MONTHLY' ? 'month' : 'year'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Next billing:</span>
                  <span className="font-medium">{formatDate(subscription.nextBillingDate)}</span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={subscription.billingCycle === 'MONTHLY' ? 'default' : 'secondary'}>
                    {subscription.billingCycle}
                  </Badge>
                  <Badge variant={subscription.isActive ? 'default' : 'outline'}>
                    {subscription.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={() => handleDelete(subscription.id, subscription.name)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
