import { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Search, Filter, ArrowLeft } from 'lucide-react';
import { Item, User, Claim } from '../App';
import { ItemCard } from './ItemCard';

interface SearchItemsProps {
  items: Item[];
  user: User | null;
  onClaim: (claim: Omit<Claim, 'id' | 'status'>) => void;
  onNavigate: (page: string) => void;
}

export function SearchItems({ items, user, onClaim, onNavigate }: SearchItemsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  const categories = [
    'all',
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

  const locations = useMemo(() => {
    const uniqueLocations = Array.from(new Set(items.map(item => item.location)));
    return ['all', ...uniqueLocations];
  }, [items]);

  const filteredItems = useMemo(() => {
    let filtered = items;

    // Filter by tab (all, lost, found)
    if (activeTab !== 'all') {
      filtered = filtered.filter(item => item.type === activeTab);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by location
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(item => item.location === selectedLocation);
    }

    return filtered;
  }, [items, searchQuery, selectedCategory, selectedLocation, activeTab]);

  const lostItems = filteredItems.filter(item => item.type === 'lost');
  const foundItems = filteredItems.filter(item => item.type === 'found');

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLocation('all');
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => onNavigate('home')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Items</h1>
          <p className="text-gray-600">Browse lost and found items to help reunite people with their belongings</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5" />
              <span>Search & Filter</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by item name, description, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="flex gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location === 'all' ? 'All Locations' : location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button variant="outline" onClick={clearFilters}>
                  <Filter className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="all">All Items ({filteredItems.length})</TabsTrigger>
            <TabsTrigger value="lost">Lost ({lostItems.length})</TabsTrigger>
            <TabsTrigger value="found">Found ({foundItems.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-6">
            {filteredItems.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search criteria or check back later for new items.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={() => onNavigate('report-lost')}>
                      Report Lost Item
                    </Button>
                    <Button variant="outline" onClick={() => onNavigate('report-found')}>
                      Report Found Item
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    user={user}
                    onClaim={onClaim}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="lost" className="space-y-6">
            {lostItems.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No lost items found</h3>
                  <p className="text-gray-600 mb-6">No lost items match your search criteria.</p>
                  <Button onClick={() => onNavigate('report-lost')}>
                    Report Lost Item
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lostItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    user={user}
                    onClaim={onClaim}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="found" className="space-y-6">
            {foundItems.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No found items</h3>
                  <p className="text-gray-600 mb-6">No found items match your search criteria.</p>
                  <Button onClick={() => onNavigate('report-found')}>
                    Report Found Item
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {foundItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    user={user}
                    onClaim={onClaim}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}