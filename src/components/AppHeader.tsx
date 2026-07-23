import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Sun, Moon, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { HowToUseVideoDialog } from '@/components/HowToUseVideoDialog';
import logoPride from '@/assets/Logo_Pride.png';

interface AppHeaderProps {
  /** Só o Index usa o modo "visualizar como usuário"; sem o callback o botão não aparece. */
  userViewMode?: boolean;
  onToggleUserViewMode?: () => void;
  /** Mantém o estado de tema da página pai em sincronia. */
  onDarkModeChange?: (dark: boolean) => void;
}

/**
 * Barra "PRIDE CONSULTORIA" — usada no topo congelado de todas as páginas.
 */
export const AppHeader = ({ userViewMode, onToggleUserViewMode, onDarkModeChange }: AppHeaderProps) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { isAdmin } = useIsAdmin();
  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains('dark'),
  );

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
    onDarkModeChange?.(next);
  };

  return (
    <header className="bg-gradient-hero rounded-lg shadow-xl p-4 sm:p-5">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <img src={logoPride} alt="Pride Consultoria" className="w-11 h-11 sm:w-14 sm:h-14 object-contain" />
          <div>
            <h1 className="text-xl sm:text-3xl font-black text-accent">PRIDE CONSULTORIA</h1>
            <p className="text-accent/80 font-semibold text-xs sm:text-sm mt-0.5">
              Plataforma de Desenvolvimento
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <HowToUseVideoDialog isAdmin={isAdmin} />

          {isAdmin && (
            <button
              onClick={() => navigate('/admin')}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg"
              title="Painel Admin"
            >
              <Shield className="w-5 h-5" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}

          {isAdmin && onToggleUserViewMode && (
            <button
              onClick={onToggleUserViewMode}
              className={`${
                userViewMode
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-primary/10 hover:bg-primary/20 text-accent'
              } font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg`}
              title={userViewMode ? 'Modo Admin' : 'Visualizar como Usuário'}
            >
              {userViewMode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}

          <button
            onClick={toggleDarkMode}
            className="bg-primary/10 hover:bg-primary/20 text-accent font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg"
            title={darkMode ? 'Modo claro' : 'Modo escuro'}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            onClick={() => signOut()}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg"
            title="Sair"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
};
