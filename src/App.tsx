import { useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import { LandingPage } from './pages/LandingPage';
import { RicercaClientiModule } from './modules/ricerca-clienti/RicercaClientiModule';
import { RicercaFornitoriModule } from './modules/ricerca-fornitori/RicercaFornitoriModule';
import { ConsulenzaPersonaleModule } from './modules/consulenza-personale/ConsulenzaPersonaleModule';

export type ModuleId =
  | 'landing'
  | 'ricerca-clienti'
  | 'ricerca-fornitori'
  | 'consulenza-personale';

const App = () => {
  const [currentModule, setCurrentModule] = useState<ModuleId>('landing');

  if (currentModule === 'landing') {
    return <LandingPage onSelect={setCurrentModule} />;
  }

  return (
    <AppShell onBack={() => setCurrentModule('landing')}>
      {currentModule === 'ricerca-clienti' && <RicercaClientiModule />}
      {currentModule === 'ricerca-fornitori' && <RicercaFornitoriModule />}
      {currentModule === 'consulenza-personale' && <ConsulenzaPersonaleModule />}
    </AppShell>
  );
};

export default App;
