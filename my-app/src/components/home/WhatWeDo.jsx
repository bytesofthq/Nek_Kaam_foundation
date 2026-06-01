import { CheckCircle } from 'lucide-react';

const WhatWeDo = () => {
  const activities = [
    {
      title: 'Education Programs',
      description: 'Providing quality education and skill development to underprivileged youth',
    },
    {
      title: 'Healthcare Initiatives',
      description: 'Organizing health camps and medical assistance programs',
    },
    {
      title: 'Community Development',
      description: 'Working on infrastructure and livelihood projects',
    },
    {
      title: 'Environmental Conservation',
      description: 'Promoting sustainable practices and environmental awareness',
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What We Do</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {activities.map((activity, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-8 flex gap-4">
              <CheckCircle className="text-green-600 flex-shrink-0" size={32} />
              <div>
                <h3 className="text-xl font-bold mb-2">{activity.title}</h3>
                <p className="text-gray-600">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
