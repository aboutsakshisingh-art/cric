import React from 'react';
import { useForm } from 'react-hook-form';

const CreateMatchModal = ({ isOpen, onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      team1Name: '',
      team2Name: '',
      overs: 20,
      matchNo: '',
      tossWonBy: 'team1',
      optedTo: 'Bat',
      matchTied: 'No',
      ballsPerOver: 6,
      matchType: 'T20',
    },
  });

  const handleFormSubmit = (data) => {
    if (onSubmit) {
      onSubmit(data);
    }
    reset();
    onClose();
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Create Match</h2>
          
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            {/* Team 1 Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Team 1 Name
              </label>
              <input
                type="text"
                {...register('team1Name', { required: 'Team 1 name is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Team 1 Name"
              />
              {errors.team1Name && (
                <p className="text-red-500 text-xs mt-1">{errors.team1Name.message}</p>
              )}
            </div>

            {/* Team 2 Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Team 2 Name
              </label>
              <input
                type="text"
                {...register('team2Name', { required: 'Team 2 name is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Team 2 Name"
              />
              {errors.team2Name && (
                <p className="text-red-500 text-xs mt-1">{errors.team2Name.message}</p>
              )}
            </div>

            {/* Match No. */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Match No.
              </label>
              <input
                type="text"
                {...register('matchNo', { required: 'Match number is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 1, 2, 3"
              />
              {errors.matchNo && (
                <p className="text-red-500 text-xs mt-1">{errors.matchNo.message}</p>
              )}
            </div>

            {/* Overs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Overs
              </label>
              <input
                type="number"
                {...register('overs', { 
                  required: 'Overs is required',
                  min: { value: 1, message: 'Minimum 1 over' },
                  max: { value: 50, message: 'Maximum 50 overs' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="50"
              />
              {errors.overs && (
                <p className="text-red-500 text-xs mt-1">{errors.overs.message}</p>
              )}
            </div>

            {/* Toss Won By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Toss Won By
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="team1"
                    {...register('tossWonBy')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Team 1</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="team2"
                    {...register('tossWonBy')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Team 2</span>
                </label>
              </div>
            </div>

            {/* Opted To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opted To
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="Bat"
                    {...register('optedTo')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Bat</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="Bowl"
                    {...register('optedTo')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Bowl</span>
                </label>
              </div>
            </div>

            {/* Match Tied */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Match Tied
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="Yes"
                    {...register('matchTied')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="No"
                    {...register('matchTied')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">No</span>
                </label>
              </div>
            </div>

            {/* Balls Per Over */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Balls Per Over
              </label>
              <select
                {...register('ballsPerOver')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={4}>4 balls</option>
                <option value={5}>5 balls</option>
                <option value={6}>6 balls</option>
                <option value={8}>8 balls</option>
              </select>
            </div>

            {/* Match Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Match Type
              </label>
              <select
                {...register('matchType')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="T20">T20</option>
                <option value="ODI">ODI</option>
                <option value="Test">Test</option>
                <option value="Friendly">Friendly</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateMatchModal;
