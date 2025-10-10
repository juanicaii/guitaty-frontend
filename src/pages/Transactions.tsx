import { useState, useEffect } from 'react'
import { useTransactions, useCreateTransaction, useUpdateTransaction, useDeleteTransaction } from '@/hooks/useTransactions'
import { useAccounts } from '@/hooks/useAccounts'
import { useCategories } from '@/hooks/useCategories'
import { useExchangeRate } from '@/hooks/useExchangeRate'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { getCategoryIcon } from '@/lib/icons'
import { formatCurrency, formatDate } from '@/lib/utils'
import { TRANSACTION_TYPES, CURRENCIES, convertCurrency, USD_TO_ARS_RATE } from '@/lib/constants'
import { Plus, Trash2, ChevronLeft, ChevronRight, Receipt, MoreVertical, Pencil } from 'lucide-react'
import type { CreateTransactionInput, TransactionFilters, Transaction } from '@/types'
import { useToast } from '@/hooks/use-toast'

export function Transactions() {
  const [filters, setFilters] = useState<TransactionFilters>({ page: 1, limit: 20 })
  const { data: transactionsData, isLoading } = useTransactions(filters)
  const { data: accounts } = useAccounts()
  const { data: categories } = useCategories()
  const { data: liveExchangeRate } = useExchangeRate()
  const createMutation = useCreateTransaction()
  const updateMutation = useUpdateTransaction()
  const deleteMutation = useDeleteTransaction()
  const { toast } = useToast()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [inputCurrency, setInputCurrency] = useState<string>('USD')
  const [exchangeRate, setExchangeRate] = useState<number>(liveExchangeRate || USD_TO_ARS_RATE)

  // Update exchange rate when live rate is fetched
  useEffect(() => {
    if (liveExchangeRate && !isDialogOpen) {
      setExchangeRate(liveExchangeRate)
    }
  }, [liveExchangeRate, isDialogOpen])
  const [formData, setFormData] = useState<CreateTransactionInput>({
    amount: 0,
    type: 'EXPENSE',
    date: new Date().toISOString().split('T')[0],
    accountId: '',
    description: '',
    categoryId: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Get the selected account's currency
      const selectedAccount = accounts?.find(a => a.id === formData.accountId)
      const accountCurrency = selectedAccount?.currency || 'USD'

      // Convert amount if currencies differ
      const finalAmount = convertCurrency(formData.amount, inputCurrency, accountCurrency, exchangeRate)

      if (editingTransaction) {
        await updateMutation.mutateAsync({
          id: editingTransaction.id,
          data: {
            ...formData,
            amount: finalAmount,
            date: new Date(formData.date).toISOString(),
          }
        })
        toast({
          title: "Transaction updated",
          description: "Your transaction has been updated successfully.",
        })
      } else {
        await createMutation.mutateAsync({
          ...formData,
          amount: finalAmount,
          date: new Date(formData.date).toISOString(),
        })
        toast({
          title: "Transaction created",
          description: "Your transaction has been created successfully.",
        })
      }

      setIsDialogOpen(false)
      setEditingTransaction(null)
      setInputCurrency('USD')
      setExchangeRate(liveExchangeRate || USD_TO_ARS_RATE)
      setFormData({
        amount: 0,
        type: 'EXPENSE',
        date: new Date().toISOString().split('T')[0],
        accountId: '',
        description: '',
        categoryId: '',
      })
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingTransaction ? 'update' : 'create'} transaction. Please try again.`,
        variant: "destructive",
      })
    }
  }

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setInputCurrency(transaction.account.currency)
    setFormData({
      amount: parseFloat(transaction.amount),
      type: transaction.type,
      date: new Date(transaction.date).toISOString().split('T')[0],
      accountId: transaction.accountId,
      description: transaction.description || '',
      categoryId: transaction.categoryId || '',
    })
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingTransaction(null)
    setInputCurrency('USD')
    setExchangeRate(liveExchangeRate || USD_TO_ARS_RATE)
    setFormData({
      amount: 0,
      type: 'EXPENSE',
      date: new Date().toISOString().split('T')[0],
      accountId: '',
      description: '',
      categoryId: '',
    })
  }

  const handleDelete = async (id: string, description: string) => {
    if (confirm(`Are you sure you want to delete "${description || 'this transaction'}"?`)) {
      try {
        await deleteMutation.mutateAsync(id)
        toast({
          title: "Transaction deleted",
          description: "The transaction has been deleted successfully.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete transaction.",
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
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-0">
            <div className="space-y-2 p-4">
              <Skeleton className="h-10 w-full" />
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const transactions = transactionsData?.data || []
  const pagination = transactionsData?.pagination

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">Track all your financial transactions</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) handleCloseDialog()
          else setIsDialogOpen(true)
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingTransaction ? 'Edit Transaction' : 'Create Transaction'}
                </DialogTitle>
                <DialogDescription>
                  {editingTransaction
                    ? 'Update the transaction details below.'
                    : 'Add a new transaction to track your financial activity.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
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
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    placeholder="Add a description..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
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
                          ?.filter((cat) => cat.type === formData.type)
                          .map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-5 h-5 rounded flex items-center justify-center"
                                  style={{ backgroundColor: category.color || '#ccc' }}
                                >
                                  {getCategoryIcon(category.icon || 'Package', 'h-3 w-3 text-white')}
                                </div>
                                {category.name}
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingTransaction
                    ? (updateMutation.isPending ? 'Updating...' : 'Update Transaction')
                    : (createMutation.isPending ? 'Creating...' : 'Create Transaction')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label>Account</Label>
              <Select
                value={filters.accountId || 'all'}
                onValueChange={(value) => setFilters({ ...filters, accountId: value === 'all' ? undefined : value, page: 1 })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Accounts</SelectItem>
                  {accounts?.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Category</Label>
              <Select
                value={filters.categoryId || 'all'}
                onValueChange={(value) => setFilters({ ...filters, categoryId: value === 'all' ? undefined : value, page: 1 })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded flex items-center justify-center"
                          style={{ backgroundColor: category.color || '#ccc' }}
                        >
                          {getCategoryIcon(category.icon || 'Package', 'h-3 w-3 text-white')}
                        </div>
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Type</Label>
              <Select
                value={filters.type || 'all'}
                onValueChange={(value) => setFilters({ ...filters, type: value === 'all' ? undefined : value, page: 1 })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {TRANSACTION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Search</Label>
              <Input
                placeholder="Search description..."
                value={filters.search || ''}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {transactions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Receipt className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
            <p className="text-muted-foreground text-center mb-4">
              Try adjusting your filters or add your first transaction
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell>{transaction.description || '-'}</TableCell>
                      <TableCell>
                        {transaction.category ? (
                          <div className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded flex items-center justify-center"
                              style={{ backgroundColor: transaction.category.color || '#ccc' }}
                            >
                              {getCategoryIcon(transaction.category.icon || 'Package', 'h-3.5 w-3.5 text-white')}
                            </div>
                            <span>{transaction.category.name}</span>
                          </div>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>{transaction.account.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            transaction.type === 'INCOME'
                              ? 'default'
                              : transaction.type === 'EXPENSE'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {transaction.account.currency}
                        </Badge>
                      </TableCell>
                      <TableCell
                        className={`text-right font-bold ${
                          transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {transaction.type === 'INCOME' ? '+' : '-'}
                        {formatCurrency(parseFloat(transaction.amount), transaction.account.currency)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(transaction)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDelete(transaction.id, transaction.description || '')}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {pagination && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} transactions
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({ ...filters, page: filters.page! - 1 })}
              disabled={!pagination.hasPrev}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({ ...filters, page: filters.page! + 1 })}
              disabled={!pagination.hasNext}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
