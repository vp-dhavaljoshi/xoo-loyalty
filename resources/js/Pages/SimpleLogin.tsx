import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface SimpleLoginProps {
  error?: string;
}

export default function SimpleLogin({ error }: SimpleLoginProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = (userId: number) => {
    setLoading(true);
    
    // Use the debug login route
    router.visit(`/debug/login-user/${userId}`, {
      method: 'get',
      onSuccess: () => {
        toast({
          title: "Login Successful!",
          description: "Redirecting to dashboard...",
          variant: "default",
        });
        
        // Redirect to dashboard after successful login
        setTimeout(() => {
          router.visit('/admin/dashboard');
        }, 1000);
      },
      onError: () => {
        toast({
          title: "Login Failed",
          description: "Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      }
    });
  };

  return (
    <>
      <Head title="Login - Loyalty System" />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Loyalty System Login</CardTitle>
            <CardDescription>
              Choose a user to login with (Development Only)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-100 rounded">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Button 
                onClick={() => handleLogin(1)} 
                disabled={loading}
                className="w-full"
                variant="default"
              >
                {loading ? 'Logging in...' : 'Login as Rick Frederick (Brand Admin)'}
              </Button>
              
              <Button 
                onClick={() => handleLogin(2)} 
                disabled={loading}
                className="w-full"
                variant="outline"
              >
                {loading ? 'Logging in...' : 'Login as David Doe'}
              </Button>
            </div>
            
            <div className="pt-4 text-xs text-gray-500 text-center">
              This is a development login page. In production, users would login through the XOO admin panel.
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
