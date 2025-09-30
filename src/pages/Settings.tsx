import {
  Block,
  BlockTitle,
  List,
  ListItem,
  Toggle,
  ListInput,
  Button
} from 'konsta/react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useAppStore } from '@/stores/appStore';
import { Currency } from '@/types';

export const Settings = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { isDarkMode, toggleDarkMode, defaultCurrency, setDefaultCurrency } = useAppStore();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <>
      <BlockTitle>Usuario</BlockTitle>
      <List strongIos outlineIos>
        <ListItem
          title={user?.fullName || user?.primaryEmailAddress?.emailAddress || 'Usuario'}
          text={user?.primaryEmailAddress?.emailAddress}
          header="Cuenta"
        />
      </List>

      <BlockTitle>Apariencia</BlockTitle>
      <List strongIos outlineIos>
        <ListItem
          label
          title="Modo Oscuro"
          after={
            <Toggle
              checked={isDarkMode}
              onChange={toggleDarkMode}
            />
          }
        />
      </List>

      <BlockTitle>Preferencias</BlockTitle>
      <List strongIos insetIos>
        <ListInput
          label="Moneda Predeterminada"
          type="select"
          dropdown
          value={defaultCurrency}
          onChange={(e) => setDefaultCurrency(e.target.value as Currency)}
        >
          <option value={Currency.USD}>USD ($)</option>
          <option value={Currency.ARS}>ARS ($)</option>
        </ListInput>
      </List>

      <BlockTitle>Acerca de</BlockTitle>
      <List strongIos outlineIos>
        <ListItem title="Versión" after="1.0.0" />
        <ListItem title="Desarrollado con" after="Vite + React + Konsta UI" />
      </List>

      <Block className="mt-8">
        <Button large className="text-red-500" onClick={handleSignOut}>
          Cerrar Sesión
        </Button>
      </Block>

      <Block className="text-center text-sm text-gray-500 mt-4">
        <p>Guitaty App © 2025</p>
      </Block>
    </>
  );
};
