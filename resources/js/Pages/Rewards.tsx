import React from 'react';
import { AdminLayout } from '@/Layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Rewards() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rewards Catalog</h1>
          <p className="text-muted-foreground">
            Manage your loyalty program rewards and redemption options
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Rewards Catalog</CardTitle>
            <CardDescription>
              This page is under development. Rewards management functionality will be implemented here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The rewards catalog will allow you to create and manage reward items,
              set point values, and configure redemption options for your customers.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
