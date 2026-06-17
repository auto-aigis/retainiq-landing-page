"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardStats, Deck, Insight } from '@/app/_lib/types';
import { dashboardApi, deckApi, insightsApi, paddleApi } from '@/app/_lib/api';
import { useAuth } from '@/app/_components/AuthProvider';
import { Loader2, Flame, BookOpen, Calendar, TrendingUp, AlertCircle } from 'lucide-react';

function DashboardContent() {
  const { user, refresh } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const checkoutSuccess = searchParams.get('checkout') === 'success';
  const transactionId = searchParams.get('transaction_id');

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [insights, setInsights] = useState<Insight | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, decksData] = await Promise.all([
          dashboardApi.getStats(),
          deckApi.list(),
        ]);
        setStats(statsData);
        setDecks(decksData);

        if (user?.tier === 'plus') {
          try {
            const insightsData = await insightsApi.get();
            setInsights(insightsData);
          } catch {}
        }
      } catch (err) {
        console.error('Failed to load dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.tier]);

  useEffect(() => {
    const verifyPayment = async () => {
      if (checkoutSuccess && transactionId) {
        setProcessingPayment(true);
        try {
          await paddleApi.verifyTransaction(transactionId);
          await refresh();
        } catch (err) {
          console.error('Payment verification failed', err);
        } finally {
          setProcessingPayment(false);
        }
      }
    };
    verifyPayment();
  }, [checkoutSuccess, transactionId, refresh]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {processingPayment && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md mb-6 flex items-center">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Processing payment... please wait.
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Welcome back!</h1>
        <p className="text-gray-600 mt-1">Here&apos;s your study overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Streak</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.current_streak || 0}</p>
              </div>
              <Flame className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today&apos;s Due</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.today_due || 0}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tomorrow&apos;s Due</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.tomorrow_due || 0}</p>
              </div>
              <BookOpen className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Your Decks</p>
                <p className="text-2xl font-semibold text-gray-900">{decks.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {user?.tier === 'plus' && insights?.insights && insights.insights.length > 0 && (
        <Card className="mb-8 border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-purple-900">
              <AlertCircle className="h-5 w-5 mr-2" />
              Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {insights.insights.map((insight, idx) => (
                <li key={idx} className="text-sm text-purple-800">{insight}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Your Decks</h2>
        <Link href="/upload">
          <Button>Create New Deck</Button>
        </Link>
      </div>

      {decks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No decks yet. Create your first deck to get started!</p>
            <Link href="/upload">
              <Button>Upload PDF or Text</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {decks.map((deck) => (
            <Link key={deck.id} href={`/deck/${deck.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-gray-900">{deck.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cards</span>
                      <span className="font-medium text-gray-900">{deck.card_count}</span>
                    </div>
                    {deck.subject_tag && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subject</span>
                        <span className="font-medium text-gray-900">{deck.subject_tag}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mastery</span>
                      <span className="font-medium text-gray-900">{Math.round(deck.mastery_pct)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gray-900 h-2 rounded-full transition-all"
                        style={{ width: `${deck.mastery_pct}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    }>
    >
      <DashboardContent />
    </Suspense>
  );
}