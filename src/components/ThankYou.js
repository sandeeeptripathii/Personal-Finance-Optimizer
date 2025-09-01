import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

function ThankYou() {
  const { currentUser } = useAuth();
  const [email, setEmail] = useState(currentUser?.email || '');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    
    try {
      await addDoc(collection(db, 'waitlist'), {
        email,
        userId: currentUser?.uid || null,
        createdAt: serverTimestamp()
      });
      
      setSubmitted(true);
    } catch (error) {
      console.error('Error adding to waitlist:', error);
      alert('There was an error joining the waitlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Thank You!</h2>
          <p className="text-lg text-gray-600 mb-8">
            We've received your responses and are analyzing your financial profile. We'll be in touch soon with personalized recommendations.
          </p>
          
          {!submitted ? (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Join our waitlist</h3>
              <p className="text-gray-600 mb-4">
                Be the first to know when we launch new features and get exclusive financial tips.
              </p>
              
              <form onSubmit={handleWaitlistSubmit} className="mt-4">
                <div className="flex items-center">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 rounded-l-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Your email address"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-r-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {loading ? 'Joining...' : 'Join'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="mt-8 p-4 bg-green-50 rounded-md">
              <p className="text-green-800 font-medium">
                You've successfully joined our waitlist! We'll keep you updated on our progress.
              </p>
            </div>
          )}
          
          <div className="mt-8">
            <Link
              to="/"
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThankYou;