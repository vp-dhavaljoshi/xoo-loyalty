import { useState, useEffect } from 'react';
import { AdminLayout } from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Shield, 
  DollarSign, 
  Gift, 
  Save,
  Users,
  Coins,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import axios from 'axios';

interface SettingsProps {
  settings?: any;
  settingsLoaded?: boolean;
}

export default function Settings({ settings: initialSettings, settingsLoaded }: SettingsProps) {
  const [settings, setSettings] = useState({
    // Fraud Prevention 
    fraudPreventionEnabled: true,
    requireOrderCompletion: true,
    timeBasedFreeze: true,
    freezeDurationHours: 24,
    newCustomerFreeze: true,
    customerAgeThresholdDays: 7,
    releaseOnOrderCompletion: true,
    
    // Points & Currency
    currencyToPointRate: 100, // $1 USD = 100 points
    currency: 'USD',
    
    // Signup Rewards
    signupBonusPoints: 100
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState('');

  // Load settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await axios.get('/admin/api/settings/');
        if (response.data.status && response.data.data) {
          setSettings(response.data.data);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        // Use initial settings from props if API fails
        if (initialSettings) {
          setSettings(initialSettings);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (settingsLoaded && initialSettings) {
      setSettings(initialSettings);
      setIsLoading(false);
    } else {
      loadSettings();
    }
  }, [initialSettings, settingsLoaded]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      const response = await axios.put('/admin/api/settings/', {
        settings: settings
      });
      
      if (response.data.status) {
        setSaveMessage('Settings saved successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage('Failed to save settings: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage('Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading settings...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Global Settings</h1>
            <p className="text-muted-foreground">
              Configure your loyalty program settings
            </p>
          </div>
          <div className="flex items-center gap-4">
            {saveMessage && (
              <p className={`text-sm ${saveMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                {saveMessage}
              </p>
            )}
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Fraud Prevention & Point Freezing */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Fraud Prevention & Point Freezing
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Enable Fraud Prevention */}
            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="font-medium text-gray-900">Enable Fraud Prevention</h3>
                <p className="text-sm text-gray-500">
                  Automatically freeze suspicious reward points until verification
                </p>
              </div>
              <Switch
                checked={settings.fraudPreventionEnabled}
                onCheckedChange={(checked) => updateSetting('fraudPreventionEnabled', checked)}
              />
            </div>

            {/* Conditional content when fraud prevention is enabled */}
            {settings.fraudPreventionEnabled && (
              <>
                {/* Freeze Triggers */}
                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <h3 className="font-medium text-gray-900">Freeze Triggers</h3>
                  </div>
                  
                  {/* Require Order Completion */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Require Order Completion</h4>
                        <p className="text-sm text-gray-500">
                          Freeze points until the related order is completed/shipped
                        </p>
                      </div>
                      <Switch
                        checked={settings.requireOrderCompletion}
                        onCheckedChange={(checked) => updateSetting('requireOrderCompletion', checked)}
                      />
                    </div>
                  </div>

                  {/* Time-based Freeze */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Time-based Freeze</h4>
                          <p className="text-sm text-gray-500">
                            Freeze points for a specific duration after earning
                          </p>
                        </div>
                        <Switch
                          checked={settings.timeBasedFreeze}
                          onCheckedChange={(checked) => updateSetting('timeBasedFreeze', checked)}
                        />
                      </div>
                      {settings.timeBasedFreeze && (
                        <div className="ml-0 space-y-2 border-gray-100">
                          <div className="flex items-center gap-4">
                            <Label htmlFor="freezeDuration" className="text-sm font-medium text-gray-700">
                              Freeze Duration (hours)
                            </Label>
                            <Input
                              id="freezeDuration"
                              type="number"
                              value={settings.freezeDurationHours}
                              onChange={(e) => updateSetting('freezeDurationHours', parseInt(e.target.value) || 0)}
                              className="w-16 h-8"
                              min="1"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* New Customer Freeze */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">New Customer Freeze</h4>
                          <p className="text-sm text-gray-500">
                            Freeze points for recently registered customers
                          </p>
                        </div>
                        <Switch
                          checked={settings.newCustomerFreeze}
                          onCheckedChange={(checked) => updateSetting('newCustomerFreeze', checked)}
                        />
                      </div>
                      {settings.newCustomerFreeze && (
                        <div className="ml-0 border-gray-100">
                          <div className="flex items-center gap-4">
                            <Label htmlFor="customerAgeThreshold" className="text-sm font-medium text-gray-700">
                              Customer Age Threshold (days)
                            </Label>
                            <Input
                              id="customerAgeThreshold"
                              type="number"
                              value={settings.customerAgeThresholdDays}
                              onChange={(e) => updateSetting('customerAgeThresholdDays', parseInt(e.target.value) || 0)}
                              className="w-16 h-8"
                              min="1"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>


                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Points & Currency */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Points & Currency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Currency to Points Rate</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm">$1 {settings.currency} =</span>
                  <Input
                    type="number"
                    step="1"
                    value={settings.currencyToPointRate}
                    onChange={(e) => updateSetting('currencyToPointRate', parseInt(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-sm">points</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  How many points each dollar is worth
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Signup Rewards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Signup Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Signup Bonus Points</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    type="number"
                    value={settings.signupBonusPoints}
                    onChange={(e) => updateSetting('signupBonusPoints', parseInt(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-sm">points</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Points awarded when a customer creates a new account
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Current Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Members */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Total Members</span>
                </div>
                <div className="text-2xl font-bold text-blue-900">1,234</div>
              </div>

              {/* Points Issued */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Coins className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Points Issued</span>
                </div>
                <div className="text-2xl font-bold text-green-900">45,678</div>
              </div>

              {/* Frozen Points */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">Frozen Points</span>
                </div>
                <div className="text-2xl font-bold text-orange-900">1,856</div>
                <div className="text-xs text-orange-700 mt-1">
                    {settings.fraudPreventionEnabled ? '(Fraud Prevention Active)' : '(Fraud Prevention Inactive)'}
                </div>
              </div>

              {/* Total Value */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">Total Value</span>
                </div>
                <div className="text-2xl font-bold text-purple-900">
                  ${(45678 / settings.currencyToPointRate).toFixed(2)}
                </div>
                <div className="text-xs text-purple-700 mt-1">
                  (Based on current rate: $1 = {settings.currencyToPointRate} points)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
