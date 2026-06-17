"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import {
  Brain,
  Upload,
  Zap,
  Target,
  Clock,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  badge?: string;
}

interface FAQ {
  question: string;
  answer: string;
}

export default function Page() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features: Feature[] = [
    {
      icon: <Upload className="h-6 w-6 text-indigo-600" />,
      title: "Upload Any Material",
      description:
        "PDFs, notes, textbooks, or paste text directly. Our NLP engine understands your content instantly.",
    },
    {
      icon: <Brain className="h-6 w-6 text-indigo-600" />,
      title: "AI-Generated Flashcards",
      description:
        "Automatically creates adaptive spaced-repetition flashcards tailored to your specific study material.",
    },
    {
      icon: <Target className="h-6 w-6 text-indigo-600" />,
      title: "Personalized Forgetting Curve",
      description:
        "Tracks your unique retention per topic and schedules reviews at the perfect moment before you forget.",
    },
    {
      icon: <Zap className="h-6 w-6 text-indigo-600" />,
      title: "Socratic Quiz Questions",
      description:
        "Deep-understanding questions that test comprehension, not just memorization. Think critically, retain longer.",
    },
    {
      icon: <Clock className="h-6 w-6 text-indigo-600" />,
      title: "10-Minute Daily Drills",
      description:
        "Bite-sized micro-review sessions that fit into any schedule. Consistent daily practice beats marathon sessions.",
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-indigo-600" />,
      title: "Retention Dashboard",
      description:
        "Visual retention scores per subject. See exactly what you know and what needs reinforcement.",
    },
  ];

  const steps: Step[] = [
    {
      number: "01",
      title: "Upload Your Notes",
      description:
        "Drop your PDFs, paste text, or upload handwritten notes. Supports GATE, GRE, UPSC, coding prep materials.",
      icon: <Upload className="h-8 w-8 text-white" />,
    },
    {
      number: "02",
      title: "AI Processes & Generates",
      description:
        "Our NLP engine extracts key concepts, creates flashcards, summaries, and Socratic questions automatically.",
      icon: <Sparkles className="h-8 w-8 text-white" />,
    },
    {
      number: "03",
      title: "Complete Daily Drills",
      description:
        "Get personalized 10-minute sessions based on your forgetting curve. Review what matters most, when it matters most.",
      icon: <BookOpen className="h-8 w-8 text-white" />,
    },
    {
      number: "04",
      title: "Track & Retain",
      description:
        "Watch your retention scores climb. The system adapts as you improve, always keeping you at peak recall.",
      icon: <BarChart3 className="h-8 w-8 text-white" />,
    },
  ];

  const pricingPlans: PricingPlan[] = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      description: "Perfect for trying out RetainIQ",
      features: [
        "Upload up to 3 documents",
        "50 AI-generated flashcards",
        "Basic retention tracking",
        "Daily drill sessions",
        "Browser-based access",
      ],
      highlighted: false,
    },
    {
      name: "Pro",
      price: "₹299",
      period: "per month",
      description: "For serious exam aspirants",
      features: [
        "Unlimited document uploads",
        "Unlimited flashcards & quizzes",
        "Advanced forgetting curve AI",
        "Detailed retention analytics",
        "Priority NLP processing",
        "Export flashcards",
        "Multi-subject dashboards",
      ],
      highlighted: true,
      badge: "Most Popular",
    },
    {
      name: "Annual",
      price: "₹2,499",
      period: "per year",
      description: "Best value — save 30%",
      features: [
        "Everything in Pro",
        "Early access to new features",
        "Collaborative study groups",
        "Custom review schedules",
        "Priority support",
        "Offline drill downloads",
        "API access",
      ],
      highlighted: false,
      badge: "Save 30%",
    },
  ];

  const faqs: FAQ[] = [
    {
      question: "How is RetainIQ different from Anki?",
      answer:
        "Anki requires you to manually create every flashcard, which takes hours. RetainIQ auto-generates flashcards, summaries, and quiz questions from your uploaded material using AI — saving you 90% of the setup time while delivering the same spaced-repetition benefits.",
    },
    {
      question: "What exam materials does it support?",
      answer:
        "RetainIQ works with any study material — GATE, GRE, UPSC, coding interviews, medical exams, or any subject. Upload PDFs, paste text, or share notes in any format. Our NLP engine adapts to technical, conceptual, and factual content.",
    },
    {
      question: "Do I need to install anything?",
      answer:
        "No! RetainIQ is completely browser-based. Access your drills from any device — laptop, tablet, or phone. No downloads, no installs, just log in and start reviewing.",
    },
    {
      question: "How does the personalized forgetting curve work?",
      answer:
        "Our AI tracks how quickly you forget each specific concept based on your quiz performance. It then schedules reviews at the optimal moment — just before you would forget — maximizing retention with minimum time investment.",
    },
    {
      question: "Can I use it for free?",
      answer:
        "Yes! The free plan lets you upload up to 3 documents and generates 50 flashcards. It includes daily drill sessions and basic retention tracking — enough to experience the full power of active recall.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Brain className="h-7 w-7 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">RetainIQ</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                How It Works
              </a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </a>
              <a href="#faq" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                FAQ
              </a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <a href="/login">
                <Button variant="ghost" className="text-sm">
                  Sign In
                </Button>
              </a>
              <a href="/register">
                <Button className="text-sm bg-indigo-600 hover:bg-indigo-700">
                  Get Started
                </Button>
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 px-4 py-4 space-y-3">
            <a href="#features" className="block text-sm text-gray-600 hover:text-gray-900 py-2">
              Features
            </a>
            <a href="#how-it-works" className="block text-sm text-gray-600 hover:text-gray-900 py-2">
              How It Works
            </a>
            <a href="#pricing" className="block text-sm text-gray-600 hover:text-gray-900 py-2">
              Pricing
            </a>
            <a href="#faq" className="block text-sm text-gray-600 hover:text-gray-900 py-2">
              FAQ
            </a>
            <Separator />
            <div className="flex flex-col gap-2 pt-2">
              <a href="/login">
                <Button variant="outline" className="w-full text-sm">
                  Sign In
                </Button>
              </a>
              <a href="/register">
                <Button className="w-full text-sm bg-indigo-600 hover:bg-indigo-700">
                  Get Started
                </Button>
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Powered by AI + Spaced Repetition Science
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight max-w-4xl mx-auto">
            Turn Your Notes Into{" "}
            <span className="text-indigo-600">Memory Drills</span>{" "}
            You Actually Remember
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Upload your GATE, GRE, UPSC, or any study material — RetainIQ auto-generates personalized
            spaced-repetition flashcards and daily micro-reviews. No manual card creation. No blind re-reading.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/register">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-base px-8 py-6">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <a href="#how-it-works">
              <Button size="lg" variant="outline" className="text-base px-8 py-6">
                See How It Works
              </Button>
            </a>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            No credit card required • Browser-based • Works on any device
          </p>

          {/* Hero Visual */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-8 sm:p-12">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="text-3xl font-bold text-indigo-600">94%</div>
                  <div className="text-sm text-gray-600 mt-1">Average Retention Rate</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="text-3xl font-bold text-indigo-600">10 min</div>
                  <div className="text-sm text-gray-600 mt-1">Daily Drill Time</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="text-3xl font-bold text-indigo-600">3x</div>
                  <div className="text-sm text-gray-600 mt-1">Faster Than Re-reading</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Everything You Need to Actually Remember
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Stop wasting hours making flashcards manually. Let AI handle the grunt work while you focus on learning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-gray-200 hover:border-indigo-200 transition-colors hover:shadow-md">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-indigo-50 flex items-center justify-center mb-3">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              From Notes to Mastery in 4 Steps
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Upload once, review daily. Our AI handles the science of memory so you can focus on understanding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-full bg-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
                    {step.icon}
                  </div>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">
                    Step {step.number}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+40px)] w-[calc(100%-80px)]">
                    <div className="border-t-2 border-dashed border-indigo-200 w-full"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Why RetainIQ?</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Stop Wasting Time on Ineffective Methods
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-red-200 bg-red-50/50">
              <CardHeader>
                <CardTitle className="text-red-700 text-lg">❌ Without RetainIQ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Hours spent manually creating Anki cards",
                  "Blindly re-reading notes (40% less effective)",
                  "No idea what you've forgotten",
                  "Generic AI chatbots with no retention loop",
                  "Cramming before exams with high stress",
                ].map((item, idx) => (
                  <p key={idx} className="text-sm text-red-700 flex items-start gap-2">
                    <X className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    {item}
                  </p>
                ))}
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50/50">
              <CardHeader>
                <CardTitle className="text-green-700 text-lg">✓ With RetainIQ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "AI generates cards from your material instantly",
                  "Active recall + spaced repetition (proven 3x better)",
                  "Retention dashboard shows exactly what needs review",
                  "Personalized forgetting curve per concept",
                  "Calm, consistent 10-min daily sessions",
                ].map((item, idx) => (
                  <p key={idx} className="text-sm text-green-700 flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    {item}
                  </p>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Pricing</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Simple, Affordable Plans
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Start free. Upgrade when you need unlimited power for your exam prep.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${
                  plan.highlighted
                    ? "border-indigo-600 border-2 shadow-xl shadow-indigo-100"
                    : "border-gray-200"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-indigo-600 text-white px-3 py-0.5">{plan.badge}</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 ml-1">/{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <a href="/register" className="w-full">
                    <Button
                      className={`w-full ${
                        plan.highlighted
                          ? "bg-indigo-600 hover:bg-indigo-700"
                          : ""
                      }`}
                      variant={plan.highlighted ? "default" : "outline"}
                    >
                      Get Started
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">FAQ</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-base font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-12 sm:p-16 shadow-2xl shadow-indigo-200">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Ready to Remember What You Learn?
            </h2>
            <p className="mt-4 text-lg text-indigo-100 max-w-2xl mx-auto">
              Join thousands of students who stopped re-reading and started retaining. Upload your first document
              and get AI-powered drills in under 2 minutes.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/register">
                <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50 text-base px-8 py-6 font-semibold">
                  Start Learning Smarter
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>
            <p className="mt-4 text-sm text-indigo-200">
              Free plan available • No credit card needed • Setup in 2 minutes
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-indigo-600" />
              <span className="text-lg font-bold text-gray-900">RetainIQ</span>
            </div>
            <p className="text-sm text-gray-500">
              AI-powered spaced repetition for serious learners.
            </p>
            <div className="flex items-center gap-6">
              <a href="/login" className="text-sm text-gray-600 hover:text-gray-900">
                Sign In
              </a>
              <a href="/register" className="text-sm text-gray-600 hover:text-gray-900">
                Get Started
              </a>
            </div>
          </div>
          <Separator className="my-8" />
          <p className="text-center text-sm text-gray-400">
            © 2024 RetainIQ. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}