import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import LoadingState from '../components/LoadingState';
import studentService from '../services/studentService';
import toast from 'react-hot-toast';
import { DashboardSkeleton } from '../components/SkeletonLoader';

const StudentProfile = () => {
  const [profile, setProfile] = useState({
    college: '',
    branch: '',
    year: '',
    cgpa: '',
    skills: '',
    resume: '',
    github: '',
    linkedin: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await studentService.getProfile();
      // Backend might return nested profile object or flat, adapting here
      const p = data.profile || {};
      setProfile({
        college: p.college || '',
        branch: p.branch || '',
        year: p.year || '',
        cgpa: p.cgpa || '',
        skills: p.skills ? p.skills.join(', ') : '',
        resume: p.resume || '',
        github: p.github || '',
        linkedin: p.linkedin || ''
      });
    } catch (err) {
      toast.error('Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (resumeFile) {
        console.log("Uploading real PDF", resumeFile);
        setUploadingResume(true);
        setUploadError(null);
        await studentService.uploadResume(resumeFile);
        setResumeFile(null); // Clear after upload
      }

      // Process skills into array before sending
      const payload = {
        ...profile,
        skills: profile.skills.split(',').map(s => s.trim()).filter(Boolean)
      };
      await studentService.updateProfile(payload);

      await fetchProfile(); // refresh from backend
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile. Please try again.');
      if (resumeFile) {
        setUploadError('Failed to upload and parse resume PDF.');
      }
    } finally {
      setSaving(false);
      setUploadingResume(false);
    }
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Profile</h1>
        <p className="text-gray-500 mt-1">Manage your academic details, skills, and links to stand out to recruiters.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        <Card>
          <CardHeader>
            <CardTitle>Academic Details</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Your current educational status and performance.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="College / University" name="college" value={profile.college} onChange={handleChange} placeholder="e.g. State University" />
              <Input label="Branch / Major" name="branch" value={profile.branch} onChange={handleChange} placeholder="e.g. Computer Science" />
              <Input label="Graduation Year" name="year" type="number" value={profile.year} onChange={handleChange} placeholder="e.g. 2025" />
              <Input label="CGPA" name="cgpa" type="number" step="0.01" value={profile.cgpa} onChange={handleChange} placeholder="e.g. 3.8" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills & Resume</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Highlight your technical skills and upload your resume.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Skills (comma separated)</label>
              <textarea 
                name="skills"
                rows="3"
                value={profile.skills}
                onChange={handleChange}
                placeholder="e.g. React, Node.js, Python, AWS"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
              />
            </div>
            
            <div className="space-y-2 p-4 bg-gray-50 rounded-md border border-gray-200">
              <label className="block text-sm font-medium text-gray-900">Upload PDF Resume (Recommended)</label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e)=>{
                    setResumeFile(e.target.files[0]);
                  }}
                  disabled={saving || uploadingResume}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary-50 file:text-primary-700
                    hover:file:bg-primary-100 disabled:opacity-50"
                />
                {uploadingResume && <span className="text-sm text-gray-500 whitespace-nowrap animate-pulse">Uploading & Analyzing...</span>}
              </div>
              {resumeFile ? (
                <div className="text-sm text-gray-600 mt-2">
                  File selected to upload: <span className="font-medium text-primary-600 break-all">{resumeFile.name}</span> (Click Save Profile to confirm)
                </div>
              ) : (profile.resume && !uploadingResume && (
                <div className="text-sm text-gray-600 mt-2">
                  Current file/link: <span className="font-medium text-primary-600 break-all">{profile.resume}</span>
                </div>
              ))}
              {uploadError && <div className="text-sm text-red-600 mt-1">{uploadError}</div>}
            </div>

            <div className="flex items-center justify-between">
              <div className="border-t border-gray-200 w-full my-4"></div>
              <span className="px-3 text-gray-400 text-xs uppercase font-medium">OR</span>
              <div className="border-t border-gray-200 w-full my-4"></div>
            </div>

            <Input label="Resume URL (Alternative)" name="resume" value={profile.resume} onChange={handleChange} placeholder="Link to your resume (Google Drive, DropBox, etc.)" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Professional Links</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Links to your professional portfolios and profiles.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="GitHub Profile URL" name="github" value={profile.github} onChange={handleChange} placeholder="https://github.com/yourusername" />
              <Input label="LinkedIn Profile URL" name="linkedin" value={profile.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/yourusername" />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={saving}>
            {saving ? 'Saving Changes...' : 'Save Profile'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StudentProfile;
