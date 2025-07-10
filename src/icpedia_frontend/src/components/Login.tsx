import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, User, Lock, Mail } from 'lucide-react';

interface LoginProps {
    onLogin: (user: { email: string; name: string }) => void;
    onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate login/signup
        onLogin({ email: formData.email, name: formData.name || formData.email });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
            <Card className="w-full max-w-md mx-4 premium-card">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                        <LogIn className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-headings text-accent">
                        {isLogin ? 'Welcome Back' : 'Join ICPedia'}
                    </CardTitle>
                    <CardDescription className="text-subtle-text">
                        {isLogin ? 'Sign in to continue your learning journey' : 'Create an account to get started'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-accent flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Full Name
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="bg-shadow-blue border-border-color text-accent"
                                />
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-accent flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="bg-shadow-blue border-border-color text-accent"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-accent flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="bg-shadow-blue border-border-color text-accent"
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-hover-purple text-white py-2 rounded-lg glow-effect transition-all duration-300"
                        >
                            {isLogin ? 'Sign In' : 'Create Account'}
                        </Button>
                    </form>
                    <div className="text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-primary hover:text-hover-purple text-sm transition-colors"
                        >
                            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                        </button>
                    </div>
                    <div className="text-center">
                        <button
                            onClick={onClose}
                            className="text-subtle-text hover:text-accent text-sm transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
