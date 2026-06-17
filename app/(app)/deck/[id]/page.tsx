"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Deck, Card as CardType } from '@/app/_lib/types';
import { deckApi, cardApi } from '@/app/_lib/api';
import { Loader2, Trash2, Edit, Save, X, BookOpen } from 'lucide-react';

export default function DeckPage() {
  const params = useParams();
  const router = useRouter();
  const deckId = params.id as string;

  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [editFront, setEditFront] = useState('');
  const [editBack, setEditBack] = useState('');
  const [editTopic, setEditTopic] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    deckApi.get(deckId)
      .then(setDeck)
      .catch(() => router.push('/dashboard'))
      .finally(() => setLoading(false));
  }, [deckId, router]);

  const handleStartEdit = (card: CardType) => {
    setEditingCard(card.id);
    setEditFront(card.front);
    setEditBack(card.back);
    setEditTopic(card.topic_tag || '');
  };

  const handleSaveEdit = async () => {
    if (!editingCard) return;
    setSaving(true);
    try {
      const updated = await cardApi.update(editingCard, {
        front: editFront,
        back: editBack,
        topic_tag: editTopic || undefined,
      });
      setDeck((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          cards: prev.cards?.map((c) => (c.id === editingCard ? { ...c, ...updated } : c)),
        };
      });
      setEditingCard(null);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!confirm('Delete this card?')) return;
    try {
      await cardApi.delete(cardId);
      setDeck((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          card_count: prev.card_count - 1,
          cards: prev.cards?.filter((c) => c.id !== cardId),
        };
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  const handleDeleteDeck = async () => {
    if (!confirm('Delete this entire deck?')) return;
    try {
      await deckApi.delete(deckId);
      router.push('/dashboard');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Deck not found</p>
        <Link href="/dashboard">
          <Button className="mt-4">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{deck.name}</h1>
          {deck.subject_tag && <Badge className="mt-2">{deck.subject_tag}</Badge>}
        </div>
        <div className="flex gap-2">
          <Link href={`/review?deck_id=${deckId}`}>
            <Button>Start Review</Button>
          </Link>
          <Button variant="destructive" size="icon" onClick={handleDeleteDeck}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-semibold text-gray-900">{deck.card_count}</p>
            <p className="text-sm text-gray-600">Cards</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-semibold text-gray-900">{Math.round(deck.mastery_pct)}%</p>
            <p className="text-sm text-gray-600">Mastery</p>
          </CardContent>
        </Card>
      </div>

      {deck.cards && deck.cards.length > 0 ? (
        <div className="space-y-4">
          {deck.cards.map((card) => (
            <Card key={card.id}>
              <CardContent className="pt-4">
                {editingCard === card.id ? (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">Front</Label>
                      <Input value={editFront} onChange={(e) => setEditFront(e.target.value)} />
                    </div>
                    <div>
                      <Label className="text-xs">Back</Label>
                      <Input value={editBack} onChange={(e) => setEditBack(e.target.value)} />
                    </div>
                    <div>
                      <Label className="text-xs">Topic</Label>
                      <Input value={editTopic} onChange={(e) => setEditTopic(e.target.value)} />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveEdit} disabled={saving}>
                        <Save className="h-4 w-4 mr-1" /> Save
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingCard(null)}>
                        <X className="h-4 w-4 mr-1" /> Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div>
                        <span className="text-xs text-gray-500">Q: </span>
                        <span className="text-gray-900">{card.front}</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">A: </span>
                        <span className="text-gray-700">{card.back}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {card.topic_tag && <Badge variant="outline">{card.topic_tag}</Badge>}
                        <Badge variant="secondary">
                          {Math.round(card.confidence_score)}% conf
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => handleStartEdit(card)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDeleteCard(card.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No cards in this deck</p>
            <Link href="/upload">
              <Button className="mt-4">Add Cards</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}