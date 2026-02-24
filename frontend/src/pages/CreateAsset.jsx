import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { ThemeContext } from '../components/ThemeContext'
import Navbar from '../components/Navbar'
import { createAsset } from '../api/assetAPI'
import { successToast, errorToast } from '../utils/toast'

function CreateAsset() {
  const { theme } = useContext(ThemeContext)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    visibility: 'public',
    file: null
  })
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'video/mp4', 'video/webm']
      if (!validTypes.includes(file.type)) {
        errorToast('Please select a valid image or video file')
        return
      }

      
      if (file.size > 50 * 1024 * 1024) {
        errorToast('File size should be less than 50MB')
        return
      }

      setFormData(prev => ({
        ...prev,
        file
      }))

      
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.file) {
      errorToast('Please select a file')
      return
    }

    setLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('visibility', formData.visibility)
      formDataToSend.append('file', formData.file)

      await createAsset(formDataToSend)
      successToast('Asset created successfully!')
      navigate('/my-assets')
    } catch (error) {
      errorToast(error.response?.data?.message || 'Failed to create asset')
    } finally {
      setLoading(false)
    }
  }

  const isDark = theme === 'dark'

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`rounded-lg shadow-lg p-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Create New Asset
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className={`block mb-2 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Enter asset title"
              />
            </div>

            <div className="mb-6">
              <label className={`block mb-2 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Enter asset description"
              />
            </div>

            <div className="mb-6">
              <label className={`block mb-2 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Visibility *
              </label>
              <select
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div className="mb-6">
              <label className={`block mb-2 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                File (Image or Video) *
              </label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Supported formats: JPG, PNG, GIF, MP4, WebM (Max 50MB)
              </p>
            </div>

            {preview && (
              <div className="mb-6">
                <label className={`block mb-2 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Preview
                </label>
                <div className="border rounded-lg overflow-hidden">
                  {formData.file?.type.startsWith('video/') ? (
                    <video
                      src={preview}
                      controls
                      className="w-full max-h-96 object-contain"
                    />
                  ) : (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full max-h-96 object-contain"
                    />
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {loading ? 'Creating...' : 'Create Asset'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateAsset
