import { ReactNode } from 'react';
import { App, Page, Navbar, Toolbar, Link } from 'konsta/react';
import { useAppStore } from '@/stores/appStore';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export const Layout = ({ children, title = 'Finance' }: LayoutProps) => {
  const { setCurrentTab, isDarkMode } = useAppStore();

  return (
    <App theme="ios" dark={isDarkMode}>
      <Page>
        <Navbar title={title} />

        <div className="pb-16">
          {children}
        </div>

        <Toolbar tabbar className="left-0 bottom-0 fixed">
          <Link toolbar onClick={() => setCurrentTab('dashboard')}>
            Inicio
          </Link>
          <Link toolbar onClick={() => setCurrentTab('transactions')}>
            Transacciones
          </Link>
          <Link toolbar onClick={() => setCurrentTab('accounts')}>
            Cuentas
          </Link>
          <Link toolbar onClick={() => setCurrentTab('investments')}>
            Inversiones
          </Link>
          <Link toolbar onClick={() => setCurrentTab('settings')}>
            Ajustes
          </Link>
        </Toolbar>
      </Page>
    </App>
  );
};
