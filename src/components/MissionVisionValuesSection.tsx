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
    <section className="relative bg-gradient-to-br from-card via-card to-primary/5 rounded-2xl shadow-2xl p-8 sm:p-10 mb-6 border-2 border-primary/20 overflow-hidden">
      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-4 border-t-4 border-yellow-500 rounded-tl-2xl" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-4 border-b-4 border-yellow-500 rounded-br-2xl" />
      <div className="absolute top-1/2 left-0 w-1 h-32 bg-gradient-to-b from-transparent via-yellow-500 to-transparent transform -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-1 h-32 bg-gradient-to-b from-transparent via-yellow-500 to-transparent transform -translate-y-1/2" />
      
      <div className="relative z-10 flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-primary mb-2 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            Conheça a Pride Corretora
          </h2>
          <p className="text-sm text-muted-foreground ml-15">
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
        <div className="relative z-10 space-y-6 bg-muted/50 backdrop-blur-sm p-8 rounded-xl border border-primary/20">
          {tabs.map((tab) => (
            <div key={tab.id} className="space-y-2">
              <div className="flex items-center gap-2">
                <tab.icon className="w-5 h-5 text-primary" />
                <label className="font-bold text-lg text-primary">{tab.label}</label>
              </div>
              <Textarea
                value={editData[tab.id]}
                onChange={(e) => setEditData({ ...editData, [tab.id]: e.target.value })}
                placeholder={`Descreva a ${tab.label.toLowerCase()} da Pride Corretora...`}
                rows={4}
                className="resize-none border-primary/30"
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
        <div className="relative z-10 space-y-8">
          {/* Botões de navegação */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative overflow-hidden rounded-2xl p-8 transition-all duration-300 border-2
                    ${isActive 
                      ? `bg-gradient-to-br ${tab.color} text-white shadow-2xl scale-105 border-yellow-500` 
                      : 'bg-card/50 backdrop-blur-sm hover:bg-muted/80 text-foreground hover:scale-102 border-primary/20'
                    }
                  `}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className={`
                      rounded-full p-5 transition-all border-2
                      ${isActive ? 'bg-white/20 border-white/30' : 'bg-primary/10 border-primary/20'}
                    `}>
                      <Icon className={`w-10 h-10 ${isActive ? 'text-white' : 'text-primary'}`} />
                    </div>
                    <span className="font-black text-2xl">{tab.label}</span>
                  </div>
                  
                  {isActive && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                      <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
                    </>
                  )}
                </button>
              );
            })}
          </div>

          {/* Conteúdo da aba ativa */}
          {activeTabData && (
            <div className={`
              relative ${activeTabData.bgLight} 
              border-4 ${activeTabData.borderColor} 
              rounded-2xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500
              shadow-xl overflow-hidden
            `}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-yellow-500/10 to-transparent rounded-bl-full" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-yellow-500/10 to-transparent rounded-tr-full" />
              
              <div className="relative z-10 flex items-start gap-6">
                <div className={`
                  flex-shrink-0 rounded-full p-4 bg-gradient-to-br ${activeTabData.color} border-4 border-white dark:border-gray-800 shadow-lg
                `}>
                  <activeTabData.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-black text-primary mb-6 flex items-center gap-2">
                    {activeTabData.label}
                    <div className="h-1 flex-1 bg-gradient-to-r from-yellow-500 to-transparent rounded" />
                  </h3>
                  <p className="text-foreground/90 text-lg leading-relaxed whitespace-pre-wrap">
                    {data[activeTab]}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="relative z-10 text-center py-16 text-muted-foreground">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mx-auto mb-4">
            <Target className="w-10 h-10 text-white" />
          </div>
          <p className="text-lg font-semibold">Nenhum dado configurado ainda</p>
          {effectiveIsAdmin && (
            <Button onClick={() => setIsEditing(true)} className="mt-6 px-6 py-3 font-bold">
              Adicionar Informações
            </Button>
          )}
        </div>
      )}
    </section>
  );
};
