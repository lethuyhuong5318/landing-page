'use client';

import React, { ReactNode } from 'react';

interface WebGLErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class WebGLErrorBoundary extends React.Component<WebGLErrorBoundaryProps, State> {
  constructor(props: WebGLErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('WebGL Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div style={{
            padding: '24px',
            textAlign: 'center',
            background: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid #d9e4ec',
            marginTop: '16px',
          }}>
            <p style={{ margin: '0 0 12px 0', fontWeight: 600, color: '#102a43' }}>
              ❌ Không thể tải 3D viewer
            </p>
            <p style={{ margin: 0, fontSize: '14px', color: '#627d98' }}>
              Trình duyệt của bạn không hỗ trợ WebGL hoặc có lỗi.
              Vui lòng dùng trình duyệt khác hoặc cập nhật trình duyệt.
            </p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
