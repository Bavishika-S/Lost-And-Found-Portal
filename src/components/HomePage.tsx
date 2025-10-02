import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Search, FileText, PlusCircle, Users, Shield, Clock } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const features = [
    {
      icon: FileText,
      title: 'Report Lost Items',
      description: 'Quickly report items you\'ve lost with detailed descriptions and photos.'
    },
    {
      icon: PlusCircle,
      title: 'Report Found Items',
      description: 'Help others by reporting items you\'ve found in your area.'
    },
    {
      icon: Search,
      title: 'Smart Matching',
      description: 'Our system automatically matches lost and found items to reunite owners.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Connect with helpful community members to recover your belongings.'
    }
  ];

  const steps = [
    {
      icon: FileText,
      title: 'Report',
      description: 'Report your lost or found item with details'
    },
    {
      icon: Search,
      title: 'Search',
      description: 'Browse and search through reported items'
    },
    {
      icon: Users,
      title: 'Connect',
      description: 'Get matched with potential owners or finders'
    },
    {
      icon: Shield,
      title: 'Verify',
      description: 'Safely verify ownership and arrange return'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-green-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Lost & Found Portal
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 mb-8">
                Find what's lost, return what's found!
              </p>
              <p className="text-lg text-gray-600 mb-8 max-w-xl">
                Our community-driven platform helps connect people who have lost items with those who have found them. 
                Join thousands of users who have successfully reunited with their belongings.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={() => onNavigate('report-lost')}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Report Lost Item
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => onNavigate('report-found')}
                  className="border-green-500 text-green-600 hover:bg-green-50"
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Report Found Item
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button 
                  size="lg"
                  variant="secondary"
                  onClick={() => onNavigate('search')}
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search Items
                </Button>
                <Button 
                  size="lg"
                  variant="ghost"
                  onClick={() => onNavigate('auth')}
                >
                  <Users className="w-5 h-5 mr-2" />
                  Register / Login
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1568231077042-fd07665b7f84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb3N0JTIwZm91bmQlMjBpdGVtcyUyMGNvbW11bml0eSUyMGhlbHB8ZW58MXx8fHwxNzU4NzY5OTk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Community helping each other"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our simple 4-step process makes it easy to recover lost items or help others find theirs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with trust and community in mind, our platform offers the best features to help reunite people with their belongings.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join our community and help make the world a little more connected.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              variant="secondary"
              onClick={() => onNavigate('auth')}
              className="bg-white text-gray-900 hover:bg-gray-100"
            >
              <Users className="w-5 h-5 mr-2" />
              Join Our Community
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => onNavigate('search')}
              className="border-white text-white hover:bg-white/10"
            >
              <Search className="w-5 h-5 mr-2" />
              Browse Items Now
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">1,234</div>
              <div className="text-gray-600">Items Reunited</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">5,678</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">89%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}