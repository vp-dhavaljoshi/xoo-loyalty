import React from 'react';
import { AdminLayout } from '@/Layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Campaigns() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">
            Create and manage marketing campaigns and promotions
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Campaigns</CardTitle>
            <CardDescription>
              This page is under development. Campaign management functionality will be implemented here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The campaigns page will allow you to create targeted marketing campaigns,
              set up promotional offers, and track campaign performance.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
