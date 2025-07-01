import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import baseurl, { logo } from './CrudOperations/customURl';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email || !token) {
      setError('Invalid or expired reset link.');
      return;
    }

    if (password !== passwordConfirmation) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post(`${baseurl}/api/dboy/resetPassword`, {
        email,
        token,
        password,
        password_confirmation: passwordConfirmation,
      });

      if (response.data.message === 'Password has been reset successfully') {
        setMessage(response.data.message);
        setPassword('');
        setPasswordConfirmation('');
        setTimeout(() => {
          window.close();
        }, 2000);
      } else {
        setMessage(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 mt-10 border rounded shadow">
      <div className="flex justify-center mb-4">
        <img src={logo} alt="logo" className="h-12" />
      </div>
      <h2 className="text-xl font-semibold mb-4 text-center">Delivery Executive Reset Password</h2>

      {message && <p className="text-green-600 text-center">{message}</p>}
      {error && <p className="text-red-600 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="New Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          className="w-full p-2 border rounded"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
