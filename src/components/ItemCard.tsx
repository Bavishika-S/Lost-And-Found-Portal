import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Item, User } from '../App';
import { toast } from 'sonner@2.0.3';

interface ItemCardProps {
  item: Item;
  user: User | null;
  onClaim: (claim: { itemId: string; claimantId: string; details: string }) => Promise<void> | void;
  onNavigate: (page: string) => void;
}

export function ItemCard({ item, user, onClaim, onNavigate }: ItemCardProps) {
  const handleClaim = async () => {
    if (!user) {
      toast.error('Please login to claim items');
      onNavigate('auth');
      return;
    }

    if (user.id === item.userId) {
      toast.error('You cannot claim your own item');
      return;
    }

    const details = prompt(`Please provide details to verify your ownership of this ${item.type} item:`);
    if (details) {
      await onClaim({
        itemId: item.id,
        claimantId: user.id,
        details
      });
      toast.success('Claim submitted successfully! The finder/reporter will be notified.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      phone: 'bg-blue-100 text-blue-800',
      wallet: 'bg-green-100 text-green-800',
      keys: 'bg-yellow-100 text-yellow-800',
      documents: 'bg-purple-100 text-purple-800',
      jewelry: 'bg-pink-100 text-pink-800',
      bag: 'bg-indigo-100 text-indigo-800',
      clothing: 'bg-orange-100 text-orange-800',
      electronics: 'bg-cyan-100 text-cyan-800',
      glasses: 'bg-gray-100 text-gray-800',
      other: 'bg-slate-100 text-slate-800'
    } as const;
    return (colors as any)[category] || colors.other;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      matched: 'bg-blue-100 text-blue-800',
      returned: 'bg-green-100 text-green-800'
    } as const;
    return (colors as any)[status] || colors.pending;
  };

  return (
    <Card className="h-full shadow-lg hover:shadow-xl transition-shadow border-0">
      <CardContent className="p-6">
        <div className="flex flex-col h-full">
          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <Badge className={getCategoryColor(item.category)}>{item.category}</Badge>
            </div>

            {item.image && (
              <img src={item.image} alt={item.name} className="w-full h-40 object-cover rounded-lg" />
            )}

            <p className="text-gray-600 text-sm line-clamp-3">{item.description}</p>

            <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
              <div>
                <span className="font-medium">Location:</span> {item.location}
              </div>
              <div>
                <span className="font-medium">Date:</span> {formatDate(item.date)}
              </div>
              <div className="col-span-2">
                <span className="font-medium">Contact:</span> {item.contactDetails}
              </div>
            </div>

            <div>
              <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
            </div>
          </div>

          <div className="mt-4">
            <Button onClick={handleClaim} className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600">
              Claim This Item
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}