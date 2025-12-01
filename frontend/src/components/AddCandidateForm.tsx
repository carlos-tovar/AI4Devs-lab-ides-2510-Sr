import React, { useState } from 'react';

const AddCandidateForm: React.FC = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        education: '',
        workExperience: '',
    });
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCvFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        // File is now optional
        // if (!cvFile) {
        //     setMessage({ type: 'error', text: 'Please upload a CV.' });
        //     setLoading(false);
        //     return;
        // }

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });
        if (cvFile) {
            data.append('cv', cvFile);
        }

        try {
            const response = await fetch('http://localhost:3010/api/candidates', {
                method: 'POST',
                body: data,
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Candidate added successfully!' });
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    address: '',
                    education: '',
                    workExperience: '',
                });
                setCvFile(null);
                // Reset file input manually if needed
            } else {
                let errorMessage = 'Failed to add candidate.';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (e) {
                    console.error('Failed to parse error response:', e);
                    errorMessage = `Server Error: ${response.status} ${response.statusText}`;
                }
                setMessage({ type: 'error', text: errorMessage });
            }
        } catch (error) {
            console.error('Submission error:', error);
            setMessage({ type: 'error', text: 'Network error. Check console for details.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-candidate-form" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <h2>Add New Candidate</h2>
            {message && (
                <div style={{
                    padding: '10px',
                    marginBottom: '10px',
                    backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
                    color: message.type === 'success' ? '#155724' : '#721c24'
                }}>
                    {message.text}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>First Name *</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Last Name *</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Email *</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Address</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Education</label>
                    <textarea
                        name="education"
                        value={formData.education}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Work Experience</label>
                    <textarea
                        name="workExperience"
                        value={formData.workExperience}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>CV (PDF/DOCX)</label>
                    <input
                        type="file"
                        accept=".pdf,.docx,.doc"
                        onChange={handleFileChange}
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <button type="submit" disabled={loading} style={{ padding: '10px 20px', cursor: 'pointer' }}>
                    {loading ? 'Saving...' : 'Add Candidate'}
                </button>
            </form>
        </div>
    );
};

export default AddCandidateForm;
