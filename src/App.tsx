import React, { useEffect, useState } from 'react';
import { api } from './services/api';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { AuthPage } from './components/AuthPage';
import { ReportLostItem } from './components/ReportLostItem';
import { ReportFoundItem } from './components/ReportFoundItem';
import { SearchItems } from './components/SearchItems';
import { Dashboard } from './components/Dashboard';
import { AboutContact } from './components/AboutContact';
import { Toaster } from './components/ui/sonner';

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export type Item = {
  id: string;
  name: string;
  category: string;
  description: string;
  location: string;
  date: string;
  contactDetails: string;
  image?: string;
  userId: string;
  status: 'pending' | 'matched' | 'returned';
  type: 'lost' | 'found';
};

export type Claim = {
  id: string;
  itemId: string;
  claimantId: string;
  details: string;
  status: 'pending' | 'accepted' | 'rejected';
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [fetchedItems, fetchedClaims] = await Promise.all([
          api.getItems(),
          api.getClaims(),
        ]);
        setItems(fetchedItems as Item[]);
        setClaims(fetchedClaims as Claim[]);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const refreshAll = async () => {
    const [fetchedItems, fetchedClaims] = await Promise.all([
      api.getItems(),
      api.getClaims(),
    ]);
    setItems(fetchedItems as Item[]);
    setClaims(fetchedClaims as Claim[]);
  };

  const addItem = async (item: Omit<Item, 'id' | 'userId' | 'status'>) => {
    const payload = { ...item, userId: user?.id || 'anonymous' } as any;
    await api.createItem(payload);
    const refreshed = await api.getItems();
    setItems(refreshed as Item[]);
  };

  const addClaim = async (claim: Omit<Claim, 'id' | 'status'>) => {
    await api.createClaim({ itemId: claim.itemId, claimantId: claim.claimantId, details: claim.details });
    const refreshed = await api.getClaims();
    setClaims(refreshed as Claim[]);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'auth':
        return <AuthPage onLogin={setUser} onNavigate={setCurrentPage} />;
      case 'report-lost':
        return <ReportLostItem onSubmit={addItem} onNavigate={setCurrentPage} user={user} />;
      case 'report-found':
        return <ReportFoundItem onSubmit={addItem} onNavigate={setCurrentPage} user={user} />;
      case 'search':
        return <SearchItems items={items} onClaim={addClaim} user={user} onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <Dashboard items={items} claims={claims} user={user} onNavigate={setCurrentPage} onRefresh={refreshAll} />;
      case 'about':
        return <AboutContact onNavigate={setCurrentPage} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navigation 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        user={user} 
        onLogout={() => setUser(null)} 
      />
      <main>
        {renderPage()}
      </main>
      <Toaster />
    </div>
  );
}