import { useState, useEffect } from 'react';
import { FileText, Download, Trash2, Upload } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

interface PdfSectionProps {
  darkMode: boolean;
  userViewMode: boolean;
}

interface PdfFile {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  thumbnail_url: string | null;
  display_order: number;
  created_at: string;
}

export const PdfSection = ({ darkMode, userViewMode }: PdfSectionProps) => {
  const { isAdmin } = useIsAdmin();
  const [pdfFiles, setPdfFiles] = useState<PdfFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const showAdminFeatures = isAdmin && !userViewMode;

  useEffect(() => {
    loadPdfFiles();

    const channel = supabase
      .channel('pdf_files_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pdf_files'
        },
        () => {
          loadPdfFiles();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadPdfFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('pdf_files')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPdfFiles(data || []);
    } catch (error: any) {
      console.error('Error loading PDFs:', error);
      toast({
        title: 'Erro ao carregar PDFs',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: 'Arquivo inválido',
          description: 'Por favor, selecione apenas arquivos PDF',
          variant: 'destructive',
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !title.trim()) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha o título e selecione um arquivo PDF',
        variant: 'destructive',
      });
      return;
    }

    try {
      setUploading(true);

      const fileExt = 'pdf';
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('pdf_files')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('pdf_files')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('pdf_files')
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          file_path: filePath,
          file_url: urlData.publicUrl,
          display_order: pdfFiles.length,
        });

      if (dbError) throw dbError;

      toast({
        title: 'PDF enviado!',
        description: 'O arquivo foi adicionado com sucesso.',
      });

      setTitle('');
      setDescription('');
      setSelectedFile(null);
      setUploadDialogOpen(false);
      loadPdfFiles();
    } catch (error: any) {
      console.error('Error uploading PDF:', error);
      toast({
        title: 'Erro ao enviar PDF',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, filePath: string) => {
    if (!confirm('Tem certeza que deseja excluir este PDF?')) return;

    try {
      const { error: storageError } = await supabase.storage
        .from('pdf_files')
        .remove([filePath]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('pdf_files')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      toast({
        title: 'PDF excluído',
        description: 'O arquivo foi removido com sucesso.',
      });

      loadPdfFiles();
    } catch (error: any) {
      console.error('Error deleting PDF:', error);
      toast({
        title: 'Erro ao excluir PDF',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDownload = (fileUrl: string, title: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = `${title}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <section className="bg-card rounded-2xl shadow-xl p-8 mb-6">
        <div className="text-center text-muted-foreground">Carregando PDFs...</div>
      </section>
    );
  }

  return (
    <section className="bg-card rounded-2xl shadow-xl p-6 sm:p-8 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl font-black text-primary flex items-center gap-3">
          <FileText className="w-8 h-8" />
          Materiais em PDF
        </h2>
        {showAdminFeatures && (
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Upload className="w-4 h-4 mr-2" />
                Adicionar PDF
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload de PDF</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Título *
                  </label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Manual de Vendas"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Descrição
                  </label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Breve descrição do conteúdo..."
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Arquivo PDF *
                  </label>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                  />
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {selectedFile.name}
                    </p>
                  )}
                </div>
                <Button
                  onClick={handleUpload}
                  disabled={uploading || !selectedFile || !title.trim()}
                  className="w-full"
                >
                  {uploading ? 'Enviando...' : 'Enviar PDF'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {pdfFiles.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Nenhum PDF disponível no momento</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pdfFiles.map((pdf) => (
            <Card key={pdf.id} className="bg-gradient-subtle border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg overflow-hidden">
              <div className="flex flex-col h-full">
                {/* PDF Preview/Thumbnail */}
                <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 h-48 flex items-center justify-center overflow-hidden relative border-b-4 border-primary/30">
                  {pdf.thumbnail_url ? (
                    <img
                      src={pdf.thumbnail_url}
                      alt={pdf.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <FileText className="w-20 h-20 text-primary/60" strokeWidth={1.5} />
                      <span className="text-xs font-bold text-primary/70 uppercase tracking-wider">
                        Documento PDF
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Title */}
                  <h3 className="text-lg font-bold text-primary mb-2 line-clamp-2">
                    {pdf.title}
                  </h3>

                  {/* Description */}
                  {pdf.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-grow">
                      {pdf.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto">
                    <Button
                      onClick={() => handleDownload(pdf.file_url, pdf.title)}
                      variant="default"
                      size="sm"
                      className="flex-1"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Baixar
                    </Button>
                    {showAdminFeatures && (
                      <Button
                        onClick={() => handleDelete(pdf.id, pdf.file_url.split('/').pop() || '')}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};
