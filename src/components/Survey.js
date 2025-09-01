import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

function Survey() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ageBracket: '',
    financialGoal: '',
    struggleArea: '',
    managementMethod: '',
    interests: [],
    bankLinking: '',
    lifeEvents: ''
  });

  const questions = [
    {
      id: 'ageBracket',
      question: 'What is your age bracket?',
      type: 'radio',
      options: ['Under 18', '18-25', '26-35', '36-45', '46+']
    },
    {
      id: 'financialGoal',
      question: 'What\'s your current primary financial goal?',
      type: 'radio',
      options: ['Save more', 'Pay off debt', 'Invest', 'Build emergency fund', 'Other']
    },
    {
      id: 'struggleArea',
      question: 'Which area do you struggle most to control?',
      type: 'radio',
      options: ['Food', 'Shopping', 'Rent', 'Bills', 'Travel', 'Subscriptions', 'Other']
    },
    {
      id: 'managementMethod',
      question: 'How do you currently manage your finances?',
      type: 'radio',
      options: ['Apps', 'Spreadsheets', 'Notebooks', 'No system']
    },
    {
      id: 'interests',
      question: 'Are you interested in:',
      type: 'checkbox',
      options: ['Automated savings', 'Investment guides', 'Credit card comparisons', 'Insurance reviews', 'Budgeting tips']
    },
    {
      id: 'bankLinking',
      question: 'Would you be willing to link a bank account for deeper insights?',
      type: 'radio',
      options: ['Yes, anonymously', 'Maybe', 'No']
    },
    {
      id: 'lifeEvents',
      question: 'Do you have any major life events planned in the next year?',
      type: 'radio',
      options: ['None', 'Wedding', 'Moving', 'Kids', 'Buying a vehicle', 'Studying abroad']
    }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (checked) {
        setFormData({
          ...formData,
          [name]: [...(formData[name] || []), value]
        });
      } else {
        setFormData({
          ...formData,
          [name]: formData[name].filter(item => item !== value)
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepComplete = () => {
    const currentQuestion = questions[currentStep];
    const answer = formData[currentQuestion.id];
    
    if (currentQuestion.type === 'checkbox') {
      return Array.isArray(answer) && answer.length > 0;
    }
    
    return !!answer;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Save survey data to Firestore
      await addDoc(collection(db, 'surveys'), {
        userId: currentUser.uid,
        email: currentUser.email,
        ...formData,
        createdAt: serverTimestamp()
      });
      
      // Navigate to thank you page
      navigate('/thank-you');
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('There was an error submitting your survey. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderQuestion = () => {
    const currentQuestion = questions[currentStep];
    
    return (
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{currentQuestion.question}</h3>
        
        {currentQuestion.type === 'radio' && (
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <div key={option} className="flex items-center">
                <input
                  id={`${currentQuestion.id}-${option}`}
                  name={currentQuestion.id}
                  type="radio"
                  value={option}
                  checked={formData[currentQuestion.id] === option}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <label htmlFor={`${currentQuestion.id}-${option}`} className="ml-3 block text-gray-700">
                  {option}
                </label>
              </div>
            ))}
          </div>
        )}
        
        {currentQuestion.type === 'checkbox' && (
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <div key={option} className="flex items-center">
                <input
                  id={`${currentQuestion.id}-${option}`}
                  name={currentQuestion.id}
                  type="checkbox"
                  value={option}
                  checked={formData[currentQuestion.id]?.includes(option) || false}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor={`${currentQuestion.id}-${option}`} className="ml-3 block text-gray-700">
                  {option}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Personal Finance Survey</h2>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Question {currentStep + 1} of {questions.length}</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {renderQuestion()}
          
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                currentStep === 0
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                  : 'text-gray-700 bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>
            
            {currentStep < questions.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!isStepComplete()}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  isStepComplete()
                    ? 'text-white bg-primary-600 hover:bg-primary-700'
                    : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                }`}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || !isStepComplete()}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  loading || !isStepComplete()
                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                    : 'text-white bg-primary-600 hover:bg-primary-700'
                }`}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Survey;