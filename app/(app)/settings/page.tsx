"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { APIKeyResponse, Subscription } from '@/app/_lib/types';
import { settingsApi, paddleApi, authApi } from '@/app/_lib/api';
import { useAuth } from '@/app/_components/AuthProvider';
import { Loader2, Key, Trash2, ExternalLink, User, CreditCard, Bell } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { user, refresh } = useAuth();

  const [apiKeyMasked, setApiKeyMasked] = useState('');
  const [apiKeyExists, setApiKeyExists] = useState(false);
  const [newApiKey, setNewApiKey] = useState('');
  const [savingKey, setSavingKey] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [portalUrl, setPortalUrl] = useState('');
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [keyData, subData] = await Promise.all([
          settingsApi.getApiKey(),
          settingsApi.getSubscription(),
        ]);
        setApiKeyMasked(keyData.key_masked);
        setApiKeyExists(keyData.exists);
        setSubscription(subData);
      } catch (err) {
        console.error('Failed to load settings', err);
      }
    };
    loadData();
  }, []);

  const handleSaveApiKey = async () => {
    if (!newApiKey.trim()) return;
    setSavingKey(true);
    try {
      const result = await settingsApi.setApiKey(newApiKey);
      setApiKeyMasked(result.key_masked);
      setApiKeyExists(result.exists);
      setNewApiKey('');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save API key');
    } finally {
      setSavingKey(false);
    }
  };

  const handleDeleteApiKey = async () => {
    if (!confirm('Delete your API key? You will use the platform default.')) return;
    try {
      await settingsApi.deleteApiKey();
      setApiKeyMasked('');
      setApiKeyExists(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  const handleOpenPortal = async () => {
    setLoadingPortal(true);
    try {
      const { url } = await paddleApi.getPortalUrl();
      window.location.href = url;
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to open portal');
    } finally {
      setLoadingPortal(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
    try {
      await settingsApi.deleteAccount();
      router.push('/login');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete account');
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Settings</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account
            </CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Email Verified</p>
                <p className="font-medium text-gray-900">
                  {user?.is_email_verified ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Subscription
            </CardTitle>
            <CardDescription>Manage your subscription and billing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Plan</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="font-medium text-gray-900 capitalize">{subscription?.tier || user?.tier}</p>
                  {subscription?.tier === 'plus' && (
                    <Badge variant="outline" className="bg-purple-50 text-purple-700">
                      Performance Guarantee
                    </Badge>
                  )}
                </div>
              </div>
              {!user?.tier || user.tier === 'free' ? (
                <Button variant="outline" onClick={() => router.push('/pricing')}>
                  Upgrade
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleOpenPortal}
                  disabled={loadingPortal}
                >
                  {loadingPortal ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ExternalLink className="h-4 w-4 mr-2" />}
                  Manage Billing
                </Button>
              )}
            </div>
            {subscription && subscription.tier !== 'free' && (
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-gray-600">Billing: </span>
                    <span className="font-medium text-gray-900 capitalize">{subscription.billing_period}</span>
                  </div>
                  {subscription.current_period_end && (
                    <div>
                      <span className="text-gray-600">Next billing: </span>
                      <span className="font-medium text-gray-900">
                        {new Date(subscription.current_period_end).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              OpenAI API Key
            </CardTitle>
            <CardDescription>
              Use your own API key for more generation capacity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {apiKeyExists ? (
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <code className="text-sm text-gray-600">{apiKeyMasked}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDeleteApiKey}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <p className="text-sm text-gray-600">No custom API key configured</p>
            )}
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="sk-..."
                value={newApiKey}
                onChange={(e) => setNewApiKey(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSaveApiKey} disabled={savingKey || !newApiKey.trim()}>
                {savingKey ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Daily Review Reminders</p>
                <p className="text-sm text-gray-600">Get email reminders to review your cards</p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
                disabled={user?.tier === 'free'}
              />
            </div>
            {user?.tier === 'free' && (
              <p className="text-sm text-gray-500 mt-2">
                Upgrade to Pro or Plus to enable email reminders
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}