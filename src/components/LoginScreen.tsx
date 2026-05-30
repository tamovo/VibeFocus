import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #FFF0F8 0%, #FAF0FF 30%, #F0F8FF 60%, #FFF8F0 100%)',
      }}
    >
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute rounded-full blur-3xl opacity-25"
          style={{ width: '400px', height: '400px', top: '-100px', right: '-100px', background: 'radial-gradient(circle, #F4A7C3, #C9A7F4)' }}
        />
        <div
          className="absolute rounded-full blur-3xl opacity-20"
          style={{ width: '350px', height: '350px', bottom: '-80px', left: '-80px', background: 'radial-gradient(circle, #C9A7F4, #A7C4F4)' }}
        />
      </div>

      <div
        className="relative flex flex-col items-center gap-6 px-10 py-12 rounded-3xl"
        style={{
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(201,167,244,0.3)',
          boxShadow: '0 8px 40px rgba(201,167,244,0.2)',
          maxWidth: '380px',
          width: '100%',
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-5xl">🎨</span>
          <h1
            className="text-3xl font-extrabold"
            style={{ color: '#7C3F8E', fontFamily: 'Quicksand, sans-serif' }}
          >
            VibeFocus
          </h1>
          <p
            className="text-sm opacity-60 text-center"
            style={{ color: '#7C3F8E', fontFamily: 'Nunito, sans-serif' }}
          >
            Sign in to sync your progress across devices ✨
          </p>
        </div>

        <div
          className="w-full h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(201,167,244,0.4), transparent)' }}
        />

        <div className="flex flex-col items-center gap-3 w-full">
          <p
            className="text-xs opacity-50 text-center"
            style={{ fontFamily: 'Nunito, sans-serif', color: '#7C3F8E' }}
          >
            Continue with your Google account
          </p>
          <GoogleLogin
            onSuccess={res => {
              if (res.credential) login(res.credential);
            }}
            onError={() => console.error('Google login failed')}
            shape="pill"
            theme="outline"
            size="large"
            text="continue_with"
          />
        </div>

        <p
          className="text-xs opacity-30 text-center"
          style={{ fontFamily: 'Nunito, sans-serif', color: '#7C3F8E' }}
        >
          Your data is saved securely to the cloud
        </p>
      </div>
    </div>
  );
}
