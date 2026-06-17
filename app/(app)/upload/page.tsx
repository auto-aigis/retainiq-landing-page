"use client";
export const dynamic = "force-dynamic";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CardPreview, CardInput } from '@/app/_lib/types';
import { uploadApi, deckApi, authApi } from '@/app/_lib/api';
import { useAuth } from '@/app/_components/AuthProvider';
import { Loader2, FileText, Trash2, Edit, Check, X } from 'lucide-react';

type UploadStatus = 'idle' | 'uploading' | 'processing' | 'preview' | 'saving' | 'error';

export default function UploadPage() {
  const router = useRouter();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState<UploadStatus>('idle');
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [deckName, setDeckName] = useState('');
  const [subjectTag, setSubjectTag] = useState('');
  const [textContent, setTextContent] = useState('');
  const [previewCards, setPreviewCards] = useState<CardPreview[]>([]);
  const [editedCards, setEditedCards] = useState<Map<string, CardPreview>>(new Map());
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');
  const [subscription, setSubscription] = useState<{ pdf_limit: number; card_limit: number } | null>(null);

  useState(() => {
    authApi.subscription().then(setSubscription).catch(() => {});
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a PDF file');
      return;
    }

    setError('');
    setStatus('uploading');
    setDeckName(file.name.replace(/\.pdf$/i, ''));

    try {
      const formData = new FormData();
      formData.append('file', file);
      const result = await uploadApi.upload(formData);
      setUploadId(result.id);
      setStatus('processing');
      pollForPreview(result.id);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Upload failed');
    }
  };

  const handleTextSubmit = async () => {
    if (!textContent.trim()) {
      setError('Please enter some text content');
      return;
    }

    setError('');
    setStatus('uploading');
    setDeckName(`Text Deck ${new Date().toLocaleDateString()}`);

    try {
      const formData = new FormData();
      formData.append('text_content', textContent);
      const result = await uploadApi.upload(formData);
      setUploadId(result.id);
      setStatus('processing');
      pollForPreview(result.id);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Processing failed');
    }
  };

  const pollForPreview = async (id: string) => {
    const maxAttempts = 30;
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const data = await uploadApi.getPreview(id);
        if (data.cards && data.cards.length > 0) {
          setPreviewCards(data.cards);
          setSelectedCards(new Set(data.cards.map((_, i) => `card-${i}`)));
          setStatus('preview');
          return;
        }
      } catch {}
      await new Promise(r => setTimeout(r, 2000));
      attempts++;
    }

    setStatus('error');
    setError('Processing timed out. Please try again.');
  };

  const toggleCard = (idx: number) => {
    const key = `card-${idx}`;
    const newSelected = new Set(selectedCards);
    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }
    setSelectedCards(newSelected);
  };

  const updateCard = (idx: number, field: keyof CardPreview, value: string) => {
    const card = previewCards[idx];
    const key = `card-${idx}`;
    const updated = new Map(editedCards);
    updated.set(key, { ...card, [field]: value });
    setEditedCards(updated);
  };

  const getCard = (idx: number): CardPreview => {
    const key = `card-${idx}`;
    return editedCards.get(key) || previewCards[idx];
  };

  const handleSaveDeck = async () => {
    if (!deckName.trim()) {
      setError('Please enter a deck name');
      return;
    }

    const cards: CardInput[] = previewCards
      .filter((_, idx) => selectedCards.has(`card-${idx}`))
      .map((card, idx) => ({
        front: getCard(idx).front,
        back: getCard(idx).back,
        source_reference: getCard(idx).source_reference,
        confidence_score: getCard(idx).confidence_score,
        topic_tag: getCard(idx).topic_tag,
      }));

    if (cards.length === 0) {
      setError('Please select at least one card');
      return;
    }

    setStatus('saving');
    try {
      await deckApi.create(
        deckName,
        subjectTag || undefined,
        cards,
        uploadId || undefined
      );
      router.push('/dashboard');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to save deck');
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Create New Deck</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      <Tabs defaultValue="pdf" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pdf">Upload PDF</TabsTrigger>
          <TabsTrigger value="text">Paste Text</TabsTrigger>
        </TabsList>

        <TabsContent value="pdf">
          <Card>
            <CardHeader>
              <CardTitle>Upload PDF</CardTitle>
              <CardDescription>Upload a PDF (up to 50 pages) to generate flashcards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={status === 'uploading' || status === 'processing'}
                />
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  {status === 'uploading' || status === 'processing'
                    ? 'Processing your PDF...'
                    : 'Drag and drop your PDF here, or click to browse'}
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={status === 'uploading' || status === 'processing'}
                >
                  {status === 'uploading' || status === 'processing' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Select PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="text">
          <Card>
            <CardHeader>
              <CardTitle>Paste Text</CardTitle>
              <CardDescription>Paste your notes or study material to generate flashcards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your study material here..."
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                className="min-h-[200px]"
                disabled={status === 'uploading' || status === 'processing'}
              />
              <Button
                onClick={handleTextSubmit}
                disabled={status === 'uploading' || status === 'processing'}
              >
                {status === 'uploading' || status === 'processing' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Generate Cards
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {status === 'processing' && (
        <Card className="mt-6">
          <CardContent className="py-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-900 mx-auto mb-4" />
            <p className="text-gray-700">Extracting concepts from your content...</p>
            <p className="text-gray-500 text-sm mt-2">This may take a minute</p>
          </CardContent>
        </Card>
      )}

      {status === 'preview' && (
        <div className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Name Your Deck</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deckName">Deck Name</Label>
                  <Input
                    id="deckName"
                    value={deckName}
                    onChange={(e) => setDeckName(e.target.value)}
                    placeholder="My Study Deck"
                  />
                </div>
                <div>
                  <Label htmlFor="subjectTag">Subject Tag (optional)</Label>
                  <Input
                    id="subjectTag"
                    value={subjectTag}
                    onChange={(e) => setSubjectTag(e.target.value)}
                    placeholder="e.g., Algorithms, History"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Preview Cards ({selectedCards.size} selected)
            </h2>
            <Button onClick={handleSaveDeck} disabled={status === 'saving'}>
              {status === 'saving' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Deck
            </Button>
          </div>

          <div className="space-y-4">
            {previewCards.map((card, idx) => {
              const isSelected = selectedCards.has(`card-${idx}`);
              const displayCard = getCard(idx);
              return (
                <Card key={idx} className={isSelected ? 'border-gray-900' : 'opacity-60'}>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleCard(idx)}
                        className="mt-1 h-4 w-4"
                      />
                      <div className="flex-1 space-y-3">
                        <div>
                          <Label className="text-xs text-gray-500">Front (Question)</Label>
                          <Input
                            value={displayCard.front}
                            onChange={(e) => updateCard(idx, 'front', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Back (Answer)</Label>
                          <Input
                            value={displayCard.back}
                            onChange={(e) => updateCard(idx, 'back', e.target.value)}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{displayCard.topic_tag || 'General'}</Badge>
                          <Badge variant="secondary">
                            {Math.round(displayCard.confidence_score)}% confidence
                          </Badge>
                          <span className="text-xs text-gray-500">{displayCard.source_reference}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}