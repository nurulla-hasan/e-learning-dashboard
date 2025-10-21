"use client"

import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"

interface ErrorCardProps {
  title?: string
  message?: string
  onRetry?: () => void
  onGoHome?: () => void
  onGoBack?: () => void
  showRetry?: boolean
  showGoHome?: boolean
  showGoBack?: boolean
}

const ServerErrorCard = ({
  title = "Something went wrong",
  message = "We encountered an unexpected error. Please try again or contact support if the problem persists.",
  onGoBack,
  showRetry = true,
  showGoHome = true,
  showGoBack = false,
}: ErrorCardProps = {}) => {

    const location = useLocation();
    const pathname = location.pathname;
    const navigate = useNavigate();

    const handleTry = () => {
        window.location.href=pathname
    }

    const handleGoHome = () => {
      navigate("/")
    }

  


  return (
    <div className="w-full h-[80%] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
              {/* <div className="w-full max-w-md"> */}
      <div className="w-full max-w-xl">
        {/* Main Error Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white mb-2">{title}</h1>
            <div className="w-12 h-1 bg-white/30 rounded-full mx-auto"></div>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            <p className="text-gray-600 text-center leading-relaxed mb-8">{message}</p>

            {/* Action Buttons */}
            <div className="space-y-3">
              {showRetry && (
                <button
                  onClick={handleTry}
                  className="w-full cursor-pointer bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
              )}

              <div className="flex gap-3">
                {showGoBack && (
                  <button
                    onClick={onGoBack}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Go Back
                  </button>
                )}

                {showGoHome && (
                  <button
                    onClick={handleGoHome}
                    className={`${showGoBack ? "flex-1" : "w-full"} bg-gray-100 cursor-pointer hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2`}
                  >
                    <Home className="w-4 h-4" />
                    Go Home
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Error Code (Optional) */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400 font-mono">Error Code: 500</p>
        </div>
      </div>
    </div>
  )
}

export default ServerErrorCard;