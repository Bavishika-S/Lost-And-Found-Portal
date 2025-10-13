import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { ArrowLeft, FileText, PlusCircle, Bell, MapPin, Calendar, User as UserIcon, Check, X, Trash2 } from 'lucide-react';
import { Item, User, Claim } from '../App';
import { toast } from 'sonner@2.0.3';
import { api } from '@/services/api';

interface DashboardProps {
  items: Item[];
  claims: Claim[];
  user: User | null;
  onNavigate: (page: string) => void;
  onRefresh?: () => Promise<void> | void;
}

export function Dashboard({ items, claims, user, onNavigate, onRefresh }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [claimStatusOverrides, setClaimStatusOverrides] = useState<Record<string, Claim['status']>>({});
  const [itemStatusOverrides, setItemStatusOverrides] = useState<Record<string, Item['status']>>({});

  if (!user) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-md mx-auto text-center">
          <Card className="shadow-xl border-0">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Login Required</h2>
              <p className="text-gray-600 mb-6">
                You need to be logged in to view your dashboard.
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

  const userLostItems = items.filter(item => item.userId === user.id && item.type === 'lost');
  const userFoundItems = items.filter(item => item.userId === user.id && item.type === 'found');
  const userClaims = claims.filter(claim => claim.claimantId === user.id);
  const claimsOnUserItems = claims.filter(claim => {
    const item = items.find(i => i.id === claim.itemId);
    return item?.userId === user.id;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      matched: 'bg-blue-100 text-blue-800',
      returned: 'bg-green-100 text-green-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return (colors as any)[status] || (colors as any).pending;
  };

  const resolveClaimStatus = (claim: Claim) => claimStatusOverrides[claim.id] || claim.status;
  const resolveItemStatus = (item: Item) => itemStatusOverrides[item.id] || item.status;

  const updateClaim = async (claim: Claim, nextStatus: Claim['status']) => {
    if (resolveClaimStatus(claim) !== 'pending') return;
    try {
      await api.updateClaimStatus(claim.id, nextStatus);
      setClaimStatusOverrides(prev => ({ ...prev, [claim.id]: nextStatus }));
      if (nextStatus === 'accepted') {
        // Optimistically reflect the related item's status change to matched
        setItemStatusOverrides(prev => ({ ...prev, [claim.itemId]: 'matched' }));
      }
      if (onRefresh) await onRefresh();
      toast.success(`Claim ${nextStatus}`);
    } catch (e: any) {
      toast.error(e.message || 'Failed to update claim');
    }
  };

  const deleteItem = async (itemId: string) => {
    if (!confirm('Delete this item? This cannot be undone.')) return;
    try {
      try {
        await api.deleteItem(itemId);
      } catch {
        // fallback for environments that block DELETE
        await api.deleteItemPost(itemId);
      }
      toast.success('Item deleted');
      if (onRefresh) await onRefresh();
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete item');
    }
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <div className="flex items-center space-x-2 text-gray-600">
            <UserIcon className="w-5 h-5" />
            <span>Welcome, {user.name}</span>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="lost">My Lost Items</TabsTrigger>
            <TabsTrigger value="found">My Found Items</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="shadow-lg border-0">
                <CardContent className="p-6 text-center">
                  <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{userLostItems.length}</div>
                  <div className="text-sm text-gray-600">Lost Items</div>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg border-0">
                <CardContent className="p-6 text-center">
                  <PlusCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{userFoundItems.length}</div>
                  <div className="text-sm text-gray-600">Found Items</div>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg border-0">
                <CardContent className="p-6 text-center">
                  <Bell className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{userClaims.length}</div>
                  <div className="text-sm text-gray-600">My Claims</div>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg border-0">
                <CardContent className="p-6 text-center">
                  <UserIcon className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{claimsOnUserItems.length}</div>
                  <div className="text-sm text-gray-600">Claims Received</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...userLostItems, ...userFoundItems]
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .slice(0, 5)
                      .map((item) => (
                        <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-gray-500">
                              {item.type === 'lost' ? 'Lost' : 'Found'} • {formatDate(item.date)}
                            </p>
                          </div>
                          <Badge variant="outline" className={getStatusColor(resolveItemStatus(item))}>
                            {resolveItemStatus(item)}
                          </Badge>
                        </div>
                      ))}
                    {[...userLostItems, ...userFoundItems].length === 0 && (
                      <p className="text-gray-500 text-center py-4">No items reported yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={() => onNavigate('report-lost')}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Report Lost Item
                  </Button>
                  <Button 
                    onClick={() => onNavigate('report-found')}
                    variant="outline"
                    className="w-full border-green-500 text-green-600 hover:bg-green-50"
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Report Found Item
                  </Button>
                  <Button 
                    onClick={() => onNavigate('search')}
                    variant="secondary"
                    className="w-full"
                  >
                    Browse All Items
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="lost">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>My Lost Items ({userLostItems.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {userLostItems.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No lost items reported</h3>
                    <p className="text-gray-600 mb-4">Start by reporting an item you've lost.</p>
                    <Button onClick={() => onNavigate('report-lost')}>
                      Report Lost Item
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userLostItems.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{item.name}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getStatusColor(resolveItemStatus(item))}>
                              {resolveItemStatus(item)}
                            </Badge>
                            <Button variant="destructive" size="sm" onClick={() => deleteItem(item.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {item.location}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(item.date)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="found">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>My Found Items ({userFoundItems.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {userFoundItems.length === 0 ? (
                  <div className="text-center py-8">
                    <PlusCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No found items reported</h3>
                    <p className="text-gray-600 mb-4">Help others by reporting items you've found.</p>
                    <Button onClick={() => onNavigate('report-found')}>
                      Report Found Item
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userFoundItems.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{item.name}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getStatusColor(resolveItemStatus(item))}>
                              {resolveItemStatus(item)}
                            </Badge>
                            <Button variant="destructive" size="sm" onClick={() => deleteItem(item.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {item.location}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(item.date)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userClaims.map((claim) => {
                    const item = items.find(i => i.id === claim.itemId);
                    const status = resolveClaimStatus(claim);
                    return (
                      <div key={claim.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">Claim on "{item?.name}"</h3>
                          <Badge variant="outline" className={getStatusColor(status)}>
                            {status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">
                          Your claim: {claim.details}
                        </p>
                        <p className="text-xs text-gray-500">
                          Item {item?.type} at {item?.location}
                        </p>
                      </div>
                    );
                  })}
                  
                  {claimsOnUserItems.map((claim) => {
                    const item = items.find(i => i.id === claim.itemId);
                    const status = resolveClaimStatus(claim);
                    const disabled = status !== 'pending';
                    return (
                      <div key={claim.id} className="border rounded-lg p-4 bg-blue-50">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">Someone claimed your "{item?.name}"</h3>
                          <Badge variant="outline" className={getStatusColor(status)}>
                            {status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">
                          Their details: {claim.details}
                        </p>
                        <div className="flex gap-2">
                          <Button 
                            size="sm"
                            variant="destructive"
                            disabled={disabled}
                            onClick={() => updateClaim(claim, 'accepted')}
                          >
                            <Check className="w-4 h-4 mr-1" /> Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            disabled={disabled}
                            onClick={() => updateClaim(claim, 'rejected')}
                          >
                            <X className="w-4 h-4 mr-1" /> Reject
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  
                  {[...userClaims, ...claimsOnUserItems].length === 0 && (
                    <div className="text-center py-8">
                      <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
                      <p className="text-gray-600">You'll see notifications here when there's activity on your items.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}