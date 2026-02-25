import { useState } from 'react';
import { Eye, Download, Trash2, Calendar, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Campaign } from '@/hooks/useCampaigns';

interface CampaignCardProps {
  campaign: Campaign;
  isAdmin: boolean;
  onDelete?: (id: string, bannerPath: string | null) => void;
}

export const CampaignCard = ({ campaign, isAdmin, onDelete }: CampaignCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const statusColor = campaign.status === 'ativa' 
    ? 'bg-green-500 text-white' 
    : campaign.status === 'vencendo' 
    ? 'bg-yellow-500 text-white'
    : 'bg-muted text-muted-foreground';

  const formatDate = (date: string | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  return (
    <>
      <Card className="overflow-hidden border-2 border-border hover:border-primary/40 transition-all hover:shadow-lg group">
        {/* Banner */}
        {campaign.banner_image_url && (
          <div className="relative h-48 overflow-hidden">
            <img 
              src={campaign.banner_image_url} 
              alt={campaign.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        
        <CardContent className="p-4 space-y-3">
          {/* Operadora + Status */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              {campaign.operadora_logo_url && (
                <img src={campaign.operadora_logo_url} alt={campaign.operadora_name} className="w-6 h-6 object-contain" />
              )}
              <span className="text-sm font-medium text-muted-foreground">{campaign.operadora_name}</span>
            </div>
            <div className="flex gap-1">
              <Badge className={statusColor}>{campaign.status}</Badge>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-foreground text-lg leading-tight">{campaign.title}</h3>
          
          {/* Description */}
          {campaign.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{campaign.description}</p>
          )}

          {/* Dates */}
          {(campaign.start_date || campaign.end_date) && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(campaign.start_date)} — {formatDate(campaign.end_date)}</span>
            </div>
          )}

          {/* Tags */}
          {campaign.tags && campaign.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {campaign.tags.map((tag, i) => (
                <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button size="sm" onClick={() => setShowDetails(true)} className="flex-1">
              <Eye className="w-3.5 h-3.5 mr-1" />
              Ver detalhes
            </Button>
            {campaign.creative_file_urls && campaign.creative_file_urls.length > 0 && (
              <Button size="sm" variant="outline" className="flex-1" asChild>
                <a href={campaign.creative_file_urls[0]} target="_blank" rel="noopener noreferrer">
                  <Download className="w-3.5 h-3.5 mr-1" />
                  Criativos
                </a>
              </Button>
            )}
            {isAdmin && onDelete && (
              <Button size="sm" variant="destructive" onClick={() => onDelete(campaign.id, campaign.banner_image_path)}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{campaign.title}</DialogTitle>
          </DialogHeader>
          
          {campaign.banner_image_url && (
            <img src={campaign.banner_image_url} alt={campaign.title} className="w-full rounded-lg" />
          )}

          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={statusColor}>{campaign.status}</Badge>
              <span className="text-sm text-muted-foreground">{campaign.operadora_name}</span>
            </div>

            {campaign.description && <p className="text-foreground">{campaign.description}</p>}
            
            {campaign.details_content && (
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm whitespace-pre-wrap">{campaign.details_content}</p>
              </div>
            )}

            {(campaign.start_date || campaign.end_date) && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Vigência: {formatDate(campaign.start_date)} — {formatDate(campaign.end_date)}</span>
              </div>
            )}

            {campaign.tags && campaign.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {campaign.tags.map((tag, i) => (
                  <Badge key={i} variant="outline">{tag}</Badge>
                ))}
              </div>
            )}

            {campaign.creative_file_urls && campaign.creative_file_urls.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Criativos</h4>
                <div className="grid grid-cols-2 gap-2">
                  {campaign.creative_file_urls.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" />
                      {campaign.creative_file_names?.[i] || `Arquivo ${i + 1}`}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
