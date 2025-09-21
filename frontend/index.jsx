import React, { useState, useEffect } from 'react';

// Main App Component
const App = () => {
    // State management for UI and data
    const [activeSection, setActiveSection] = useState('lost-found-items');
    const [lostItems, setLostItems] = useState([]);
    const [foundItems, setFoundItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to control what is displayed
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [postType, setPostType] = useState('lost');
    const [postForm, setPostForm] = useState({
        title: '',
        description: '',
        location: '',
        contact: '',
        imageUrl: '',
    });

    // --- DATA FETCHING FROM JAVA BACKEND ---
    // This function fetches all lost and found items from your backend API
    const fetchItems = async () => {
        setLoading(true);
        try {
            const lostResponse = await fetch('/api/items/lost');
            const foundResponse = await fetch('/api/items/found');
            const lostData = await lostResponse.json();
            const foundData = await foundResponse.json();

            setLostItems(lostData);
            setFoundItems(foundData);
        } catch (error) {
            console.error("Error fetching items:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch items only if the user is logged in
        if (isLoggedIn) {
            fetchItems();
        }
    }, [isLoggedIn]);

    // Function to handle adding a new item
    // This sends a POST request to your backend
    const handlePostItem = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...postForm,
                    type: postType,
                }),
            });

            if (response.ok) {
                // Clear the form and close the modal
                setPostForm({ title: '', description: '', location: '', contact: '', imageUrl: '' });
                setIsPosting(false);
                // Re-fetch items to update the UI
                fetchItems();
            } else {
                console.error("Failed to post item.");
            }
        } catch (error) {
            console.error("Error posting item:", error);
        }
    };

    // --- NEW: LOGIN AND SIGNUP HANDLERS ---
    // These functions are placeholders that you will connect to your backend's
    // actual authentication endpoints.
    const handleLogin = async (e) => {
        e.preventDefault();
        console.log(`Attempting to log in with email: ${email}`);
        // In a real application, you'd send a request to a /api/auth/login endpoint
        // and handle the response. For this example, we'll just log in.
        setIsLoggedIn(true);
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        console.log(`Attempting to sign up with email: ${email}`);
        // In a real application, you'd send a request to a /api/auth/signup endpoint.
        // For this example, we'll just log in after signup.
        setIsLoggedIn(true);
    };

    // Helper component to render a single item card
    const ItemCard = ({ item }) => (
        <div className="card p-6 relative flex flex-col items-center text-center">
            <img 
                src={item.imageUrl || `https://placehold.co/150x150/${item.type === 'lost' ? 'FF0000' : '00FF00'}/FFFFFF?text=${item.title.split(' ')[0]}`} 
                alt={item.title} 
                className="w-24 h-24 rounded-lg mb-4 object-cover" 
            />
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-3">{item.description}</p>
            <p className="text-sm font-semibold text-gray-800 mt-2">Contact: {item.contact}</p>
        </div>
    );

    // Render the main UI based on login state
    return (
        <div className="flex flex-col h-screen p-8 bg-gray-200">
            {/* Main Container */}
            <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full">
                {/* Header */}
                <div className="bg-slate-800 text-white p-6 rounded-t-xl shadow-lg">
                    <h1 className="text-3xl font-bold text-center tracking-wide">COLLEGE LOST & FOUND HUB</h1>
                </div>

                {/* Main Content Area */}
                {isLoggedIn ? (
                    <div className="flex-1 flex flex-col md:flex-row bg-slate-200 rounded-b-xl shadow-lg">
                        {/* Sidebar Navigation */}
                        <div className="sidebar w-full md:w-64 p-6 m-4 md:m-0 md:p-6 md:rounded-bl-xl md:rounded-tl-none rounded-xl md:border-r border-gray-300">
                            <nav className="flex flex-col space-y-4">
                                <button onClick={() => { setActiveSection('lost-found-items'); setIsPosting(false); }} className={`flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-slate-300 transition-colors ${activeSection === 'lost-found-items' ? 'bg-slate-300 text-slate-800 font-semibold shadow-inner' : ''}`}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 20h6a2 2 0 002-2V8a2 2 0 00-2-2H9a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                    <span className="font-medium">LOST & FOUND ITEMS</span>
                                </button>
                                <button onClick={() => { setIsPosting(true); setActiveSection('post-item'); }} className={`flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-slate-300 transition-colors ${activeSection === 'post-item' ? 'bg-slate-300 text-slate-800 font-semibold shadow-inner' : ''}`}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                    <span className="font-medium">POST AN ITEM</span>
                                </button>
                            </nav>
                        </div>

                        <div className="main-content flex-1 p-8 m-4 md:m-0 md:rounded-r-xl rounded-xl">
                            {loading && <div className="text-center text-gray-500">Loading items...</div>}
                            {activeSection === 'lost-found-items' && !loading && (
                                <div className="flex flex-col space-y-8">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800 mb-4">LOST ITEMS</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {lostItems.length > 0 ? (
                                                lostItems.map(item => <ItemCard key={item.id} item={item} />)
                                            ) : (
                                                <p className="text-gray-500">No lost items posted yet.</p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800 mb-4">FOUND ITEMS</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {foundItems.length > 0 ? (
                                                foundItems.map(item => <ItemCard key={item.id} item={item} />)
                                            ) : (
                                                <p className="text-gray-500">No found items posted yet.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isPosting && (
                                <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg mx-auto">
                                    <h2 className="text-2xl font-bold text-center mb-6">Post a {postType === 'lost' ? 'Lost' : 'Found'} Item</h2>
                                    <form onSubmit={handlePostItem} className="space-y-4">
                                        <div className="flex justify-center space-x-4">
                                            <button 
                                                type="button" 
                                                onClick={() => setPostType('lost')}
                                                className={`px-4 py-2 rounded-lg font-semibold ${postType === 'lost' ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                                            >
                                                Lost
                                            </button>
                                            <button 
                                                type="button" 
                                                onClick={() => setPostType('found')}
                                                className={`px-4 py-2 rounded-lg font-semibold ${postType === 'found' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                                            >
                                                Found
                                            </button>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Item Name</label>
                                            <input 
                                                type="text" 
                                                value={postForm.title}
                                                onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                                                required 
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Description</label>
                                            <textarea 
                                                value={postForm.description}
                                                onChange={(e) => setPostForm({ ...postForm, description: e.target.value })}
                                                rows="3" 
                                                required 
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            ></textarea>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Location</label>
                                            <input 
                                                type="text" 
                                                value={postForm.location}
                                                onChange={(e) => setPostForm({ ...postForm, location: e.target.value })}
                                                required 
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Contact Info</label>
                                            <input 
                                                type="text" 
                                                value={postForm.contact}
                                                onChange={(e) => setPostForm({ ...postForm, contact: e.target.value })}
                                                required 
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Image URL (Optional)</label>
                                            <input 
                                                type="text" 
                                                value={postForm.imageUrl}
                                                onChange={(e) => setPostForm({ ...postForm, imageUrl: e.target.value })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            />
                                        </div>
                                        <div className="flex justify-end space-x-2">
                                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700">
                                                Post Item
                                            </button>
                                            <button type="button" onClick={() => setIsPosting(false)} className="px-4 py-2 bg-gray-400 text-white rounded-lg shadow-md hover:bg-gray-500">
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-200 rounded-b-xl shadow-lg">
                        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
                            <h2 className="text-2xl font-bold text-center mb-6">Login / Signup</h2>
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">College Email</label>
                                    <input 
                                        type="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required 
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Password</label>
                                    <input 
                                        type="password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required 
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
                                    />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700">
                                        Login
                                    </button>
                                    <button type="button" onClick={handleSignup} className="px-4 py-2 bg-gray-400 text-white rounded-lg shadow-md hover:bg-gray-500">
                                        Signup
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
