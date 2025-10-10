import { useDashboardStats } from '@/hooks/useDashboard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { getCategoryIcon } from '@/lib/icons'
import { formatCurrency } from '@/lib/utils'
import { ArrowDown, ArrowUp, DollarSign, TrendingUp, HelpCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'

export function Dashboard() {
  const { data: stats, isLoading } = useDashboardStats()

  if (isLoading) {
    return (
      <div className="p-8 space-y-8">
        <div className="space-y-1">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No data available</h3>
            <p className="text-muted-foreground text-center">
              Start by adding accounts and transactions to see your dashboard
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const chartData = stats.monthlyTrend?.map((item) => ({
    month: format(new Date(item.month), 'MMM yyyy'),
    usdIncome: item.usd?.income || 0,
    usdExpenses: item.usd?.expenses || 0,
    arsIncome: item.ars?.income || 0,
    arsExpenses: item.ars?.expenses || 0,
  })) || []

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your personal finance dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <UITooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Combined balance across all your accounts</p>
                </TooltipContent>
              </UITooltip>
            </div>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency((stats.usd?.accountBalance || 0) + (stats.ars?.accountBalance || 0))}</div>
            <p className="text-xs text-muted-foreground">USD: {formatCurrency(stats.usd?.accountBalance || 0)} | ARS: {formatCurrency(stats.ars?.accountBalance || 0, 'ARS')}</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <UITooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total income received during the current period</p>
                </TooltipContent>
              </UITooltip>
            </div>
            <ArrowUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency((stats.usd?.totalIncome || 0) + (stats.ars?.totalIncome || 0))}
            </div>
            <p className="text-xs text-muted-foreground">USD: {formatCurrency(stats.usd?.totalIncome || 0)} | ARS: {formatCurrency(stats.ars?.totalIncome || 0, 'ARS')}</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <UITooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total expenses incurred during the current period</p>
                </TooltipContent>
              </UITooltip>
            </div>
            <ArrowDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency((stats.usd?.totalExpenses || 0) + (stats.ars?.totalExpenses || 0))}
            </div>
            <p className="text-xs text-muted-foreground">USD: {formatCurrency(stats.usd?.totalExpenses || 0)} | ARS: {formatCurrency(stats.ars?.totalExpenses || 0, 'ARS')}</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-medium">Net Income</CardTitle>
              <UITooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Income minus expenses for the current period</p>
                </TooltipContent>
              </UITooltip>
            </div>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${((stats.usd?.netIncome || 0) + (stats.ars?.netIncome || 0)) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency((stats.usd?.netIncome || 0) + (stats.ars?.netIncome || 0))}
            </div>
            <p className="text-xs text-muted-foreground">USD: {formatCurrency(stats.usd?.netIncome || 0)} | ARS: {formatCurrency(stats.ars?.netIncome || 0, 'ARS')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Monthly Trend</CardTitle>
            <CardDescription>Income vs Expenses over time</CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <p>No data available for monthly trend</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={chartData}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => {
                      if (value >= 1000000) {
                        return `$${(value / 1000000).toFixed(1)}M`
                      }
                      if (value >= 1000) {
                        return `$${(value / 1000).toFixed(1)}K`
                      }
                      return `$${value}`
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--popover-foreground))'
                    }}
                    formatter={(value: any) => [formatCurrency(value), '']}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                  <Bar
                    dataKey="usdIncome"
                    fill="#22c55e"
                    name="USD Income"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="usdExpenses"
                    fill="#ef4444"
                    name="USD Expenses"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="arsIncome"
                    fill="#86efac"
                    name="ARS Income"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="arsExpenses"
                    fill="#fca5a5"
                    name="ARS Expenses"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Top Expense Categories</CardTitle>
            <CardDescription>Your highest spending categories</CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              const usdCategories = stats.usd?.topExpenseCategories || []
              const arsCategories = stats.ars?.topExpenseCategories || []
              const allCategories = [...usdCategories, ...arsCategories]

              if (allCategories.length === 0) {
                return (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    <p>No expense data available yet</p>
                  </div>
                )
              }

              // Combine categories by categoryId and sum amounts
              const categoryMap = new Map()
              allCategories.forEach((category) => {
                const id = category.categoryId
                const amount = category.amount || 0
                if (categoryMap.has(id)) {
                  categoryMap.set(id, {
                    ...categoryMap.get(id),
                    totalAmount: categoryMap.get(id).totalAmount + amount
                  })
                } else {
                  categoryMap.set(id, {
                    ...category,
                    totalAmount: amount
                  })
                }
              })

              // Sort by total amount and take top 5
              const topCategories = Array.from(categoryMap.values())
                .sort((a, b) => b.totalAmount - a.totalAmount)
                .slice(0, 5)

              return (
                <div className="space-y-4">
                  {topCategories.map((category) => (
                    <div key={category.categoryId} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: category.category?.color || '#ccc' }}
                        >
                          {getCategoryIcon(category.category?.icon || 'Package', 'h-5 w-5 text-white')}
                        </div>
                        <span className="font-medium">{category.category?.name || 'Unknown'}</span>
                      </div>
                      <span className="font-bold">{formatCurrency(category.totalAmount)}</span>
                    </div>
                  ))}
                </div>
              )
            })()}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
