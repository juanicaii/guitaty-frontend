import { motion } from 'framer-motion';
import {
  HomeIcon,
  CreditCardIcon,
  BanknotesIcon,
  TagIcon,
  ChartBarIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeSolid,
  CreditCardIcon as CreditCardSolid,
  BanknotesIcon as BanknotesSolid,
  TagIcon as TagSolid,
  ChartBarIcon as ChartBarSolid,
  Cog6ToothIcon as Cog6ToothSolid
} from '@heroicons/react/24/solid';

interface TabNavigationProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'dashboard', label: 'Dashboard', Icon: HomeIcon, IconSolid: HomeSolid },
  { id: 'transactions', label: 'Transacciones', Icon: CreditCardIcon, IconSolid: CreditCardSolid },
  { id: 'accounts', label: 'Cuentas', Icon: BanknotesIcon, IconSolid: BanknotesSolid },
  { id: 'categories', label: 'Categorías', Icon: TagIcon, IconSolid: TagSolid },
  { id: 'investments', label: 'Inversiones', Icon: ChartBarIcon, IconSolid: ChartBarSolid },
  { id: 'settings', label: 'Ajustes', Icon: Cog6ToothIcon, IconSolid: Cog6ToothSolid },
];

export function TabNavigation({ currentTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 py-2 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            const Icon = isActive ? tab.IconSolid : tab.Icon;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  relative flex items-center px-4 py-2.5 rounded-xl font-medium text-sm
                  transition-all duration-200 min-w-fit
                  ${isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-xl"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}

                <span className="relative flex items-center space-x-2">
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </span>

                {isActive && (
                  <motion.div
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: 48 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}