const About = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Nek Kaam Foundation</h1>
          <p className="text-xl text-gray-100">Empowering communities, changing lives</p>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-blue-600 mb-4">Our Mission</h3>
              <p className="text-gray-700">
                To empower underprivileged communities through education, healthcare, skill development, and environmental conservation.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-blue-600 mb-4">Our Vision</h3>
              <p className="text-gray-700">
                A society where every individual has access to education, healthcare, and opportunities to lead a dignified life.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-blue-600 mb-4">Our Values</h3>
              <p className="text-gray-700">
                Integrity, compassion, transparency, and a commitment to sustainable social change.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Our History</h2>
          <p className="text-gray-700 mb-4 text-lg">
            Nek Kaam Foundation was established with a vision to make a meaningful difference in society. Over the years, we have grown to become a trusted organization working on multiple fronts to address social challenges.
          </p>
          <p className="text-gray-700 mb-4 text-lg">
            Our journey has been marked by dedicated volunteers, community partners, and beneficiaries who have contributed to our success. Today, we continue to expand our reach and impact.
          </p>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { name: 'John Smith', role: 'Founder & Chairman' },
              { name: 'Sarah Johnson', role: 'Executive Director' },
              { name: 'Michael Brown', role: 'Program Director' },
              { name: 'Emily Davis', role: 'Finance Manager' },
            ].map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-lg shadow-md overflow-hidden text-center">
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-40" />
                <div className="p-6">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
