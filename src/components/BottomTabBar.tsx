import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  CreditCardIcon,
  BanknotesIcon,
  TagIcon,
  CogIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeSolid,
  CreditCardIcon as CreditCardSolid,
  BanknotesIcon as BanknotesSolid,
  TagIcon as TagSolid,
  CogIcon as CogSolid,
} from '@heroicons/react/24/solid';

interface BottomTabBarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'dashboard', label: 'Inicio', Icon: HomeIcon, IconSolid: HomeSolid },
  { id: 'transactions', label: 'Movimientos', Icon: CreditCardIcon, IconSolid: CreditCardSolid },
  { id: 'accounts', label: 'Cuentas', Icon: BanknotesIcon, IconSolid: BanknotesSolid },
  { id: 'categories', label: 'Categorías', Icon: TagIcon, IconSolid: TagSolid },
  { id: 'settings', label: 'Ajustes', Icon: CogIcon, IconSolid: CogSolid },
];

export function BottomTabBar({ currentTab, onTabChange }: BottomTabBarProps) {
  return (
    <>
      {/* Spacer for fixed bottom bar */}
      <div className="h-20 md:h-24" />

      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {/* iOS safe area background */}
        <div className="absolute inset-0 bg-white dark:bg-gray-900" />

        <nav className="relative flex justify-around items-center pt-2 pb-2" style={{ paddingLeft: 'max(0.5rem, env(safe-area-inset-left))', paddingRight: 'max(0.5rem, env(safe-area-inset-right))' }}>
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            const Icon = isActive ? tab.IconSolid : tab.Icon;

            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                whileTap={{ scale: 0.9 }}
                className="relative flex flex-col items-center justify-center py-2 px-3  flex-1 "
              >
                <div className="relative flex flex-col items-center ">
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="activeTabBackground"
                        className="absolute -inset-2 flex items-center justify-center"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30
                        }}
                      >
                        <div className="w-96 h-16 bg-blue-500 dark:bg-blue-600 rounded-2xl opacity-10" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div
                    className="relative z-10 "
                    animate={{
                      scale: isActive ? 1.1 : 1,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 25
                    }}
                  >
                    <Icon
                      className={`
                        w-6 h-6 transition-colors duration-200
                        ${isActive
                          ? 'text-blue-500 dark:text-blue-400'
                          : 'text-gray-400 dark:text-gray-500'
                        }
                      `}
                    />

                  
                  </motion.div>

                  <motion.span
                    className={`
                      mt-1 text-[10px] font-medium transition-all duration-200 z-10 
                      ${isActive
                        ? 'text-blue-500 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400'
                      }
                    `}
                    animate={{
                      opacity: isActive ? 1 : 0.7,
                    }}
                  >
                    {tab.label}
                  </motion.span>

               
                </div>
              </motion.button>
            );
          })}
        </nav>
      </div>
    </>
  );
}