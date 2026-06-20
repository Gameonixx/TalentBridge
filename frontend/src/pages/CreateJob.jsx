import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jobService from '../services/jobService';
import Input from '../components/Input';
import Button from '../components/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Briefcase, MapPin, DollarSign, List, AlertCircle, Calendar, GraduationCap, Building } from 'lucide-react';
import { useParams } from 'react-router-dom';

const CreateJob = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    salaryRange: '', // legacy
    company: '',
    ctc: '',
    cgpaCriteria: '',
    deadline: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isEditMode) {
      fetchJobDetails();
    }
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const job = await jobService.getJobById(id);
      setFormData({
        title: job.title || '',
        description: job.description || '',
        requirements: job.requirements ? job.requirements.join(', ') : '',
        location: job.location || '',
        salaryRange: job.salaryRange || '',
        company: job.company || '',
        ctc: job.ctc || '',
        cgpaCriteria: job.cgpaCriteria || '',
        deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : ''
      });
    } catch (err) {
      setError('Failed to fetch job details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.requirements || !formData.company) {
      setError('Title, company, description and requirements are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        requirements: formData.requirements.split(',').map(r => r.trim())
      };

      if (isEditMode) {
        await jobService.updateJob(id, payload);
      } else {
        await jobService.createJob(payload);
      }
      navigate('/recruiter/jobs');
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} job posting`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{isEditMode ? 'Edit Job Posting' : 'Post a New Job'}</h1>
          <p className="text-gray-500 mt-1">{isEditMode ? 'Update your existing job posting details.' : 'Create a new job posting to attract top student talent.'}</p>
        </div>
        <Button variant="ghost" onClick={() => navigate('/recruiter/jobs')}>
          Cancel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>

        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-6 bg-red-50 text-red-700 p-3 rounded-md flex items-center text-sm border border-red-100">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Job Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Frontend Developer"
                icon={Briefcase}
              />
              <Input
                label="Company Name"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Google"
                icon={Building}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Description
              </label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className="block w-full sm:text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 p-3"
                placeholder="Describe the role, responsibilities, and team..."
              ></textarea>
            </div>

            <Input
              label="Requirements (comma separated)"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="React, Node.js, 3+ years experience"
              icon={List}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Remote / San Francisco"
                icon={MapPin}
              />
              <Input
                label="CTC (Package)"
                name="ctc"
                value={formData.ctc}
                onChange={handleChange}
                placeholder="e.g. 24 LPA"
                icon={DollarSign}
              />
              <Input
                label="Minimum CGPA"
                name="cgpaCriteria"
                type="number"
                step="0.01"
                value={formData.cgpaCriteria}
                onChange={handleChange}
                placeholder="e.g. 8.0"
                icon={GraduationCap}
              />
              <Input
                label="Application Deadline"
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleChange}
                icon={Calendar}
              />
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (isEditMode ? 'Update Job Posting' : 'Publish Job Posting')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateJob;
