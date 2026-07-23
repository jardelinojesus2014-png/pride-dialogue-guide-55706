import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TrainingSearchItem {
  key: string;
  kind: 'operadora' | 'category' | 'content' | 'topic';
  title: string;
  parentName?: string;
  parentType?: 'operadora' | 'category';
  parentId?: string;
  contentType?: 'video' | 'pdf' | 'photo' | 'audio';
  fileUrl?: string;
  description?: string;
  topicId?: string; // para kind 'topic': âncora dentro da página da operadora
}

/**
 * Monta um índice único e pesquisável de tudo que existe na aba de Treinamentos:
 * operadoras, categorias e todos os conteúdos (vídeos, PDFs, áudios, fotos).
 */
export const useTrainingSearch = () => {
  const [items, setItems] = useState<TrainingSearchItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [opsRes, catsRes, opContentRes, catContentRes, topicsRes, catTopicsRes] = await Promise.all([
        supabase.from('operadoras').select('id, name'),
        supabase.from('training_categories').select('id, title, description, is_operadoras_section'),
        supabase.from('operadora_content').select('id, operadora_id, content_type, title, description, file_url'),
        supabase.from('training_category_content').select('id, category_id, content_type, title, description, file_url'),
        (supabase as any).from('operadora_topics').select('id, operadora_id, title, body'),
        (supabase as any).from('category_topics').select('id, category_id, title, body'),
      ]);

      const operadoras = (opsRes.data || []) as any[];
      const categories = (catsRes.data || []) as any[];
      const opMap = new Map(operadoras.map((o) => [o.id, o.name]));
      const catMap = new Map(categories.map((c) => [c.id, c.title]));

      const result: TrainingSearchItem[] = [];

      operadoras.forEach((o) => {
        result.push({ key: `op-${o.id}`, kind: 'operadora', title: o.name, parentId: o.id });
      });

      categories.forEach((c) => {
        // A categoria "Operadoras" já é representada pelas operadoras em si
        if (c.is_operadoras_section) return;
        result.push({
          key: `cat-${c.id}`,
          kind: 'category',
          title: c.title,
          parentId: c.id,
          description: c.description || undefined,
        });
      });

      (opContentRes.data || []).forEach((ct: any) => {
        result.push({
          key: `opc-${ct.id}`,
          kind: 'content',
          title: ct.title,
          parentName: opMap.get(ct.operadora_id),
          parentType: 'operadora',
          parentId: ct.operadora_id,
          contentType: ct.content_type,
          fileUrl: ct.file_url,
          description: ct.description || undefined,
        });
      });

      (catContentRes.data || []).forEach((ct: any) => {
        result.push({
          key: `catc-${ct.id}`,
          kind: 'content',
          title: ct.title,
          parentName: catMap.get(ct.category_id),
          parentType: 'category',
          parentId: ct.category_id,
          contentType: ct.content_type,
          fileUrl: ct.file_url,
          description: ct.description || undefined,
        });
      });

      // Tópicos de documentação das operadoras (ex: Carências, Regras comerciais)
      ((topicsRes as any).data || []).forEach((t: any) => {
        result.push({
          key: `topic-${t.id}`,
          kind: 'topic',
          title: t.title,
          parentName: opMap.get(t.operadora_id),
          parentType: 'operadora',
          parentId: t.operadora_id,
          topicId: t.id,
          description: t.body || undefined,
        });
      });

      // Tópicos de documentação das categorias (ex: Fluxo de Oportunidades → Dia 01...)
      ((catTopicsRes as any).data || []).forEach((t: any) => {
        result.push({
          key: `cat-topic-${t.id}`,
          kind: 'topic',
          title: t.title,
          parentName: catMap.get(t.category_id),
          parentType: 'category',
          parentId: t.category_id,
          topicId: t.id,
          description: t.body || undefined,
        });
      });

      setItems(result);
    } catch (error) {
      console.error('Error building training search index:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return { items, loading, refetch: fetchAll };
};
