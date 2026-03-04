import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link2, Copy, BarChart2, LogOut, Plus, CheckCircle2, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import api from '../services/api';

export default function DashboardPage() {
    const [urls, setUrls] = useState<any[]>([]);
    const [newUrl, setNewUrl] = useState('');
    const [customAlias, setCustomAlias] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [qrCodeId, setQrCodeId] = useState<string | null>(null);

    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    // Fetch URLs on load
    useEffect(() => {
        const fetchUrls = async () => {
            try {
                const { data } = await api.get('/urls/my-links');
                setUrls(data);
            } catch (err) {
                console.error("Failed to fetch links", err);
            } finally {
                setIsFetching(false);
            }
        };
        fetchUrls();
    }, []);

    const handleShorten = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUrl) return;
        setIsLoading(true);
        try {
            const { data } = await api.post('/urls/shorten', {
                originalUrl: newUrl,
                customAlias: customAlias || undefined
            });
            // Add the new URL to the beginning of the list
            setUrls((prev) => [data, ...prev]);
            setNewUrl('');
            setCustomAlias('');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to shorten URL');
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (shortCode: string) => {
        const fullUrl = `${import.meta.env.VITE_APP_BASE_URL || 'http://localhost:8080'}/${shortCode}`;
        navigator.clipboard.writeText(fullUrl);
        setCopiedId(shortCode);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/auth');
    };

    if (isFetching) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-6 font-sans text-text relative overflow-x-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[120px] mix-blend-screen" />
            </div>

            <nav className="max-w-7xl mx-auto flex items-center justify-between mb-12 relative z-10 p-4 rounded-2xl bg-surface/30 backdrop-blur-md border border-white/5 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <Link2 className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">Shortnr</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-muted hidden sm:inline-block">Welcome, {username}</span>
                    {localStorage.getItem('role') === 'ROLE_ADMIN' && (
                        <Button variant="ghost" size="sm" onClick={() => navigate('/admin')} className="gap-2 text-primary hover:text-primary hover:bg-primary/10">
                            Admin Dashboard
                        </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={logout} className="gap-2 text-accent hover:text-accent hover:bg-accent/10">
                        <LogOut className="w-4 h-4" />
                        Logout
                    </Button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto grid lg:grid-cols-[350px,1fr] gap-8 relative z-10">

                {/* Create Link Panel */}
                <div>
                    <Card className="sticky top-6">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-primary" />
                            Create New Link
                        </h2>
                        <form onSubmit={handleShorten} className="space-y-4">
                            <Input
                                label="Destination URL"
                                type="url"
                                placeholder="https://very-long-url.com/something"
                                value={newUrl}
                                onChange={(e) => setNewUrl(e.target.value)}
                                required
                            />
                            <Input
                                label="Custom Alias (Optional)"
                                type="text"
                                placeholder="my-campaign"
                                value={customAlias}
                                onChange={(e) => setCustomAlias(e.target.value)}
                            />
                            <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
                                Shorten Link
                            </Button>
                        </form>
                    </Card>
                </div>

                {/* Links List */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold mb-6 px-2">Your Links</h2>

                    {urls.length === 0 ? (
                        <Card className="text-center py-16 border-dashed border-2 border-white/10 bg-transparent">
                            <div className="w-16 h-16 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4">
                                <Link2 className="w-8 h-8 text-muted" />
                            </div>
                            <h3 className="text-lg font-medium text-white mb-2">No links created yet</h3>
                            <p className="text-muted max-w-sm mx-auto">Create a shortened URL from the left panel to begin tracking your links.</p>
                        </Card>
                    ) : (
                        urls.map((link, idx) => (
                            <motion.div
                                key={link.shortCode}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Card className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center group hover:bg-white/5 transition-colors">
                                    <div className="flex flex-col gap-4 w-full">
                                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                                                    <a href={`${import.meta.env.VITE_APP_BASE_URL || 'http://localhost:8080'}/${link.shortCode}`} target="_blank" rel="noreferrer" className="text-lg font-semibold text-primary hover:underline truncate">
                                                        {import.meta.env.VITE_APP_BASE_URL || 'http://localhost:8080'}/{link.shortCode}
                                                    </a>
                                                </div>
                                                <p className="text-muted text-sm truncate max-w-md" title={link.originalUrl}>
                                                    {link.originalUrl}
                                                </p>
                                                <p className="text-xs text-muted/60 mt-2">
                                                    Created: {new Date(link.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setQrCodeId(qrCodeId === link.shortCode ? null : link.shortCode)}
                                                    className="gap-2 text-muted hover:text-white"
                                                >
                                                    <QrCode className="w-4 h-4" />
                                                    QR
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => navigate(`/analytics/${link.shortCode}`)}
                                                    className="gap-2 bg-secondary/10 text-secondary hover:bg-secondary/20 border-secondary/20"
                                                >
                                                    <BarChart2 className="w-4 h-4" />
                                                    Stats
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => copyToClipboard(link.shortCode)}
                                                    className="gap-2"
                                                >
                                                    {copiedId === link.shortCode ? (
                                                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                                                    ) : (
                                                        <Copy className="w-4 h-4" />
                                                    )}
                                                    {copiedId === link.shortCode ? 'Copied' : 'Copy'}
                                                </Button>
                                            </div>
                                        </div>
                                        {qrCodeId === link.shortCode && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="flex justify-center p-4 bg-white/5 rounded-xl border border-white/10"
                                            >
                                                <QRCodeSVG value={`${import.meta.env.VITE_APP_BASE_URL || 'http://localhost:8080'}/${link.shortCode}`} size={150} level={"H"} className="bg-white p-2 rounded-lg" />
                                            </motion.div>
                                        )}
                                    </div>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </div>
            </main >
        </div >
    );
}
