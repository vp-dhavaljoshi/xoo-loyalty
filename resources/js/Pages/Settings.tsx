import React from 'react';
import { AdminLayout } from '@/Layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Settings() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Configure your loyalty program settings and preferences
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>
              This page is under development. Settings configuration will be implemented here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The settings page will allow you to configure program parameters,
              user permissions, notification preferences, and system integrations.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
