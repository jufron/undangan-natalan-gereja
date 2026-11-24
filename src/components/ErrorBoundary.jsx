import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Application ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[100dvh] bg-[#FBF8FD] text-[#1A0B22] flex items-center justify-center px-6">
          <div className="max-w-md w-full border-y border-[#E9E6EC] py-8 space-y-4">
            <h1 className="font-serif text-2xl font-semibold text-[#0A0010]">
              Terjadi Gangguan Sementara
            </h1>
            <p className="text-sm text-[#6B5B75] leading-relaxed">
              Mohon maaf, aplikasi mengalami kendala tak terduga. Silakan muat ulang halaman ini.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[#8A00B8] hover:bg-[#6E0094] text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Muat Ulang Halaman
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
