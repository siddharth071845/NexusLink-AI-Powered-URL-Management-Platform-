import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Monitor, Smartphone, Tablet, Globe, BarChart2, Sparkles } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import api from '../services/api';

const COLORS = ['#3b82f6', '#8b5cf6', '#f43f5e', '#10b981'];

export default function AnalyticsPage() {
    const { shortCode } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [insights, setInsights] = useState<string | null>(null);
    const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get(`/analytics/${shortCode}`);
                setData(res.data);

                // Fetch AI Insights in background
                setIsGeneratingInsights(true);
                try {
                    const insightsRes = await api.get(`/analytics/${shortCode}/insights`);
                    setInsights(insightsRes.data);
                } catch (e) {
                    console.error("Failed to load insights", e);
                } finally {
                    setIsGeneratingInsights(false);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        if (shortCode) fetchAnalytics();
    }, [shortCode]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-6">
                <h2 className="text-2xl font-bold mb-4">No data found</h2>
                <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
            </div>
        );
    }

    // Format Recharts data
    const clicksData = Object.entries(data.clicksByDay || {}).map(([date, count]) => ({ date, count }));
    const deviceData = Object.entries(data.deviceDistribution || {}).map(([name, value]) => ({ name, value }));
    const countryData = Object.entries(data.countryDistribution || {}).map(([name, value]) => ({ name, value }));

    return (
        <div className="min-h-screen bg-background p-6 font-sans text-text relative overflow-x-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-1/4 w-[40%] h-[40%] rounded-full bg-primary/10 blur-[150px] mix-blend-screen" />
            </div>

            <div className="max-w-7xl mx-auto space-y-8 relative z-10">

                <header className="flex items-center gap-4 bg-surface/30 backdrop-blur-md border border-white/5 shadow-sm p-4 rounded-2xl">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="p-2 h-auto">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Analytics Overview</h1>
                        <p className="text-muted">Statistics for <span className="text-primary font-medium">{shortCode}</span></p>
                    </div>
                </header>

                {/* Top KPIs */}
                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                        <h3 className="text-muted font-medium mb-1">Total Clicks</h3>
                        <div className="text-4xl font-bold text-white">{data.totalClicks}</div>
                    </Card>
                    <Card className="bg-gradient-to-br from-secondary/10 to-transparent border-secondary/20">
                        <h3 className="text-muted font-medium mb-1">Unique Devices</h3>
                        <div className="text-4xl font-bold text-white">{deviceData.length}</div>
                    </Card>
                    <Card className="bg-gradient-to-br from-accent/10 to-transparent border-accent/20">
                        <h3 className="text-muted font-medium mb-1">Top Country</h3>
                        <div className="text-4xl font-bold text-white">
                            {countryData.length > 0 ? countryData.sort((a: any, b: any) => b.value - a.value)[0].name : 'N/A'}
                        </div>
                    </Card>
                </div>

                {/* AI Insights Panel */}
                <Card className="bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 border-primary/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary to-accent" />
                    <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-accent" />
                        AI Performance Insights
                    </h3>
                    <div className="text-muted/90 leading-relaxed min-h-[60px] flex items-center">
                        {isGeneratingInsights ? (
                            <div className="flex items-center gap-2 text-primary">
                                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                Analyzing your link performance...
                            </div>
                        ) : insights ? (
                            <p>{insights}</p>
                        ) : (
                            <p className="italic text-muted/50">Cannot generate insights yet. Share your link to gather data!</p>
                        )}
                    </div>
                </Card>

                {/* Charts Grid */}
                <div className="grid lg:grid-cols-2 gap-6">

                    <Card className="col-span-1 lg:col-span-2">
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <BarChart2 className="w-5 h-5 text-primary" />
                            Traffic over time
                        </h3>
                        <div className="h-72 w-full">
                            {clicksData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={clicksData}>
                                        <defs>
                                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="date" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#ffffff20', borderRadius: '8px' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-muted">No traffic data yet</div>
                            )}
                        </div>
                    </Card>

                    <Card>
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <Monitor className="w-5 h-5 text-secondary" />
                            Device Distribution
                        </h3>
                        <div className="h-64 flex items-center justify-center">
                            {deviceData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={deviceData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                            {deviceData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#ffffff20', borderRadius: '8px' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-muted">No device data yet</div>
                            )}
                        </div>
                        {/* Legend */}
                        <div className="flex flex-wrap gap-4 mt-6 justify-center">
                            {deviceData.map((entry, index) => (
                                <div key={entry.name} className="flex items-center gap-2 text-sm">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    {entry.name} ({String(entry.value)})
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card>
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-accent" />
                            Geographic Traffic
                        </h3>
                        <div className="space-y-4">
                            {countryData.length > 0 ? countryData.map((country: any, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
                                    <span className="font-medium text-white">{country.name}</span>
                                    <span className="text-muted">{String(country.value)} clicks</span>
                                </div>
                            )) : (
                                <div className="flex items-center justify-center text-muted py-12">No location data yet</div>
                            )}
                        </div>
                    </Card>

                </div>
            </div>
        </div>
    );
}
