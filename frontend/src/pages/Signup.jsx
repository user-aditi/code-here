import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router';
import { registerUser, clearError } from '../authSlice';
import { Eye, EyeOff, Code2, Loader2, ArrowRight } from 'lucide-react';

const signupSchema = z.object({
  firstName: z.string().min(3, "First name must be at least 3 characters"),
  emailId: z.string().email("Invalid Email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black font-sans relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[150px] pointer-events-none"></div>

      <div className="w-full max-w-md p-8 sm:p-10 relative z-10">
        <div className="bg-base-200/50 backdrop-blur-xl border border-base-content/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center shadow-lg shadow-primary/20 mb-6">
              <Code2 size={28} className="text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Create Account</h2>
            <p className="text-base-content/60 text-sm">Start your journey to algorithmic mastery</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm text-center animate-in fade-in zoom-in-95 duration-300">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold tracking-wide text-base-content/80 uppercase">First Name</label>
              <input
                type="text"
                placeholder="John"
                className={`w-full h-12 px-4 rounded-xl bg-base-100 border ${errors.firstName ? 'border-error focus:ring-error/20' : 'border-base-content/10 focus:border-primary focus:ring-primary/20'} text-white outline-none focus:ring-2 transition-all`}
                {...register('firstName')}
              />
              <div className={`overflow-hidden transition-all duration-300 ${errors.firstName ? 'max-h-10 opacity-100 mt-1.5' : 'max-h-0 opacity-0'}`}>
                <span className="text-error text-xs font-medium">{errors.firstName?.message}</span>
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold tracking-wide text-base-content/80 uppercase">Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                className={`w-full h-12 px-4 rounded-xl bg-base-100 border ${errors.emailId ? 'border-error focus:ring-error/20' : 'border-base-content/10 focus:border-primary focus:ring-primary/20'} text-white outline-none focus:ring-2 transition-all`}
                {...register('emailId')}
              />
              <div className={`overflow-hidden transition-all duration-300 ${errors.emailId ? 'max-h-10 opacity-100 mt-1.5' : 'max-h-0 opacity-0'}`}>
                <span className="text-error text-xs font-medium">{errors.emailId?.message}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold tracking-wide text-base-content/80 uppercase">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full h-12 pl-4 pr-12 rounded-xl bg-base-100 border ${errors.password ? 'border-error focus:ring-error/20' : 'border-base-content/10 focus:border-primary focus:ring-primary/20'} text-white outline-none focus:ring-2 transition-all`}
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 -translate-y-1/2 p-1.5 text-base-content/40 hover:text-base-content/80 transition-colors rounded-md hover:bg-base-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className={`overflow-hidden transition-all duration-300 ${errors.password ? 'max-h-10 opacity-100 mt-1.5' : 'max-h-0 opacity-0'}`}>
                <span className="text-error text-xs font-medium">{errors.password?.message}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 mt-6 rounded-xl bg-primary text-primary-content font-bold flex items-center justify-center gap-2 hover:bg-primary/90 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:pointer-events-none shadow-[0_0_20px_rgba(var(--p),0.3)] group"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Sign Up</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-8 pt-6 border-t border-base-content/10">
            <p className="text-sm text-base-content/60">
              Already have an account?{' '}
              <NavLink to="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                Sign In
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;