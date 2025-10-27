-- Criar políticas RLS para o bucket audio-files permitindo admins fazerem upload e deleção

-- Política para permitir qualquer pessoa autenticada visualizar os áudios (bucket é público)
CREATE POLICY "Permitir visualização pública de áudios"
ON storage.objects
FOR SELECT
USING (bucket_id = 'audio-files');

-- Política para permitir admins fazerem upload de áudios
CREATE POLICY "Admins podem fazer upload de áudios"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'audio-files' 
  AND public.is_admin(auth.uid())
);

-- Política para permitir admins deletarem áudios
CREATE POLICY "Admins podem deletar áudios"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'audio-files' 
  AND public.is_admin(auth.uid())
);

-- Política para permitir admins atualizarem áudios
CREATE POLICY "Admins podem atualizar áudios"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'audio-files' 
  AND public.is_admin(auth.uid())
);