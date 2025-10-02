import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Upload, Calendar, MapPin, FileText } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Item, User } from '../App';

interface ReportLostItemProps {
  onSubmit: (item: Omit<Item, 'id' | 'userId' | 'status'>) => Promise<void> | void;
  onNavigate: (page: string) => void;
  user: User | null;
}

export function ReportLostItem({ onSubmit, onNavigate, user }: ReportLostItemProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    location: '',
    date: '',
    contactDetails: user?.email || '',
    image: ''
  });

  const categories = [
    'wallet',
    'phone',
    'keys',
    'documents',
    'jewelry',
    'bag',
    'clothing',
    'electronics',
    'glasses',
    'other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to report items');
      onNavigate('auth');
      return;
    }

    if (!formData.name || !formData.category || !formData.description || !formData.location || !formData.date) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await onSubmit({
        ...formData,
        type: 'lost'
      } as any);

      toast.success('Lost item reported successfully!');
      onNavigate('dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Failed to report item');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload to a server
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, image: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-md mx-auto text-center">
          <Card className="shadow-xl border-0">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Login Required</h2>
              <p className="text-gray-600 mb-6">
                You need to be logged in to report lost items.
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => onNavigate('auth')}
                  className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                >
                  Login / Register
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => onNavigate('home')}
                  className="w-full"
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => onNavigate('home')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-6 h-6 text-blue-500" />
              <span>Report Lost Item</span>
            </CardTitle>
            <CardDescription>
              Provide as much detail as possible to help others identify your lost item
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="item-name">Item Name *</Label>
                  <Input
                    id="item-name"
                    placeholder="e.g., iPhone 13 Pro"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your item in detail (color, size, distinguishing features, etc.)"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location Lost *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="location"
                      placeholder="e.g., Central Park, NYC"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Date Lost *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Contact Details *</Label>
                <Input
                  id="contact"
                  placeholder="Email or phone number"
                  value={formData.contactDetails}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactDetails: e.target.value }))}
                  required
                />
                <p className="text-sm text-gray-500">
                  This will be shared with potential finders
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Item Photo (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  {formData.image ? (
                    <div className="space-y-2">
                      <img 
                        src={formData.image} 
                        alt="Preview" 
                        className="max-w-32 max-h-32 mx-auto rounded-lg object-cover"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 mb-2">Upload an image of your lost item</p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => document.getElementById('image-upload')?.click()}
                      >
                        Choose File
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">Important Reminders:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Be prepared to verify ownership when contacted</li>
                  <li>• Only share contact information you're comfortable with</li>
                  <li>• Meet in safe, public places when collecting items</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  Report Lost Item
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onNavigate('home')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}