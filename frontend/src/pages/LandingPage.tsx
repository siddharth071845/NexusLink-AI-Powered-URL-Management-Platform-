import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Copy, CheckCircle2, Zap, Shield, BarChart3, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import api from '../services/api';

export default function LandingPage() {
    const [url, setUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleShorten = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;
        setIsLoading(true);
        try {
            const { data } = await api.post('/urls/shorten', { originalUrl: url });
            setShortUrl(`${import.meta.env.VITE_APP_BASE_URL || 'http://localhost:8080'}/${data.shortCode}`);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shortUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const features = [
        {
            icon: <Zap className="w-5 h-5 text-primary" />,
            title: "Lightning Fast",
            description: "Redirects happen in under 50ms using advanced Redis caching architecture."
        },
        {
            icon: <BarChart3 className="w-5 h-5 text-secondary" />,
            title: "Advanced Analytics",
            description: "Track clicks, devices, and geographic data with real-time interactive charts."
        },
        {
            icon: <Shield className="w-5 h-5 text-accent" />,
            title: "Secure & Reliable",
            description: "Enterprise-grade security with rate limiting and 99.9% uptime guarantee."
        }
    ];

    return (
        <div className="min-h-screen bg-background relative overflow-hidden font-sans text-text">

            {/* SaaS Background Elements */}
            <div className="absolute top-0 inset-x-0 h-screen overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] mix-blend-screen" />
                <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-secondary/10 blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[30%] rounded-full bg-accent/10 blur-[150px] mix-blend-screen" />
            </div>

            {/* Fixed Navbar */}
            <nav className="fixed top-0 inset-x-0 z-50 bg-background/70 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                            <Link2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-semibold tracking-tight text-white">Shortnr</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/auth" className="text-sm font-medium text-muted hover:text-white transition-colors">
                            Sign In
                        </Link>
                        <Link to="/auth">
                            <Button size="sm" className="hidden sm:flex">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 pt-32 pb-24 px-6 max-w-7xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
                        <Globe className="w-4 h-4" />
                        <span>Built for modern teams.</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white leading-[1.1]">
                        Shorten URLs.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">Expand Your Reach.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-12 leading-relaxed font-light">
                        Create short links, share them anywhere, and meticulously track every click with our premium URL infrastructure.
                    </p>

                    {/* Shortener Widget */}
                    <Card className="max-w-3xl mx-auto p-2 border-white/10 shadow-2xl backdrop-blur-2xl bg-surface/30">
                        <form onSubmit={handleShorten} className="flex flex-col sm:flex-row gap-2 relative">
                            <div className="flex-1 relative">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <Link2 className="w-5 h-5 text-muted" />
                                </div>
                                <input
                                    type="url"
                                    placeholder="Paste your long link here..."
                                    className="w-full h-14 pl-12 pr-4 bg-transparent border-none text-white placeholder:text-muted focus:outline-none focus:ring-0 text-lg"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" size="lg" className="h-14 sm:w-40 shrink-0 shadow-none border-none" isLoading={isLoading}>
                                Shorten Now
                            </Button>
                        </form>

                        <AnimatePresence>
                            {shortUrl && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, y: -10 }}
                                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden mt-2 border-t border-white/5"
                                >
                                    <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-primary/5 rounded-xl m-2 border border-primary/20">
                                        <a href={shortUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium text-lg truncate max-w-full">
                                            {shortUrl}
                                        </a>
                                        <Button variant="secondary" size="sm" onClick={copyToClipboard} className="shrink-0 gap-2 w-full sm:w-auto hover:bg-white/10">
                                            {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                            {copied ? 'Copied!' : 'Copy Link'}
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Card>
                </motion.div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-6 mt-32 max-w-5xl mx-auto text-left">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                        >
                            <Card hoverEffect className="h-full bg-surface/40 p-8">
                                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-inner">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                                <p className="text-muted leading-relaxed text-sm">{feature.description}</p>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </main>

        </div>
    );
}
