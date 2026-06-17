import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router';
import { registerUser } from '../authSlice';
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

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="min-h-screen flex bg-base-300 font-sans">
      {/* Right Split: Form (Order swapped for variation) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative z-10 bg-base-300">
        <div className="w-full max-w-md space-y-8 relative">
          <div className="text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <Code2 size={24} className="text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight mb-2">Create an account</h2>
            <p className="text-base-content/60">Start your journey to algorithmic mastery</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-8">
            {error && (
              <div className="p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm text-center animate-in fade-in zoom-in-95 duration-300">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-base-content/80">First Name</label>
              <input
                type="text"
                placeholder="John"
                className={`w-full h-12 px-4 rounded-xl bg-base-100 border ${errors.firstName ? 'border-error focus:ring-error/20' : 'border-base-content/10 focus:border-primary focus:ring-primary/20'} outline-none focus:ring-2 transition-all`}
                {...register('firstName')}
              />
              <div className={`overflow-hidden transition-all duration-300 ${errors.firstName ? 'max-h-10 opacity-100 mt-1.5' : 'max-h-0 opacity-0'}`}>
                <span className="text-error text-xs font-medium">{errors.firstName?.message}</span>
              </div>
            </div>
            
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
              <label className="text-sm font-semibold text-base-content/80">Password</label>
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

          <div className="text-center mt-8">
            <p className="text-sm text-base-content/60">
              Already have an account?{' '}
              <NavLink to="/login" className="font-semibold text-primary hover:text-primary/80 hover:underline transition-all">
                Sign in
              </NavLink>
            </p>
          </div>
        </div>
      </div>

      {/* Left Split: Branding (Visual on right for Signup) */}
      <div className="hidden lg:flex w-1/2 relative bg-black overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/20 blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]"></div>
          <div className="absolute top-[40%] right-[30%] w-[30%] h-[30%] rounded-full bg-info/10 blur-[100px]"></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-end gap-3">
          <span className="text-2xl font-extrabold tracking-tight text-white">code-here</span>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Code2 size={20} className="text-white" />
          </div>
        </div>

        <div className="relative z-10 mb-20 flex flex-col items-end text-right">
          <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
            Think.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary to-secondary">Code.</span><br/>
            Conquer.
          </h1>
          <p className="text-gray-400 text-lg max-w-md leading-relaxed">
            Your personal playground for algorithmic problem solving. Ready to crack the interview?
          </p>

          <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md max-w-lg font-mono text-sm text-gray-300 shadow-2xl relative overflow-hidden text-left group w-full">
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-primary to-secondary"></div>
            <div className="flex gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <p><span className="text-secondary">class</span> <span className="text-blue-400">Solution</span> {'{'}</p>
            <p className="ml-4"><span className="text-secondary">public</span> <span className="text-blue-400">int</span> maxProfit(<span className="text-blue-400">int</span>[] prices) {'{'}</p>
            <p className="ml-8"><span className="text-blue-400">int</span> minPrice = <span className="text-yellow-200">Integer</span>.MAX_VALUE;</p>
            <p className="ml-8"><span className="text-blue-400">int</span> maxProfit = 0;</p>
            <p className="ml-8"><span className="text-secondary">for</span> (<span className="text-blue-400">int</span> price : prices) {'{'}</p>
            <p className="ml-12"><span className="text-secondary">if</span> (price &lt; minPrice) minPrice = price;</p>
            <p className="ml-12"><span className="text-secondary">else if</span> (price - minPrice &gt; maxProfit)</p>
            <p className="ml-16">maxProfit = price - minPrice;</p>
            <p className="ml-8">{'}'}</p>
            <p className="ml-8"><span className="text-secondary">return</span> maxProfit;</p>
            <p className="ml-4">{'}'}</p>
            <p>{'}'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;