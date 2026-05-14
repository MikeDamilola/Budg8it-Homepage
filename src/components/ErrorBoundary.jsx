import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-[#F5F2FF] px-6 py-16 text-[#0F172A]">
          <h1 className="text-xl font-bold">Something went wrong</h1>
          <p className="mt-2 text-sm text-gray-600">
            The app hit a runtime error. Open the browser devtools console for details, then try a hard
            refresh (Ctrl+Shift+R).
          </p>
          <pre className="mt-6 max-h-64 overflow-auto rounded-lg bg-white p-4 text-xs text-red-600 shadow">
            {String(this.state.error)}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}
