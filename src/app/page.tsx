
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useLanguage, strings } from '@/context/language-context';
import { getCredentials, addUser, updatePassword } from '@/lib/sheets';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { UserCredentials } from '@/types';

type AuthMode = 'login' | 'signup-admin' | 'signup-user' | 'forgot-password-email' | 'forgot-password-reset';

export default function LoginPage() {
  const loginBg = PlaceHolderImages.find(image => image.id === 'login-bg-1');
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();
  const t = strings[language];

  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (email === 'admin@gmail.com' && password === 'admin') {
      toast({ title: t.loginSuccess, description: t.welcomeAdmin });
      router.push('/dashboard');
      return;
    }

    try {
      const credentials = await getCredentials();
      const user = credentials.find(u => u.email === email && u.password === password);
      if (user) {
        toast({ title: t.loginSuccess, description: t.welcomeBack });
        router.push('/dashboard');
      } else {
        toast({ variant: 'destructive', title: t.loginFailed, description: t.invalidCredentials });
        setLoading(false);
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: t.loginFailed, description: error.message });
      setLoading(false);
    }
  };

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@gmail.com' && password === 'admin') {
      setAuthMode('signup-user');
      setEmail('');
      setPassword('');
    } else {
      toast({ variant: 'destructive', title: t.adminAuthFailed, description: t.invalidAdminCredentials });
    }
  };

  const handleUserSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ variant: 'destructive', title: t.signupFailed, description: t.passwordsDoNotMatch });
      return;
    }
    setLoading(true);
    try {
      await addUser({ email, password });
      toast({ title: t.signupSuccess, description: t.userCreatedSuccessfully });
      resetAndCloseDialog();
    } catch (error: any) {
      toast({ variant: 'destructive', title: t.signupFailed, description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const credentials = await getCredentials();
      if (credentials.some(u => u.email === email)) {
        setAuthMode('forgot-password-reset');
      } else {
        toast({ variant: 'destructive', title: t.error, description: t.emailNotRegistered });
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: t.error, description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ variant: 'destructive', title: t.passwordResetFailed, description: t.passwordsDoNotMatch });
      return;
    }
    setLoading(true);
    try {
      await updatePassword(email, newPassword);
      toast({ title: t.passwordResetSuccess, description: t.passwordUpdatedSuccessfully });
      resetAndCloseDialog();
    } catch (error: any) {
      toast({ variant: 'destructive', title: t.passwordResetFailed, description: error.message });
    } finally {
      setLoading(false);
    }
  };
  
  const resetAndCloseDialog = () => {
    setIsDialogOpen(false);
    setAuthMode('login');
    setEmail('');
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const openDialog = (mode: AuthMode) => {
    setAuthMode(mode);
    setIsDialogOpen(true);
    setEmail('');
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }

  const renderDialogContent = () => {
    switch (authMode) {
      case 'signup-admin':
        return (
          <>
            <DialogHeader>
              <DialogTitle>{t.adminAuthentication}</DialogTitle>
              <DialogDescription>{t.enterAdminCredentials}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAdminAuth}>
              <div className="grid gap-4 py-4">
                <Input id="admin-email" type="email" placeholder={t.emailLabel} value={email} onChange={e => setEmail(e.target.value)} required />
                <Input id="admin-password" type="password" placeholder={t.passwordLabel} value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : t.authenticate}</Button>
              </DialogFooter>
            </form>
          </>
        );
      case 'signup-user':
        return (
          <>
            <DialogHeader>
              <DialogTitle>{t.createNewUser}</DialogTitle>
              <DialogDescription>{t.enterNewUserDetails}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUserSignup}>
              <div className="grid gap-4 py-4">
                <Input id="new-user-email" type="email" placeholder={t.emailLabel} value={email} onChange={e => setEmail(e.target.value)} required />
                <Input id="new-user-password" type="password" placeholder={t.passwordLabel} value={password} onChange={e => setPassword(e.target.value)} required />
                <Input id="confirm-password" type="password" placeholder={t.confirmPassword} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : t.createUser}</Button>
              </DialogFooter>
            </form>
          </>
        );
        case 'forgot-password-email':
            return (
              <>
                <DialogHeader>
                  <DialogTitle>{t.forgotPasswordLink}</DialogTitle>
                  <DialogDescription>{t.enterEmailToReset}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleForgotPasswordEmail}>
                  <div className="grid gap-4 py-4">
                    <Input id="reset-email" type="email" placeholder={t.emailLabel} value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : t.findAccount}</Button>
                  </DialogFooter>
                </form>
              </>
            );
        case 'forgot-password-reset':
            return (
                <>
                <DialogHeader>
                    <DialogTitle>{t.resetPassword}</DialogTitle>
                    <DialogDescription>{t.enterNewPasswordFor(email)}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handlePasswordReset}>
                    <div className="grid gap-4 py-4">
                    <Input id="new-password" type="password" placeholder={t.newPassword} value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                    <Input id="confirm-new-password" type="password" placeholder={t.confirmPassword} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                    </div>
                    <DialogFooter>
                    <Button type="submit" disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : t.resetPassword}</Button>
                    </DialogFooter>
                </form>
                </>
            );
      default:
        return null;
    }
  }


  return (
    <div className="w-full h-screen lg:grid lg:grid-cols-2">
      <div className="relative flex items-center justify-center h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-accent/80 z-10"></div>
        {loginBg && (
            <Image
                src={loginBg.imageUrl}
                alt="Background"
                fill
                quality={100}
                className="object-cover"
                data-ai-hint={loginBg.imageHint}
            />
        )}
        <div className="relative z-20 p-8 text-primary-foreground max-w-md">
            <h1 className="text-5xl font-bold font-headline">SmartBiz Lite</h1>
            <p className="mt-4 text-lg">
            {t.appSlogan}
            </p>
        </div>
      </div>
      <div className="flex items-center justify-center py-12 bg-background">
        <div className="mx-auto grid w-[350px] gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{t.loginTitle}</CardTitle>
              <CardDescription>
                {t.loginDescription}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">{t.emailLabel}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">{t.passwordLabel}</Label>
                      <Button variant="link" type="button" onClick={() => openDialog('forgot-password-email')} className="ml-auto inline-block text-sm underline p-0 h-auto">
                        {t.forgotPasswordLink}
                      </Button>
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      {t.loginButton}
                    </Button>
                </div>
              </form>
              <div className="mt-4 text-center text-sm">
                {t.signupPrompt}{' '}
                <Button variant="link" type="button" onClick={() => openDialog('signup-admin')} className="underline p-0 h-auto">
                  {t.signupLink}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
       <Dialog open={isDialogOpen} onOpenChange={(open) => !open && resetAndCloseDialog()}>
            <DialogContent>
                {renderDialogContent()}
            </DialogContent>
        </Dialog>
    </div>
  )
}
