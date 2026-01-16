import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';
import logoPride from '@/assets/Logo_Pride.png';
import { ArrowLeft, Loader2 } from 'lucide-react';

// Validation schemas
const emailSchema = z.string()
  .email({ message: 'Email inválido' })
  .refine(
    (email) => email.endsWith('@pridecorretora.com.br'),
    { message: 'Apenas emails @pridecorretora.com.br são permitidos' }
  );

const passwordSchema = z.string()
  .min(6, { message: 'A senha deve ter no mínimo 6 caracteres' });

const Auth = () => {
  const { signIn, signUp } = useAuth();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [sendingReset, setSendingReset] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    const emailValidation = emailSchema.safeParse(loginEmail);
    if (!emailValidation.success) {
      toast({
        title: 'Erro de validação',
        description: emailValidation.error.errors[0].message,
        variant: 'destructive',
      });
      return;
    }

    // Validate password
    const passwordValidation = passwordSchema.safeParse(loginPassword);
    if (!passwordValidation.success) {
      toast({
        title: 'Erro de validação',
        description: passwordValidation.error.errors[0].message,
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await signIn(loginEmail, loginPassword);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    const emailValidation = emailSchema.safeParse(signupEmail);
    if (!emailValidation.success) {
      toast({
        title: 'Erro de validação',
        description: emailValidation.error.errors[0].message,
        variant: 'destructive',
      });
      return;
    }

    // Validate password
    const passwordValidation = passwordSchema.safeParse(signupPassword);
    if (!passwordValidation.success) {
      toast({
        title: 'Erro de validação',
        description: passwordValidation.error.errors[0].message,
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await signUp(signupEmail, signupPassword);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    const emailValidation = emailSchema.safeParse(forgotEmail);
    if (!emailValidation.success) {
      toast({
        title: 'Erro de validação',
        description: emailValidation.error.errors[0].message,
        variant: 'destructive',
      });
      return;
    }

    setSendingReset(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) throw error;

      toast({
        title: 'E-mail enviado!',
        description: 'Verifique sua caixa de entrada para redefinir sua senha.',
      });
      setShowForgotPassword(false);
      setForgotEmail('');
    } catch (error: any) {
      toast({
        title: 'Erro ao enviar e-mail',
        description: error.message || 'Não foi possível enviar o e-mail de recuperação.',
        variant: 'destructive',
      });
    } finally {
      setSendingReset(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-lg shadow-xl p-8">
            <div className="flex flex-col items-center mb-6">
              <img src={logoPride} alt="Pride Consultoria" className="w-20 h-20 object-contain mb-4" />
              <h1 className="text-3xl font-black text-foreground">PRIDE CONSULTORIA</h1>
              <p className="text-muted-foreground text-sm mt-2">Recuperação de Senha</p>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-email">Email</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="seu@pridecorretora.com.br"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Digite seu e-mail para receber o link de recuperação
                </p>
              </div>
              
              <Button type="submit" className="w-full" disabled={sendingReset}>
                {sendingReset ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar link de recuperação'
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setShowForgotPassword(false)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para o login
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-xl p-8">
          <div className="flex flex-col items-center mb-6">
            <img src={logoPride} alt="Pride Consultoria" className="w-20 h-20 object-contain mb-4" />
            <h1 className="text-3xl font-black text-foreground">PRIDE CONSULTORIA</h1>
            <p className="text-muted-foreground text-sm mt-2">Roteiro de Prospecção SDR</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Cadastro</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="seu@pridecorretora.com.br"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Apenas emails @pridecorretora.com.br</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Senha</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
                
                <button
                  type="button"
                  className="w-full text-sm text-primary hover:underline"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Esqueci minha senha
                </button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="seu@pridecorretora.com.br"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Apenas emails @pridecorretora.com.br</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Senha</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <p className="text-xs text-muted-foreground">Mínimo de 6 caracteres</p>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Criando conta...' : 'Criar conta'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;