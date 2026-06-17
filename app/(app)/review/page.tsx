"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ReviewQueue, Rating, Card as CardType } from '@/app/_lib/types';
import { reviewApi, deckApi } from '@/app/_lib/api';
import {
  Loader2,
  RotateCcw,
  ThumbsUp,
  Zap,
  CheckCircle,
  Gauge,
  MoreHorizontal,
} from 'lucide-react';

const ratingConfig: { rating: Rating; label: string; color: string; icon: typeof ThumbsUp }[] = [
  { rating: 'again', label: 'Again', color: 'bg-red-500 hover:bg-red-600', icon: RotateCcw },
  { rating: 'hard', label: 'Hard', color: 'bg-orange-500 hover:bg-orange-600', icon: MoreHorizontal },
  { rating: 'good', label: 'Good', color: 'bg-green-500 hover:bg-green-600', icon: CheckCircle },
  { rating: 'easy', label: 'Easy', color: 'bg-blue-500 hover:bg-blue-600', icon: Zap },
];

function ReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deckId = searchParams.get('deck_id');

  const [queue, setQueue] = useState<ReviewQueue | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(600);
  const [reviewed, setReviewed] = useState(0);
  const [newCards, setNewCards] = useState(0);
  const [summary, setSummary] = useState<{ cards_reviewed: number; new_cards: number; retention_delta: number } | null>(null);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const startSession = async () => {
      try {
        const q = await reviewApi.getQueue();
        setQueue(q);
        if (deckId) {
          const session = await reviewApi.startSession(deckId);
          setSessionId(session.session_id);
        } else {
          const session = await reviewApi.startSession();
          setSessionId(session.session_id);
        }
      } catch (err) {
        console.error('Failed to start session', err);
      } finally {
        setLoading(false);
      }
    };
    startSession();
  }, [deckId]);

  useEffect(() => {
    if (timeLeft <= 0 || !queue || currentIndex >= queue.cards.length) {
      handleEndSession();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, queue, currentIndex]);

  const handleEndSession = async () => {
    if (!sessionId) return;
    try {
      const result = await reviewApi.endSession(sessionId, reviewed, newCards);
      setSummary(result);
    } catch (err) {
      console.error('Failed to end session', err);
    }
  };

  const handleRate = async (rating: Rating) => {
    if (!queue || currentIndex >= queue.cards.length) return;
    const card = queue.cards[currentIndex];

    try {
      await reviewApi.rate(card.id, rating);
      setReviewed((r) => r + 1);
      if (card.repetitions === 0) {
        setNewCards((n) => n + 1);
      }
    } catch (err) {
      console.error('Failed to rate card', err);
    }

    setFlipped(false);
    setCurrentIndex((i) => i + 1);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (summary) {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">Session Complete!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-semibold text-gray-900">{summary.cards_reviewed}</p>
                <p className="text-sm text-gray-600">Cards Reviewed</p>
              </div>
              <div>
                <p className="text-3xl font-semibold text-gray-900">{summary.new_cards}</p>
                <p className="text-sm text-gray-600">New Cards</p>
              </div>
              <div>
                <p className="text-3xl font-semibold text-gray-900">
                  {summary.retention_delta >= 0 ? '+' : ''}{Math.round(summary.retention_delta)}%
                </p>
                <p className="text-sm text-gray-600">Retention Change</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Link href="/dashboard" className="flex-1">
                <Button className="w-full">Back to Dashboard</Button>
              </Link>
              <Button variant="outline" onClick={() => router.reload()} className="flex-1">
                Review More
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!queue || queue.cards.length === 0) {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-2xl mx-auto text-center">
        <Card>
          <CardContent className="py-12">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-xl text-gray-900 mb-2">All caught up!</p>
            <p className="text-gray-600 mb-6">No more cards to review right now.</p>
            <Link href="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentCard = queue.cards[currentIndex];
  const progress = ((currentIndex) / queue.cards.length) * 100;

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <span className="text-lg font-medium text-gray-900">
            {currentIndex + 1} / {queue.cards.length}
          </span>
          <span className="text-lg font-medium text-gray-900">
            {formatTime(timeLeft)}
          </span>
        </div>
        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gray-900 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <Card className="min-h-[300px] flex flex-col">
        <CardContent className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="text-center space-y-4 w-full">
            <p className="text-lg text-gray-900 font-medium">
              {flipped ? currentCard.back : currentCard.front}
            </p>
            {flipped && (
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs text-gray-500">
                  {currentCard.topic_tag && `Topic: ${currentCard.topic_tag}`}
{flipped && (
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs text-gray-500">
                  {currentCard.topic_tag && `Topic: ${currentCard.topic_tag}`}
                </span>
              </div>
            )}
          </div>
          {!flipped ? (
            <div className="p-4 border-t">
              <Button onClick={() => setFlipped(true)} className="w-full">
                Show Answer
              </Button>
            </div>
          ) : (
            <div className="p-4 border-t grid grid-cols-4 gap-2">
              {ratingConfig.map(({ rating, label, color, icon: Icon }) => (
                <Button
                  key={rating}
                  onClick={() => handleRate(rating)}
                  className={`${color} text-white`}
                >
                  <Icon className="h-4 w-4 mr-1" />
                  {label}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    }>
      <ReviewContent />
    </Suspense>
  );
}