import { useEffect, useState } from 'react';
import { MapPin, Clock, DollarSign, ArrowRight, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { jobsApi } from '../lib/api';

const FeaturedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch jobs from your backend
    const fetchJobs = async () => {
      try {
        // Uncomment when backend is ready
        // const response = await jobsApi.getAll();
        // setJobs(response.data.slice(0, 6));
        
        // Placeholder data for now
        setJobs([
          {
            id: 1,
            title: 'Senior Frontend Developer',
            company: 'TechCorp',
            location: 'Remote',
            type: 'Full-time',
            salary: '$120k - $150k',
            postedAt: '2 days ago',
            logo: '💻'
          },
          {
            id: 2,
            title: 'Product Manager',
            company: 'StartupXYZ',
            location: 'New York, NY',
            type: 'Full-time',
            salary: '$100k - $130k',
            postedAt: '1 day ago',
            logo: '🚀'
          },
          {
            id: 3,
            title: 'UX Designer',
            company: 'DesignStudio',
            location: 'San Francisco, CA',
            type: 'Contract',
            salary: '$90k - $120k',
            postedAt: '3 days ago',
            logo: '🎨'
          },
          {
            id: 4,
            title: 'Backend Engineer',
            company: 'DataSystems',
            location: 'Austin, TX',
            type: 'Full-time',
            salary: '$110k - $140k',
            postedAt: '5 hours ago',
            logo: '⚙️'
          },
          {
            id: 5,
            title: 'Marketing Lead',
            company: 'GrowthCo',
            location: 'Remote',
            type: 'Full-time',
            salary: '$80k - $110k',
            postedAt: '1 week ago',
            logo: '📈'
          },
          {
            id: 6,
            title: 'DevOps Engineer',
            company: 'CloudTech',
            location: 'Seattle, WA',
            type: 'Full-time',
            salary: '$130k - $160k',
            postedAt: '3 days ago',
            logo: '☁️'
          }
        ]);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-gray-100 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Jobs</h2>
          <p className="text-lg text-gray-600">Discover your next career opportunity</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer"
              onClick={() => window.location.href = `/jobs/${job.id}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-2xl">
                  {job.logo}
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  {job.type}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                {job.title}
              </h3>
              <div className="flex items-center text-gray-600 mb-4">
                <Building2 className="h-4 w-4 mr-2" />
                <span className="font-medium">{job.company}</span>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center text-gray-500 text-sm">
                  <MapPin className="h-4 w-4 mr-2" />
                  {job.location}
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <DollarSign className="h-4 w-4 mr-2" />
                  {job.salary}
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="h-4 w-4 mr-2" />
                  {job.postedAt}
                </div>
              </div>

              <button className="w-full py-3 rounded-xl border-2 border-primary-100 text-primary-600 font-semibold 
                               group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 
                               transition-all duration-200 flex items-center justify-center space-x-2">
                <span>Apply Now</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="/jobs" className="inline-flex items-center space-x-2 text-primary-600 font-semibold hover:text-primary-700">
            <span>View All Jobs</span>
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;