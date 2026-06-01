import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { projectAPI } from '../services/api';
import Loader from '../components/common/Loader';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectAPI.getAll();
        setProjects(response.data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Projects</h1>
          <p className="text-xl text-gray-100">Making a lasting impact</p>
        </div>
      </section>

      {/* Projects List */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <Loader />
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div key={project._id} className="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  <div className="bg-gradient-to-r from-green-400 to-green-600 h-40" />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm bg-green-100 text-green-600 px-3 py-1 rounded-full">
                        {project.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        Budget: ${project.budget || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No projects found</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Projects;
