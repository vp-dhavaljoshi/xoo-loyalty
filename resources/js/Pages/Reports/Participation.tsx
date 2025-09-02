import React from 'react';
import { AdminLayout } from '@/Layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ParticipationReport() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Participation Report</h1>
          <p className="text-muted-foreground">
            Analyze customer participation and engagement metrics
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Participation Report</CardTitle>
            <CardDescription>
              This report is under development. Participation analytics will be implemented here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The participation report will provide insights into customer engagement,
              program adoption rates, and participation trends over time.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
