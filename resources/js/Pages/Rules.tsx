import React from 'react';
import { AdminLayout } from '@/Layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Rules() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rules Engine</h1>
          <p className="text-muted-foreground">
            Configure and manage your loyalty program rules and conditions
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Rules Engine</CardTitle>
            <CardDescription>
              This page is under development. Rules engine functionality will be implemented here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The rules engine will allow you to create complex loyalty program rules,
              point calculations, and automated actions based on customer behavior.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
