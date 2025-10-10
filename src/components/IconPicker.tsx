import { useState } from 'react'
import { CATEGORY_ICONS } from '@/lib/constants'
import { getCategoryIcon } from '@/lib/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'

interface IconPickerProps {
  value: string
  onChange: (value: string) => void
  color?: string
}

export function IconPicker({ value, onChange, color = '#000000' }: IconPickerProps) {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)

  const filteredIcons = CATEGORY_ICONS.filter((icon) =>
    icon.label.toLowerCase().includes(search.toLowerCase()) ||
    icon.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="space-y-2">
        <Label>Icon</Label>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start gap-2 h-auto py-3"
          >
            <div
              className="flex items-center justify-center w-10 h-10 rounded-lg"
              style={{ backgroundColor: color }}
            >
              {getCategoryIcon(value, 'h-6 w-6 text-white')}
            </div>
            <span className="text-sm text-muted-foreground">
              {CATEGORY_ICONS.find((i) => i.name === value)?.label || 'Select an icon'}
            </span>
          </Button>
        </PopoverTrigger>
      </div>

      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search icons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            <div className="grid grid-cols-6 gap-2">
              {filteredIcons.map((icon) => (
                <Button
                  key={icon.name}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'h-12 w-12 p-0 hover:bg-primary/10',
                    value === icon.name && 'bg-primary/20 ring-2 ring-primary'
                  )}
                  onClick={() => {
                    onChange(icon.name)
                    setOpen(false)
                  }}
                  title={icon.label}
                >
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded"
                    style={{ backgroundColor: color }}
                  >
                    {getCategoryIcon(icon.name, 'h-4 w-4 text-white')}
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {filteredIcons.length === 0 && (
            <div className="text-center py-6 text-sm text-muted-foreground">
              No icons found
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
