import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { ThemeContext } from '../components/ThemeContext'
import Navbar from '../components/Navbar'
import { getMyAssets } from '../api/assetAPI'
import { errorToast } from '../utils/toast'

function MyAssets() {
  const { theme } = useContext(ThemeContext)
  const navigate = useNavigate()

  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const isDark = theme === 'dark'

  useEffect(() => {
    fetchMyAssets()
  }, [page])

  const fetchMyAssets = async () => {
    setLoading(true)
    try {
      const response = await getMyAssets({ page, limit: 9 })
      setAssets(response.assets)
      setTotalPages(response.totalPages)
    } catch (error) {
      errorToast(error.response?.data?.message || 'Failed to fetch your assets')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className={`rounded-lg shadow-lg p-6 mb-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center">
            <div>
              <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                My Assets
              </h2>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Manage all the assets you've uploaded
              </p>
            </div>
            <button
              onClick={() => navigate('/create-asset')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              + Create New Asset
            </button>
          </div>
        </div>

        {/* Assets Grid */}
        <div className={`rounded-lg shadow-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : assets.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📁</div>
              <p className={`text-lg mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                You haven't uploaded any assets yet
              </p>
              <button
                onClick={() => navigate('/create-asset')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upload Your First Asset
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assets.map((asset) => (
                  <div
                    key={asset._id}
                    className={`rounded-lg overflow-hidden shadow-lg ${
                      isDark ? 'bg-gray-700' : 'bg-white'
                    }`}
                  >
                    <div className="aspect-video bg-gray-200">
                      {asset.type === 'video' ? (
                        <video
                          src={asset.url}
                          controls
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={asset.url}
                          alt={asset.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {asset.title}
                        </h4>
                        <span className={`text-xs px-2 py-1 rounded ${
                          asset.visibility === 'public' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {asset.visibility}
                        </span>
                      </div>
                      {asset.description && (
                        <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {asset.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {new Date(asset.createdAt).toLocaleDateString()}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          asset.type === 'video' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {asset.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded-lg ${
                      page === 1
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    Previous
                  </button>
                  <span className={isDark ? 'text-white' : 'text-gray-900'}>
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    className={`px-4 py-2 rounded-lg ${
                      page === totalPages
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyAssets
