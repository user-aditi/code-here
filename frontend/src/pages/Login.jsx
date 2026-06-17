import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router'; 
import { loginUser } from "../authSlice";
import { useEffect, useState } from 'react';
import { Eye, EyeOff, Code2, Loader2, ArrowRight } from 'lucide-react';

const loginSchema = z.object({
  emailId: z.string().email("Invalid Email address"),
  password: z.string().min(8, "Password must be at least 8 characters") 
});

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

  return (
    <div className="min-h-screen flex bg-base-300 font-sans">
      {/* Left Split: Branding */}
      <div className="hidden lg:flex w-1/2 relative bg-black overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[120px]"></div>
          <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] rounded-full bg-info/10 blur-[100px]"></div>
        </div>
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <Code2 size={20} className="text-white" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-white">code-here</span>
        </div>

        <div className="relative z-10 mb-20">
          <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
            Master algorithms.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Level up your career.</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-md leading-relaxed">
            Join thousands of developers practicing coding interviews, participating in contests, and discussing solutions.
          </p>

          <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md max-w-lg font-mono text-sm text-gray-300 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
            <div className="flex gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <p><span className="text-primary">function</span> <span className="text-blue-400">twoSum</span>(nums, target) {'{'}</p>
            <p className="ml-4"><span className="text-primary">const</span> map = <span className="text-primary">new</span> <span className="text-yellow-200">Map</span>();</p>
            <p className="ml-4"><span className="text-primary">for</span> (<span className="text-primary">let</span> i = 0; i &lt; nums.length; i++) {'{'}</p>
            <p className="ml-8"><span className="text-primary">const</span> complement = target - nums[i];</p>
            <p className="ml-8"><span className="text-primary">if</span> (map.<span className="text-blue-400">has</span>(complement)) {'{'}</p>
            <p className="ml-12"><span className="text-primary">return</span> [map.<span className="text-blue-400">get</span>(complement), i];</p>
            <p className="ml-8">{'}'}</p>
            <p className="ml-8">map.<span className="text-blue-400">set</span>(nums[i], i);</p>
            <p className="ml-4">{'}'}</p>
            <p>{'}'}</p>
          </div>
        </div>
      </div>

      {/* Right Split: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
        <div className="w-full max-w-md space-y-8 relative z-10">
          <div className="text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                <Code2 size={24} className="text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight mb-2">Welcome back</h2>
            <p className="text-base-content/60">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-8">
            {error && (
              <div className="p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm text-center animate-in fade-in zoom-in-95 duration-300">
                {error}
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-base-content/80">Email</label>
              <input
                type="email"
                placeholder="name@example.com"
                className={`w-full h-12 px-4 rounded-xl bg-base-100 border ${errors.emailId ? 'border-error focus:ring-error/20' : 'border-base-content/10 focus:border-primary focus:ring-primary/20'} outline-none focus:ring-2 transition-all`}
                {...register('emailId')}
              />
              <div className={`overflow-hidden transition-all duration-300 ${errors.emailId ? 'max-h-10 opacity-100 mt-1.5' : 'max-h-0 opacity-0'}`}>
                <span className="text-error text-xs font-medium">{errors.emailId?.message}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-base-content/80">Password</label>
                <a href="#" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full h-12 pl-4 pr-12 rounded-xl bg-base-100 border ${errors.password ? 'border-error focus:ring-error/20' : 'border-base-content/10 focus:border-primary focus:ring-primary/20'} outline-none focus:ring-2 transition-all`}
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
              className="w-full h-12 mt-4 rounded-xl bg-primary text-primary-content font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:pointer-events-none disabled:transform-none shadow-lg shadow-primary/20 group"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-8">
            <p className="text-sm text-base-content/60">
              Don't have an account?{' '}
              <NavLink to="/signup" className="font-semibold text-primary hover:text-primary/80 hover:underline transition-all">
                Create one now
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;