import {
  // Shopping & Commerce
  ShoppingCart,
  Store,
  ShoppingBag,

  // Home & Living
  Home,
  Bed,
  Sofa,
  Lamp,

  // Transportation
  Car,
  Bus,
  Train,
  Bike,
  Plane,
  Ship,
  Fuel,

  // Food & Dining
  UtensilsCrossed,
  Coffee,
  Pizza,
  Apple,
  Beef,
  IceCream,
  Wine,

  // Health & Fitness
  Heart,
  Dumbbell,
  Activity,
  Stethoscope,
  Pill,

  // Education
  GraduationCap,
  Book,
  BookOpen,

  // Entertainment
  Film,
  Music,
  Gamepad2,
  Tv,
  Gift,
  PartyPopper,
  Clapperboard,

  // Technology
  Smartphone,
  Laptop,
  Monitor,
  Wifi,
  Zap,

  // Finance
  DollarSign,
  CreditCard,
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Building2,
  Briefcase,

  // Apparel
  Shirt,
  Watch,
  Glasses,

  // Utilities
  Droplets,
  Flame,
  Wind,
  Sparkles,

  // Travel & Leisure
  Hotel,
  Luggage,
  MapPin,
  Compass,
  Camera,
  Mountain,
  Palmtree,

  // Pets
  Dog,
  Cat,
  Fish,
  PawPrint,

  // Communication
  Phone,
  Mail,
  MessageCircle,

  // Work & Office
  FileText,
  Folder,
  Calendar,
  Clock,

  // Healthcare
  Cross,

  // Sports
  Trophy,
  Target,

  // Misc
  Star,
  Settings,
  Tag,
  Package,
  HelpCircle,
  CircleDot,
  MoreHorizontal,

  type LucideIcon,
} from 'lucide-react'

/**
 * Normaliza el nombre del icono para hacerlo más flexible
 * Convierte: snake_case, kebab-case, PascalCase → snake_case lowercase
 */
const normalizeIconName = (name: string): string => {
  return name
    .replace(/Icon$/, '') // Remove "Icon" suffix (ShoppingCartIcon → ShoppingCart)
    .replace(/([A-Z])/g, '_$1') // PascalCase → snake_case
    .replace(/-/g, '_') // kebab-case → snake_case
    .toLowerCase()
    .replace(/^_/, '') // remove leading underscore
}

/**
 * Mapea nombres de iconos a componentes de Lucide React
 * Soporta múltiples variantes de nombres
 */
const iconMap: Record<string, LucideIcon> = {
  // Shopping & Commerce
  shopping_cart: ShoppingCart,
  shoppingcart: ShoppingCart,
  cart: ShoppingCart,
  shopping_bag: ShoppingBag,
  shopping: ShoppingCart,
  store: Store,
  shop: Store,
  market: Store,

  // Home & Living
  home: Home,
  house: Home,
  bed: Bed,
  bedroom: Bed,
  couch: Sofa,
  sofa: Sofa,
  furniture: Sofa,
  lamp: Lamp,
  light: Lamp,
  light_bulb: Lamp,
  lightbulb: Lamp,

  // Transportation
  directions_car: Car,
  car: Car,
  auto: Car,
  vehicle: Car,
  bus: Bus,
  directions_bus: Bus,
  train: Train,
  directions_train: Train,
  subway: Train,
  bike: Bike,
  bicycle: Bike,
  directions_bike: Bike,
  flight: Plane,
  airplane: Plane,
  plane: Plane,
  directions_boat: Ship,
  ship: Ship,
  boat: Ship,
  local_gas_station: Fuel,
  gas: Fuel,
  fuel: Fuel,

  // Food & Dining
  restaurant: UtensilsCrossed,
  food: UtensilsCrossed,
  local_dining: UtensilsCrossed,
  dining: UtensilsCrossed,
  fastfood: Pizza,
  lunch: UtensilsCrossed,
  dinner: UtensilsCrossed,
  breakfast: Coffee,
  coffee: Coffee,
  local_cafe: Coffee,
  cafe: Coffee,
  pizza: Pizza,
  local_pizza: Pizza,
  apple: Apple,
  fruit: Apple,
  grocery: Apple,
  food_bank: Apple,
  meat: Beef,
  ice_cream: IceCream,
  dessert: IceCream,
  wine: Wine,
  bar: Wine,
  local_bar: Wine,

  // Health & Fitness
  health_and_safety: Heart,
  favorite: Heart,
  heart: Heart,
  health: Heart,
  sports_soccer: Dumbbell,
  fitness_center: Dumbbell,
  fitness: Dumbbell,
  gym: Dumbbell,
  exercise: Dumbbell,
  activity: Activity,
  sports: Activity,
  local_hospital: Stethoscope,
  hospital: Stethoscope,
  medical: Stethoscope,
  local_pharmacy: Pill,
  pharmacy: Pill,
  medication: Pill,

  // Education
  school: GraduationCap,
  education: GraduationCap,
  academic_cap: GraduationCap,
  graduation_cap: GraduationCap,
  book: Book,
  library: BookOpen,
  study: Book,

  // Entertainment
  card_giftcard: Gift,
  gift: Gift,
  present: Gift,
  theaters: Film,
  movie: Film,
  local_movies: Film,
  cinema: Film,
  film: Film,
  clapperboard: Clapperboard,
  music_note: Music,
  music: Music,
  album: Music,
  videogame: Gamepad2,
  videogame_asset: Gamepad2,
  games: Gamepad2,
  gaming: Gamepad2,
  tv: Tv,
  celebration: PartyPopper,
  party: PartyPopper,
  event: PartyPopper,

  // Technology
  phone_iphone: Smartphone,
  phone: Phone,
  smartphone: Smartphone,
  devices: Smartphone,
  computer: Laptop,
  laptop: Laptop,
  desktop: Monitor,
  monitor: Monitor,
  computer_desktop: Monitor,
  wifi: Wifi,
  signal_wifi: Wifi,
  bolt: Zap,
  electric_bolt: Zap,
  electricity: Zap,
  power: Zap,

  // Finance
  payments: DollarSign,
  attach_money: DollarSign,
  money: DollarSign,
  dollar: DollarSign,
  currency: DollarSign,
  credit_card: CreditCard,
  creditcard: CreditCard,
  card: CreditCard,
  account_balance_wallet: Wallet,
  wallet: Wallet,
  trending_up: TrendingUp,
  trending_down: TrendingDown,
  presentation_chart_line: TrendingUp,
  chart: TrendingUp,
  savings: PiggyBank,
  piggy_bank: PiggyBank,
  account_balance: Building2,
  bank: Building2,
  work: Briefcase,
  business: Briefcase,
  briefcase: Briefcase,
  investment: TrendingUp,

  // Apparel
  checkroom: Shirt,
  clothing: Shirt,
  shirt: Shirt,
  watch: Watch,
  accessory: Watch,
  glasses: Glasses,

  // Utilities
  water_drop: Droplets,
  water: Droplets,
  droplet: Droplets,
  local_fire_department: Flame,
  fire: Flame,
  heating: Flame,
  air: Wind,
  ac_unit: Wind,
  clean: Sparkles,
  cleaning: Sparkles,

  // Travel & Leisure
  hotel: Hotel,
  accommodation: Hotel,
  luggage: Luggage,
  travel: Luggage,
  place: MapPin,
  location: MapPin,
  map: Compass,
  explore: Compass,
  camera: Camera,
  photo: Camera,
  photography: Camera,
  terrain: Mountain,
  mountain: Mountain,
  hiking: Mountain,
  beach: Palmtree,
  vacation: Palmtree,

  // Pets
  pets: Dog,
  pet_supplies: Dog,
  dog: Dog,
  cat: Cat,
  fish: Fish,
  paw_print: PawPrint,
  pawprint: PawPrint,

  // Communication
  call: Phone,
  email: Mail,
  mail: Mail,
  message: MessageCircle,
  chat: MessageCircle,

  // Work & Office
  description: FileText,
  file: FileText,
  document: FileText,
  document_text: FileText,
  documenttext: FileText,
  folder: Folder,
  calendar_today: Calendar,
  calendar: Calendar,
  schedule: Calendar,
  access_time: Clock,
  clock: Clock,
  time: Clock,

  // Healthcare
  medical_services: Cross,
  emergency: Cross,

  // Sports
  emoji_events: Trophy,
  trophy: Trophy,
  award: Trophy,
  target: Target,
  goal: Target,

  // Misc
  star: Star,
  favorite_border: Star,
  settings: Settings,
  more_horiz: CircleDot,
  more_horizontal: MoreHorizontal,
  morehorizontal: MoreHorizontal,
  category: Tag,
  label: Tag,
  tag: Tag,
  inventory: Package,
  package: Package,
  help: HelpCircle,
  help_outline: HelpCircle,
  question: HelpCircle,
}

/**
 * Obtiene el componente de icono de Lucide basado en el nombre del icono
 * @param iconName - Nombre del icono (snake_case, kebab-case, o PascalCase)
 * @param className - Clases CSS opcionales
 * @returns Componente React del icono
 */
export const getIcon = (iconName: string | null | undefined, className?: string): JSX.Element => {
  if (!iconName) {
    console.warn('[IconMapper] No icon name provided, using default')
    const DefaultIcon = iconMap.help
    return <DefaultIcon className={className} />
  }

  const normalizedName = normalizeIconName(iconName)
  const IconComponent = iconMap[normalizedName]

  if (!IconComponent) {
    console.warn(`[IconMapper] Icon not found: "${iconName}" (normalized: "${normalizedName}"), using default`)
    const DefaultIcon = iconMap.help
    return <DefaultIcon className={className} />
  }

  return <IconComponent className={className} />
}

/**
 * Lista de todos los iconos disponibles para selección en formularios
 */
export const availableIcons = Object.keys(iconMap).filter(
  key => !['help', 'help_outline', 'question', 'more_horiz'].includes(key)
)
