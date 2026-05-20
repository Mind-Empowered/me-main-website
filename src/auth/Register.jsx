import { useState } from 'react';

const Register = () => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
	});

	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage('');

		if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
			setMessage('Please fill in all fields');
			setLoading(false);
			return;
		}

		if (formData.password !== formData.confirmPassword) {
			setMessage('Passwords do not match');
			setLoading(false);
			return;
		}

		console.log('Form submitted:', formData);
		setMessage('Registration successful! (Mock)');
		setLoading(false);
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-[#fdfbf5] to-[#f5f0de] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
			<div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border-2 border-[#ff7612]/20">
				<h1 className="text-3xl font-bold text-[#461711] mb-2 text-center font-serif">Register</h1>
				<p className="text-gray-600 text-center mb-8">Join Mind Empowered</p>

				<form onSubmit={handleSubmit} className="space-y-5">
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
						<input
							type="text"
							name="name"
							value={formData.name}
							onChange={handleChange}
							placeholder="Your full name"
							className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#ff7612] focus:outline-none transition"
						/>
					</div>

					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
						<input
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							placeholder="your@email.com"
							className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#ff7612] focus:outline-none transition"
						/>
					</div>

					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
						<input
							type="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							placeholder="Create a password"
							className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#ff7612] focus:outline-none transition"
						/>
					</div>

					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
						<input
							type="password"
							name="confirmPassword"
							value={formData.confirmPassword}
							onChange={handleChange}
							placeholder="Confirm your password"
							className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#ff7612] focus:outline-none transition"
						/>
					</div>

					{message && (
						<p className={`text-sm font-semibold text-center ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
							{message}
						</p>
					)}

					<button
						type="submit"
						disabled={loading}
						className="w-full py-3 bg-[#461711] hover:bg-[#ff7612] text-white font-bold rounded-lg transition-colors duration-200 disabled:opacity-50"
					>
						{loading ? 'Registering...' : 'Register'}
					</button>
				</form>

				<p className="text-center text-gray-600 mt-6 text-sm">
					Already have an account? <a href="/" className="text-[#ff7612] font-semibold hover:underline">Back to Home</a>
				</p>
			</div>
		</div>
	);
};

export default Register;