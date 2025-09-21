import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
  const [activeTab, setActiveTab] = useState('lost');
  const [loggedIn, setLoggedIn] = useState(true); // Assuming logged in for design purposes
  const [lostItems, setLostItems] = useState([
    { id: 'l1', name: 'Blue Backpack', description: 'Lost near the college library on Oct 25.', location: 'Library', contact: 'Student@college.edu', image: 'https://placehold.co/100x100/366e92/ffffff?text=Backpack' },
    { id: 'l2', name: 'Silver Watch', description: 'Lost near the main fountain on Oct 24.', location: 'Fountain', contact: 'Student@college.edu', image: 'https://placehold.co/100x100/c0c0c0/000000?text=Watch' },
    { id: 'l3', name: 'Red Water Bottle', description: 'Lost in the cafeteria.', location: 'Cafeteria', contact: 'Student@college.edu', image: 'https://placehold.co/100x100/ff0000/ffffff?text=Bottle' },
  ]);
  const [foundItems, setFoundItems] = useState([
    { id: 'f1', name: 'Pair of Keys', description: 'Found in the cafeteria on Oct 25.', location: 'Cafeteria', contact: 'Student@college.edu', image: 'https://placehold.co/100x100/ffcc00/000000?text=Keys' },
    { id: 'f2', name: 'Black Scarf', description: 'Found in the lecture hall.', location: 'Lecture Hall', contact: 'Student@college.edu', image: 'https://placehold.co/100x100/333333/ffffff?text=Scarf' },
    { id: 'f3', name: 'Keys with Lanyard', description: 'Found in the student union.', location: 'Student Union', contact: 'https://placehold.co/100x100/50c878/ffffff?text=Lanyard' },
  ]);
  const [lostItemForm, setLostItemForm] = useState({ name: '', description: '', location: '', date: '', contact: '', image: null });
  const [foundItemForm, setFoundItemForm] = useState({ name: '', description: '', location: '', date: '', contact: '', image: null });

  const renderContent = () => {
    switch (activeTab) {
      case 'lost':
      case 'found':
      case 'search':
        return (
          <div className="flex space-x-4 h-full">
            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-center text-lg font-semibold text-gray-700">
                <h2 className="text-xl font-bold">Lost Items</h2>
                <button
                  className="py-2 px-4 rounded-full text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
                  onClick={() => setActiveTab('lost')}
                >
                  <span className="inline-block mr-1">✍️</span>
                  Report Lost
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lostItems.map((item) => (
                  <div key={item.id} className="bg-white p-4 rounded-xl shadow-lg transform transition-transform hover:scale-105">
                    <img src={item.image} alt={item.name} className="w-full h-32 rounded-lg object-cover mb-4" />
                    <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                    <p className="text-sm text-gray-500 mt-1">**Lost near:** {item.location}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-center text-lg font-semibold text-gray-700">
                <h2 className="text-xl font-bold">Found Items</h2>
                <button
                  className="py-2 px-4 rounded-full text-sm font-medium bg-green-500 text-white hover:bg-green-600 transition-colors duration-200"
                  onClick={() => setActiveTab('found')}
                >
                  <span className="inline-block mr-1">✍️</span>
                  Report Found
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {foundItems.map((item) => (
                  <div key={item.id} className="bg-white p-4 rounded-xl shadow-lg transform transition-transform hover:scale-105">
                    <img src={item.image} alt={item.name} className="w-full h-32 rounded-lg object-cover mb-4" />
                    <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                    <p className="text-sm text-gray-500 mt-1">**Found near:** {item.location}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'match':
        return (
          <div className="p-8 space-y-6 bg-white rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800">Matching Suggestions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-100 p-6 rounded-xl border-2 border-dashed border-gray-300">
                <p className="text-center text-gray-500">No new matching suggestions at this time.</p>
              </div>
              {/* Add real matching logic here in the future */}
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="p-8 space-y-6 bg-white rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800">Contact a User</h2>
            <p className="text-gray-600">
              Please use this form to contact the owner of a matched item.
            </p>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Your Name</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea rows="4" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
              </div>
              <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                Send Message
              </button>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full p-8 space-y-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setLoggedIn(true); }}>
            <div>
              <input type="email" placeholder="Email address" required className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <input type="password" placeholder="Password" required className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-6 md:p-10">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[90vh]">
        {/* Sidebar */}
        <div className="bg-gray-800 text-white w-full md:w-64 p-6 flex-shrink-0 flex flex-col">
          <h1 className="text-2xl font-bold mb-6">
            <span role="img" aria-label="college icon" className="mr-2">🎓</span>
            College Lost & Found Hub
          </h1>
          <nav className="flex-grow">
            <ul>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab('lost')}
                  className={`w-full text-left py-3 px-4 rounded-xl flex items-center space-x-3 transition-colors duration-200
                  ${activeTab === 'lost' ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'}`}
                >
                  <span className="text-xl">📦</span>
                  <span>Lost Item Section</span>
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab('search')}
                  className={`w-full text-left py-3 px-4 rounded-xl flex items-center space-x-3 transition-colors duration-200
                  ${activeTab === 'search' ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'}`}
                >
                  <span className="text-xl">🔎</span>
                  <span>Search & Filter</span>
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab('match')}
                  className={`w-full text-left py-3 px-4 rounded-xl flex items-center space-x-3 transition-colors duration-200
                  ${activeTab === 'match' ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'}`}
                >
                  <span className="text-xl">🤝</span>
                  <span>Matching Suggestions</span>
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab('contact')}
                  className={`w-full text-left py-3 px-4 rounded-xl flex items-center space-x-3 transition-colors duration-200
                  ${activeTab === 'contact' ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'}`}
                >
                  <span className="text-xl">✉️</span>
                  <span>Contact System</span>
                </button>
              </li>
            </ul>
          </nav>
          <div className="mt-8">
            <button
              onClick={() => setLoggedIn(false)}
              className="w-full text-left py-3 px-4 rounded-xl flex items-center space-x-3 text-red-400 hover:bg-gray-700 transition-colors duration-200"
            >
              <span className="text-xl">🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <header className="bg-white p-6 rounded-2xl shadow-lg flex justify-between items-center mb-8 border-b-4 border-indigo-500">
            <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Search by item, category, or location"
                className="flex-1 py-2 px-4 rounded-full border border-gray-300 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                className="py-2 px-4 rounded-full text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
                onClick={() => setLostItems([])}
              >
                Filter Lost
              </button>
              <button
                className="py-2 px-4 rounded-full text-sm font-medium bg-green-500 text-white hover:bg-green-600 transition-colors duration-200"
                onClick={() => setFoundItems([])}
              >
                Filter Found
              </button>
            </div>
          </header>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
