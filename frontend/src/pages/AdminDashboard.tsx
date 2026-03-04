import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Users, Activity, LogOut, ShieldAlert, Navigation, Settings, Search, Trash2, Ban, CheckCircle, Plus, Eye, BarChart3, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import api from '../services/api';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'urls' | 'blacklist'>('dashboard');
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [urls, setUrls] = useState<any[]>([]);
    const [blacklist, setBlacklist] = useState<any[]>([]);

    // Add Blacklist Form State
    const [newDomain, setNewDomain] = useState('');

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const username = localStorage.getItem('username');

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setIsLoading(true);
        setError('');
        try {
            if (activeTab === 'dashboard') {
                const { data } = await api.get('/admin/stats');
                setStats(data);
            } else if (activeTab === 'users') {
                const { data } = await api.get('/admin/users');
                setUsers(data);
            } else if (activeTab === 'urls') {
                const { data } = await api.get('/admin/urls');
                setUrls(data);
            } else if (activeTab === 'blacklist') {
                const { data } = await api.get('/admin/blacklist');
                setBlacklist(data);
            }
        } catch (err: any) {
            setError(err.response?.data || 'Failed to fetch admin data or Invalid Permissions');
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        navigate('/auth');
    };

    // --- Action Handlers ---
    const suspendUser = async (id: number) => {
        await api.post(`/admin/users/${id}/suspend`);
        loadData();
    };

    const deleteUser = async (id: number) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        await api.delete(`/admin/users/${id}`);
        loadData();
    };

    const setLimit = async (id: number) => {
        const limitStr = prompt('Enter new daily limit for this user:');
        if (!limitStr) return;
        const limit = parseInt(limitStr);
        if (isNaN(limit) || limit < 0) return alert("Invalid number.");
        await api.post(`/admin/users/${id}/limit?limit=${limit}`);
        loadData();
    };

    const toggleUrl = async (id: number) => {
        await api.post(`/admin/urls/${id}/toggle`);
        loadData();
    };

    const deleteUrl = async (id: number) => {
        if (!confirm('Are you sure you want to delete this URL?')) return;
        await api.delete(`/admin/urls/${id}`);
        loadData();
    };

    const addBlacklist = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDomain) return;
        try {
            await api.post(`/admin/blacklist?domain=${encodeURIComponent(newDomain)}`);
            setNewDomain('');
            loadData();
        } catch (err: any) {
            alert(err.response?.data?.message || err.response?.data || 'Failed to add domain');
        }
    };

    const removeBlacklist = async (id: number) => {
        await api.delete(`/admin/blacklist/${id}`);
        loadData();
    };

    if (error) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <ShieldAlert className="w-16 h-16 text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
                <p className="text-muted mb-8 max-w-md">{error}</p>
                <Button onClick={() => navigate('/dashboard')} size="lg" className="w-full max-w-sm">Return to Safe Zone</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-text font-sans">
            {/* Minimalist Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-surface border-r border-white/5 p-6 flex flex-col z-20">
                <div className="flex items-center gap-3 mb-12">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/20">
                        <ShieldAlert className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <span className="text-xl font-bold text-white block">Shortnr Admin</span>
                        <span className="text-xs text-red-400 font-medium">Root Access</span>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    <SidebarItem icon={BarChart3} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                    <SidebarItem icon={Users} label="Users" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
                    <SidebarItem icon={Link2} label="Links" active={activeTab === 'urls'} onClick={() => setActiveTab('urls')} />
                    <SidebarItem icon={Ban} label="Blacklist" active={activeTab === 'blacklist'} onClick={() => setActiveTab('blacklist')} />
                </nav>

                <div className="pt-6 border-t border-white/5 space-y-2">
                    <SidebarItem icon={Navigation} label="User Portal" active={false} onClick={() => navigate('/dashboard')} />
                    <SidebarItem icon={LogOut} label="Log Out" active={false} onClick={logout} />
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="ml-64 p-8 lg:p-12 relative min-h-screen">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-red-500/5 blur-[120px] mix-blend-screen pointer-events-none" />

                <header className="mb-10 flex justify-between items-end relative z-10">
                    <div>
                        <h1 className="text-3xl font-bold text-white capitalize">{activeTab} Management</h1>
                        <p className="text-muted mt-1">Manage system usage, enforce abuse prevention, and analyze traffic.</p>
                    </div>
                    {isLoading && <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />}
                </header>

                <div className="relative z-10">
                    {activeTab === 'dashboard' && stats && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="text-blue-500" bg="bg-blue-500/10" />
                                <StatCard title="Total Links" value={stats.totalUrls} icon={Link2} color="text-emerald-500" bg="bg-emerald-500/10" />
                                <StatCard title="Total Clicks" value={stats.totalClicks} icon={Activity} color="text-purple-500" bg="bg-purple-500/10" />
                            </div>

                            <div className="grid lg:grid-cols-2 gap-8">
                                <Card>
                                    <h3 className="text-lg font-semibold text-white mb-6">Recent Signups</h3>
                                    <div className="space-y-4">
                                        {stats.recentUsers.map((u: any) => (
                                            <div key={u.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                                <div>
                                                    <p className="font-medium text-white">{u.username}</p>
                                                    <p className="text-sm text-muted">{u.email}</p>
                                                </div>
                                                <span className="text-xs text-muted">
                                                    {new Date(u.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                                <Card>
                                    <h3 className="text-lg font-semibold text-white mb-6">Top Performing Links</h3>
                                    <div className="space-y-4">
                                        {stats.topLinks.map((tl: any) => (
                                            <div key={tl.shortUrl.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                                <div className="overflow-hidden mr-4">
                                                    <p className="font-medium text-white truncate">/{tl.shortUrl.shortCode}</p>
                                                    <p className="text-xs text-muted truncate">{tl.shortUrl.originalUrl}</p>
                                                </div>
                                                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                                                    {tl.clicks} clicks
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <Card className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-muted text-sm tracking-wider">
                                        <th className="p-4 font-medium">Username</th>
                                        <th className="p-4 font-medium">Limits</th>
                                        <th className="p-4 font-medium">Status</th>
                                        <th className="p-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors last:border-0">
                                            <td className="p-4">
                                                <div className="font-medium text-white">{u.username}</div>
                                                <div className="text-sm text-muted">{u.email}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className="px-2 py-1 rounded-md text-xs bg-white/10 text-white font-mono">{u.dailyLimit} / day</span>
                                            </td>
                                            <td className="p-4">
                                                {u.suspended ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs bg-red-500/20 text-red-500 font-medium">
                                                        <Ban className="w-3 h-3" /> Suspended
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs bg-emerald-500/20 text-emerald-500 font-medium">
                                                        <CheckCircle className="w-3 h-3" /> Active
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 flex gap-2 justify-end">
                                                {u.role !== 'ROLE_ADMIN' && (
                                                    <>
                                                        <Button variant="outline" size="sm" className="h-8 px-3 text-xs" onClick={() => setLimit(u.id)}>Adjust Limit</Button>
                                                        <Button variant={u.suspended ? "primary" : "ghost"} size="sm" className="h-8 px-3 text-xs w-24" onClick={() => suspendUser(u.id)}>
                                                            {u.suspended ? 'Unsuspend' : 'Suspend'}
                                                        </Button>
                                                        <Button variant="ghost" size="sm" className="h-8 px-3 text-red-500 hover:text-red-400 hover:bg-red-500/10" onClick={() => deleteUser(u.id)}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Card>
                    )}

                    {activeTab === 'urls' && (
                        <Card className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-muted text-sm tracking-wider">
                                        <th className="p-4 font-medium">Short Code</th>
                                        <th className="p-4 font-medium">Destination</th>
                                        <th className="p-4 font-medium">Status</th>
                                        <th className="p-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {urls.map(url => (
                                        <tr key={url.id} className={`border-b border-white/5 transition-colors last:border-0 ${!url.active ? 'bg-red-500/5 hover:bg-red-500/10' : 'hover:bg-white/[0.02]'}`}>
                                            <td className="p-4 font-mono font-medium text-white">/{url.shortCode}</td>
                                            <td className="p-4 max-w-xs truncate text-muted text-sm" title={url.originalUrl}>
                                                {url.originalUrl}
                                            </td>
                                            <td className="p-4">
                                                {!url.active ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs bg-red-500/20 text-red-500 font-medium">
                                                        Disabled
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs bg-emerald-500/20 text-emerald-500 font-medium">
                                                        Active
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 flex gap-2 justify-end">
                                                <Button variant={!url.active ? "primary" : "ghost"} size="sm" className="h-8 px-3 text-xs w-20" onClick={() => toggleUrl(url.id)}>
                                                    {!url.active ? 'Enable' : 'Disable'}
                                                </Button>
                                                <Button variant="ghost" size="sm" className="h-8 px-3 text-red-500 hover:text-red-400 hover:bg-red-500/10" onClick={() => deleteUrl(url.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Card>
                    )}

                    {activeTab === 'blacklist' && (
                        <div className="space-y-8">
                            <Card className="max-w-xl">
                                <h3 className="text-lg font-semibold text-white mb-2">Block a Domain</h3>
                                <p className="text-sm text-muted mb-6">Prevent users from shortening URLs pointing to this domain. E.g., <code className="bg-white/10 px-1 rounded">malware.com</code></p>
                                <form onSubmit={addBlacklist} className="flex gap-3">
                                    <Input
                                        className="flex-1"
                                        placeholder="Enter domain name..."
                                        value={newDomain}
                                        onChange={(e) => setNewDomain(e.target.value)}
                                        required
                                    />
                                    <Button type="submit" className="shrink-0 gap-2 px-6">
                                        <Ban className="w-4 h-4" /> Block
                                    </Button>
                                </form>
                            </Card>

                            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {blacklist.map(domain => (
                                    <div key={domain.id} className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 flex items-center justify-between group">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                                            <span className="font-medium text-white truncate">{domain.domain}</span>
                                        </div>
                                        <button
                                            onClick={() => removeBlacklist(domain.id)}
                                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                                            title="Remove from blacklist"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

// Helper Components
function SidebarItem({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${active
                ? 'bg-red-500/10 text-red-500'
                : 'text-muted hover:text-white hover:bg-white/5'
                }`}
        >
            <Icon className="w-5 h-5" />
            {label}
        </button>
    );
}

function StatCard({ title, value, icon: Icon, color, bg }: { title: string, value: string | number, icon: any, color: string, bg: string }) {
    return (
        <Card className={`flex items-center gap-5 p-6 border-l-4 ${color}`} style={{ borderLeftColor: 'currentColor' }}>
            <div className={`w-14 h-14 rounded-full ${bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-7 h-7 ${color}`} />
            </div>
            <div>
                <p className="text-muted font-medium mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
            </div>
        </Card>
    );
}
