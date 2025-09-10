import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
    Users, 
    Gift, 
    Target, 
    BarChart3, 
    Star, 
    Award, 
    TrendingUp,
    Shield,
    Zap,
    Heart,
    AlertCircle,
    LogOut,
    User,
    Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
}

interface HomeProps {
    error?: string;
}

export default function Home({ error }: HomeProps) {
    const { user } = useAuth();
    const handleLogout = () => {
        router.post('/logout', {}, {
            onSuccess: () => {
                // Force a page reload to ensure clean state
                window.location.reload();
            },
            onError: () => {
                // Force a page reload even on error to ensure clean state
                window.location.reload();
            }
        });
    };

    const features = [
        {
            icon: <Users className="h-8 w-8 text-blue-600" />,
            title: "Customer Engagement",
            description: "Build stronger relationships with your customers through personalized loyalty programs."
        },
        {
            icon: <Gift className="h-8 w-8 text-green-600" />,
            title: "Reward Management",
            description: "Create and manage rewards that keep your customers coming back for more."
        },
        {
            icon: <Target className="h-8 w-8 text-purple-600" />,
            title: "Campaign Analytics",
            description: "Track and analyze the performance of your loyalty campaigns in real-time."
        },
        {
            icon: <BarChart3 className="h-8 w-8 text-orange-600" />,
            title: "Data Insights",
            description: "Get valuable insights into customer behavior and preferences."
        }
    ];

    const stats = [
        { label: "Active Members", value: "10,000+", icon: <Users className="h-5 w-5" /> },
        { label: "Points Redeemed", value: "500K+", icon: <Gift className="h-5 w-5" /> },
        { label: "Campaigns Running", value: "25+", icon: <Target className="h-5 w-5" /> },
        { label: "Success Rate", value: "95%", icon: <TrendingUp className="h-5 w-5" /> }
    ];

    return (
        <>
            <Head title="Loyalty System - Home" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                    <Heart className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
                                </div>
                                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Loyalty System
                                </h1>
                            </div>
                            
                            {user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button 
                                            variant="ghost" 
                                            className="flex items-center gap-1 sm:gap-2 text-gray-700 hover:bg-gray-100 p-1 sm:p-2"
                                        >
                                            <User className="h-4 w-4" />
                                            <span className="text-xs sm:text-sm font-medium hidden sm:inline">
                                                {user.first_name} {user.last_name}
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <DropdownMenuLabel>
                                            {user.first_name} {user.last_name}
                                        </DropdownMenuLabel>
                                        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                                            {user.email}
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => router.visit('/admin/settings')}>
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Settings</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Logout</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Badge variant="secondary" className="flex items-center space-x-1">
                                    <Shield className="h-4 w-4" />
                                    <span>Secure Access</span>
                                </Badge>
                            )}
                        </div>
                    </div>
                </header>

                {/* Error Message */}
                {error && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    </div>
                )}

                {/* Hero Section */}
                <section className="py-12 sm:py-16 lg:py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="max-w-3xl mx-auto">
                            <Badge variant="outline" className="mb-4">
                                <Zap className="h-4 w-4 mr-1" />
                                <span className="hidden sm:inline">Powered by Advanced Analytics</span>
                                <span className="sm:hidden">Advanced Analytics</span>
                            </Badge>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                                Transform Your Customer
                                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Loyalty</span>
                            </h2>
                            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                                Create engaging loyalty programs that drive customer retention, increase sales, 
                                and build lasting relationships with your brand.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                    <Award className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                                    Get Started
                                </Button>
                                <Button size="lg" variant="outline">
                                    Learn More
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-12 sm:py-16 bg-white/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="flex justify-center mb-2 text-blue-600">
                                        {stat.icon}
                                    </div>
                                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                                    <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-12 sm:py-16 lg:py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12 sm:mb-16">
                            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                                Why Choose Our Loyalty System?
                            </h3>
                            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                                Our comprehensive platform provides everything you need to create, 
                                manage, and optimize customer loyalty programs.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                            {features.map((feature, index) => (
                                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex justify-center mb-4">
                                            {feature.icon}
                                        </div>
                                        <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-sm sm:text-base">
                                            {feature.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-blue-600 to-purple-600">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                            Ready to Boost Customer Loyalty?
                        </h3>
                        <p className="text-base sm:text-lg lg:text-xl text-blue-100 mb-6 sm:mb-8">
                            Join thousands of businesses already using our platform to increase customer retention and drive growth.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                            <Button size="lg" variant="secondary">
                                <Star className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                                Start Free Trial
                            </Button>
                            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                                Contact Sales
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-8 sm:py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                    <Heart className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
                                </div>
                                <span className="text-lg sm:text-xl font-bold">Loyalty System</span>
                            </div>
                            <p className="text-sm sm:text-base text-gray-400 mb-4">
                                Empowering businesses to build stronger customer relationships through innovative loyalty programs.
                            </p>
                            <div className="text-xs sm:text-sm text-gray-500">
                                © 2024 Loyalty System. All rights reserved.
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
