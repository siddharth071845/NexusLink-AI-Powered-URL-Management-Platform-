import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, ArrowRight, User, Lock, Mail, ChevronLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import api from '../services/api';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                const { data } = await api.post('/auth/login', {
                    username: formData.username,
                    password: formData.password
                });
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username);
                localStorage.setItem('role', data.role);

                if (data.role === 'ROLE_ADMIN') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            } else {
                await api.post('/auth/register', formData);
                setIsLogin(true);
                setFormData({ username: '', email: '', password: '' });
                alert('Registration successful! Please login.');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row font-sans">

            {/* Left Panel: Branding & Illustration (Hidden on mobile) */}
            <div className="hidden md:flex flex-1 relative bg-surface items-center justify-center p-12 overflow-hidden border-r border-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />

                <div className="relative z-10 w-full max-w-lg">
                    <Link to="/" className="inline-flex items-center gap-2 mb-12 text-muted hover:text-white transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                        Back to home
                    </Link>

                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-8 shadow-xl shadow-primary/20">
                        <Link2 className="w-8 h-8 text-white" />
                    </div>

                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                        The infrastructure for your links.
                    </h1>
                    <p className="text-lg text-muted font-light leading-relaxed">
                        Join thousands of teams scaling their reach with Shortnr. Lightning fast redirects, secure access, and powerful analytics.
                    </p>

                    {/* Abstract SaaS Decoration */}
                    <div className="mt-16 w-full h-64 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm self-end relative overflow-hidden flex items-center justify-center shadow-2xl">
                        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent top-1/2" />
                        <div className="absolute w-px h-full bg-gradient-to-b from-transparent via-secondary/50 to-transparent left-1/2" />
                        <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center bg-background/50 backdrop-blur-md shadow-2xl">
                            <BarChart3 className="w-10 h-10 text-primary opacity-80" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel: Form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative bg-background">
                <div className="absolute top-6 left-6 md:hidden">
                    <Link to="/" className="inline-flex items-center gap-2 text-muted hover:text-white transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                        Home
                    </Link>
                </div>

                <motion.div
                    className="w-full max-w-md"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="mb-10 text-center md:text-left">
                        <h2 className="text-3xl font-bold text-white mb-2">
                            {isLogin ? 'Welcome back' : 'Create an account'}
                        </h2>
                        <p className="text-muted">
                            {isLogin ? 'Enter your details to sign in to your workspace.' : 'Start shortening URLs with premium tools.'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <AnimatePresence mode="popLayout">
                            {!isLogin && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, y: -20 }}
                                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                                    exit={{ opacity: 0, height: 0, y: -20 }}
                                >
                                    <Input
                                        label="Email address"
                                        type="email"
                                        required
                                        placeholder="name@company.com"
                                        leftIcon={<Mail className="w-5 h-5" />}
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <Input
                            label="Username"
                            type="text"
                            required
                            placeholder="Your username"
                            leftIcon={<User className="w-5 h-5" />}
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />

                        <Input
                            label="Password"
                            type={isLogin ? "password" : "text"}
                            required
                            placeholder="••••••••"
                            leftIcon={<Lock className="w-5 h-5" />}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full h-12 text-base mt-4" isLoading={loading}>
                            {isLogin ? 'Sign In' : 'Create Account'}
                            {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
                        </Button>

                        {isLogin && (
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, username: 'admin', password: 'admin123' })}
                                className="w-full h-10 mt-2 text-sm text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors font-medium border border-primary/20"
                            >
                                Fill Admin Demo Credentials
                            </button>
                        )}
                    </form>

                    <p className="mt-8 text-center text-sm text-muted">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                            }}
                            className="font-medium text-white hover:text-primary transition-colors hover:underline"
                        >
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </button>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

// Local mock icon for the abstract decoration since we shouldn't import it at the top to avoid clutter if unused.
function BarChart3(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 3v18h18" />
            <path d="M18 17V9" />
            <path d="M13 17V5" />
            <path d="M8 17v-3" />
        </svg>
    )
}
