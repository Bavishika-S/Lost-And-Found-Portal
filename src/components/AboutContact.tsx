import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { ArrowLeft, Mail, Shield, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AboutContactProps {
  onNavigate: (page: string) => void;
}

export function AboutContact({ onNavigate }: AboutContactProps) {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error('Please fill in all fields');
      return;
    }

    // Mock form submission
    toast.success('Message sent successfully! We\'ll get back to you soon.');
    setContactForm({ name: '', email: '', message: '' });
  };

  const guidelines = [
    {
      icon: Shield,
      title: 'Always verify ownership',
      description: 'Before handing over any item, ask for specific details that only the real owner would know.'
    },
    {
      icon: Users,
      title: 'Meet in safe, public places',
      description: 'When arranging to return or collect items, always meet in well-lit, public locations.'
    },
    {
      icon: AlertTriangle,
      title: 'Don\'t share sensitive information',
      description: 'Avoid sharing personal details beyond what\'s necessary for the return process.'
    },
    {
      icon: CheckCircle,
      title: 'Trust your instincts',
      description: 'If something feels wrong or suspicious, don\'t proceed with the exchange.'
    }
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => onNavigate('home')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="space-y-12">
          {/* About Section */}
          <section>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">About Lost & Found Portal</h1>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Our Mission</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Lost & Found Portal is a community-driven platform designed to help reunite people 
                    with their lost belongings. We believe in the power of community and the kindness 
                    of strangers to make a difference in someone's day.
                  </p>
                  <p className="text-gray-600">
                    Our platform connects those who have lost items with kind individuals who have 
                    found them, creating a seamless process for reuniting people with their belongings.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>How We Help</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Easy reporting system for lost and found items</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Smart matching to connect owners with finders</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Secure communication platform</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Community-focused approach to helping others</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator />

          {/* Guidelines Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Safety Guidelines</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {guidelines.map((guideline, index) => {
                const Icon = guideline.icon;
                return (
                  <Card key={index} className="shadow-lg border-0">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {guideline.title}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {guideline.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="mt-6 bg-yellow-50 border-yellow-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-800 mb-2">Important Disclaimer</h3>
                    <p className="text-yellow-700 text-sm">
                      Lost & Found Portal serves only as a connector between people. We are not responsible 
                      for any disputes, damages, or issues that may arise from transactions. Users are 
                      encouraged to exercise caution and use their best judgment when interacting with others.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <Separator />

          {/* Contact Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="w-5 h-5" />
                    <span>Get in Touch</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact-name">Name</Label>
                      <Input
                        id="contact-name"
                        value={contactForm.name}
                        onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contact-email">Email</Label>
                      <Input
                        id="contact-email"
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contact-message">Message</Label>
                      <Textarea
                        id="contact-message"
                        value={contactForm.message}
                        onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="How can we help you?"
                        rows={5}
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                    >
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Why Contact Us?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Report Issues</h4>
                    <p className="text-sm text-gray-600">
                      Found a bug or experiencing technical difficulties? Let us know.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Suggest Features</h4>
                    <p className="text-sm text-gray-600">
                      Have ideas to make our platform better? We'd love to hear them.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">General Inquiries</h4>
                    <p className="text-sm text-gray-600">
                      Questions about how the platform works or partnership opportunities.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Safety Concerns</h4>
                    <p className="text-sm text-gray-600">
                      Report suspicious activity or safety concerns to help keep our community safe.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Stats Section */}
          <section className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Making a Difference Together</h2>
              <p className="text-blue-100">
                Join thousands of community members helping reunite people with their belongings
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold mb-2">1,234</div>
                <div className="text-blue-100">Items Successfully Returned</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">5,678</div>
                <div className="text-blue-100">Active Community Members</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">89%</div>
                <div className="text-blue-100">Success Rate</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}