import { useState, useEffect } from 'react';
import { Target, Eye, Award, Edit, Save, X } from 'lucide-react';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

interface MissionVisionValuesProps {
  darkMode: boolean;
  userViewMode?: boolean;
}

interface MVVData {
  id: string;
  mission: string;
  vision: string;
  values: string;
}

type TabType = 'mission' | 'vision' | 'values';

export const MissionVisionValuesSection = ({ darkMode, userViewMode = false }: MissionVisionValuesProps) => {
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const effectiveIsAdmin = isAdmin && !userViewMode;
  const [data, setData] = useState<MVVData | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('mission');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ mission: '', vision: '', values: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: mvvData, error } = await supabase
        .from('mission_vision_values')
        .select('*')
        .maybeSingle();

      if (error) throw error;
      
      if (mvvData) {
        const typedData: MVVData = {
          id: mvvData.id,
          mission: mvvData.mission,
          vision: mvvData.vision,
          values: mvvData.values,
        };
        setData(typedData);
        setEditData({
          mission: typedData.mission,
          vision: typedData.vision,
          values: typedData.values,
        });
      }
    } catch (error: any) {
      console.error('Error loading MVV data:', error);
    }
  };

  const handleSave = async () => {
    if (!editData.mission.trim() || !editData.vision.trim() || !editData.values.trim()) {
      toast({
        title: 'Erro',
        description: 'Todos os campos são obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      if (data) {
        // Update
        const { error } = await supabase
          .from('mission_vision_values')
          .update({
            mission: editData.mission.trim(),
            vision: editData.vision.trim(),
            values: editData.values.trim(),
          })
          .eq('id', data.id);

        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('mission_vision_values')
          .insert({
            mission: editData.mission.trim(),
            vision: editData.vision.trim(),
            values: editData.values.trim(),
            created_by: user.id,
          });

        if (error) throw error;
      }

      toast({
        title: 'Sucesso',
        description: 'Dados salvos com sucesso',
      });

      setIsEditing(false);
      loadData();
    } catch (error: any) {
      console.error('Error saving MVV data:', error);
      toast({
        title: 'Erro ao salvar',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const tabs = [
    { 
      id: 'mission' as TabType, 
      label: 'Missão', 
      icon: Target,
      color: 'from-blue-500 to-cyan-500',
      bgLight: 'bg-blue-50 dark:bg-blue-950/20',
      borderColor: 'border-blue-400 dark:border-blue-600',
    },
    { 
      id: 'vision' as TabType, 
      label: 'Visão', 
      icon: Eye,
      color: 'from-purple-500 to-pink-500',
      bgLight: 'bg-purple-50 dark:bg-purple-950/20',
      borderColor: 'border-purple-400 dark:border-purple-600',
    },
    { 
      id: 'values' as TabType, 
      label: 'Valores', 
      icon: Award,
      color: 'from-orange-500 to-red-500',
      bgLight: 'bg-orange-50 dark:bg-orange-950/20',
      borderColor: 'border-orange-400 dark:border-orange-600',
    },
  ];

  const activeTabData = tabs.find(t => t.id === activeTab);

  return (
    <section className="bg-card rounded-lg shadow-xl p-6 sm:p-8 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-primary mb-2">
            Conheça a Pride Corretora
          </h2>
          <p className="text-sm text-muted-foreground">
            Nossa essência, propósito e compromisso
          </p>
        </div>
        {!adminLoading && effectiveIsAdmin && !isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            className="gap-2"
          >
            <Edit className="w-5 h-5" />
            Editar
          </Button>
        )}
      </div>

      {isEditing && effectiveIsAdmin ? (
        <div className="space-y-6 bg-muted/30 p-6 rounded-lg">
          {tabs.map((tab) => (
            <div key={tab.id} className="space-y-2">
              <div className="flex items-center gap-2">
                <tab.icon className="w-5 h-5 text-primary" />
                <label className="font-bold text-lg">{tab.label}</label>
              </div>
              <Textarea
                value={editData[tab.id]}
                onChange={(e) => setEditData({ ...editData, [tab.id]: e.target.value })}
                placeholder={`Descreva a ${tab.label.toLowerCase()} da Pride Corretora...`}
                rows={4}
                className="resize-none"
              />
            </div>
          ))}

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                if (data) {
                  setEditData({
                    mission: data.mission,
                    vision: data.vision,
                    values: data.values,
                  });
                }
              }}
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* Botões de navegação */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative overflow-hidden rounded-xl p-6 transition-all duration-300 
                    ${isActive 
                      ? `bg-gradient-to-br ${tab.color} text-white shadow-2xl scale-105` 
                      : 'bg-muted hover:bg-muted/80 text-foreground hover:scale-102'
                    }
                  `}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className={`
                      rounded-full p-4 transition-all
                      ${isActive ? 'bg-white/20' : 'bg-primary/10'}
                    `}>
                      <Icon className={`w-8 h-8 ${isActive ? 'text-white' : 'text-primary'}`} />
                    </div>
                    <span className="font-black text-xl">{tab.label}</span>
                  </div>
                  
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Conteúdo da aba ativa */}
          {activeTabData && (
            <div className={`
              ${activeTabData.bgLight} 
              ${activeTabData.borderColor} 
              border-2 rounded-lg p-6 animate-in fade-in slide-in-from-bottom-4 duration-500
            `}>
              <div className="flex items-start gap-4">
                <div className={`
                  rounded-full p-3 bg-gradient-to-br ${activeTabData.color}
                `}>
                  <activeTabData.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-foreground mb-4">
                    {activeTabData.label}
                  </h3>
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                    {data[activeTab]}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Nenhum dado configurado ainda</p>
          {effectiveIsAdmin && (
            <Button onClick={() => setIsEditing(true)} className="mt-4">
              Adicionar Informações
            </Button>
          )}
        </div>
      )}
    </section>
  );
};
