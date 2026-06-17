"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Subscription } from '@/app/_lib/types';
import { paddleApi, authApi } from '@/app/_lib/api';
import { useAuth } from '@/app/_components/AuthProvider';
import { Check, Star, Shield, Users } from 'lucide-react';

interface Tier {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

const tiers: Tier[] = [
  {
    id: 'free',
    name: 'Free',
    monthlyPrice: 0,
    annualPrice: 0,
    description: 'Perfect for trying out the basics',
    features: [
      '2 PDF uploads per month',
      'Up to 100 flashcards',
      'Basic spaced repetition',
      'Web-only access',
      '7-day data retention',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 9.99,
    annualPrice: 95.88,
    description: 'Everything you need for serious studying',
    highlighted: true,
    features: [
      'Unlimited PDF uploads',
      'Unlimited flashcards',
      'Adaptive spaced repetition',
      'Mobile-optimized web UI',
      'Daily email reminders',
      'Mastery tracking per topic',
      'Community starter decks',
    ],
  },
  {
    id: 'plus',
    name: 'Plus',
    monthlyPrice: 14.99,
    annualPrice: 143.88,
    description: 'Advanced features for peak performance',
    features: [
      'All Pro features',
      'Performance insights',
      'Visual mastery maps',
      'Study partner sharing (1 user)',
      'Priority support',
      'Performance guarantee badge',
    ],
    badge: 'Best Value',
  },
];

const PADDLE_SCRIPT = 'https://cdn.paddle.com/paddle/paddle.js';

export default function PricingPage() {
  const router = useRouter();
  const { user, refresh } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [loading, setLoading] = useState<string | null>(null);
  const [currentTier, setCurrentTier] = useState<string>('free');
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    if (user) {
      authApi.subscription().then(setSubscription).catch(() => {});
      setCurrentTier(user.tier);
    }
  }, [user]);

  useEffect(() => {
    if (!(window as any).Paddle) {
      const script = document.createElement('script');
      script.src = PADDLE_SCRIPT;
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleSubscribe = async (tierId: string) => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (tierId === 'free') return;

    setLoading(tierId);
    try {
      const { price_id, client_token } = await paddleApi.checkout(
        tierId,
        billingPeriod
      );

      const paddle = (window as any).Paddle;
      if (paddle) {
        paddle.Environment.set(process.env.NEXT_PUBLIC_PADDLE_ENV || 'sandbox');
        paddle.Initialize({
          token: client_token,
          eventCallback: (event: Record<string, unknown>) => {
            if ((event as { name?: string }).name === 'checkout.completed') {
              const data = event as { data?: { transaction_id?: string } };
              const txnId = data.data?.transaction_id || '';
              window.location.href = `/dashboard?checkout=success&transaction_id=${txnId}`;
            }
          },
        });
        paddle.Checkout.open({
          items: [{ priceId: price_id, quantity: 1 }],
          customData: { user_id: user.id },
          settings: { displayMode: 'overlay' },
        });
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setLoading(null);
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-semibold text-gray-900 mb-4">Choose Your Plan</h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Start with free forever, upgrade when you&apos;re ready for advanced features.
        </p>

        <div className="inline-flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingPeriod === 'monthly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod('annual')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingPeriod === 'annual'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Annual <span className="text-green-600 ml-1">-20%</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier) => {
          const price = billingPeriod === 'monthly' ? tier.monthlyPrice : tier.annualPrice;
          const isCurrentTier = currentTier === tier.id;
          const isFree = tier.id === 'free';

          return (
            <Card
              key={tier.id}
              className={`relative ${tier.highlighted ? 'border-gray-900 ring-1 ring-gray-900' : ''}`}
            >
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gray-900 text-white">{tier.badge}</Badge>
                </div>
              )}
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center pb-6">
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {formatPrice(price)}
                  </span>
                  {price > 0 && (
                    <span className="text-gray-600">/{billingPeriod === 'monthly' ? 'mo' : 'yr'}</span>
                  )}
                </div>
                <ul className="space-y-2 text-sm text-left">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {isCurrentTier ? (
                  <Button className="w-full" variant="secondary" disabled>
                    Current Plan
                  </Button>
                ) : isFree ? (
                  <Button className="w-full" variant="outline" disabled>
                    {user ? 'Current Plan' : 'Get Started' }
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => handleSubscribe(tier.id)}
                    disabled={loading === tier.id}
                  >
                    {loading === tier.id ? 'Loading...' : `Upgrade to ${tier.name}`}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500">
          Need a custom plan?{' '}
          <a href="mailto:support@retainiq.com" className="text-gray-900 underline">
            Contact us
          </a>
        </p>
      </div>
    </div>
  );
}