import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ShipWheelIcon } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { axiosInstance } from '../lib/axios';

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/auth/signup", data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  const handleSignup = (e) => {
    e.preventDefault();
    mutate(signupData);
  }

  return (
    <div className='h-screen flex items-center justify-center p-4 sm:p-6 md:p-8' data-theme="forest">
      <div className='border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden'>

        {/* SIGNUP FORM LEFT SIDE */}
        <div className='w-full lg:w-1/2 p-4 sm:p-8 flex flex-col'>
          <div className='mb-4 flex items-center justify-start gap-2'>
            <ShipWheelIcon className='size-9 text-primary' />
            <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>
              G-CHAT
            </span>
          </div>
          {/* ERROR MESSAGE */}
          {error && (
            <div className='alert alert-error mb-4'>
              <span>{error.response.data.message}</span>
            </div>
          )}
          <div className="w-full">
            <form onSubmit={handleSignup}>
              <div className="space-y-4">
                <div>
                  <h2 className='text-xl font-semibold'>Create an Account</h2>
                  <p className='text-sm opacity-70'>
                    Join the G-CHAT community and start chatting with your friends.
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Full Name */}
                  <div className='form-control w-full'>
                    <label className='label'>
                      <span className="label-text">Full Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder='Enter your full name'
                      className='input input-bordered w-full'
                      value={signupData.fullName}
                      onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className='form-control w-full'>
                    <label className='label'><span>Email</span></label>
                    <input
                      type="email"
                      placeholder='Enter your email'
                      className='input input-bordered w-full'
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className='form-control w-full'>
                    <label className='label'><span>Password</span></label>
                    <input
                      type="password"
                      placeholder='*********'
                      className='input input-bordered w-full'
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      required
                    />
                    <p className='text-xs opacity-70 mt-1'>
                      Password must be at least 8 characters long
                    </p>
                  </div>

                  {/* Terms Checkbox */}
                  <div className='form-control'>
                    <label className='label cursor-pointer justify-start gap-2'>
                      <input type="checkbox" className='checkbox checkbox-sm' required />
                      <span className='text-xs leading-tight'>
                        I agree to the{' '}
                        <span className='text-primary hover:underline'>terms of services</span> and{' '}
                        <span className='text-primary hover:underline'>privacy policy</span>.
                      </span>
                    </label>
                  </div>
                </div>

                {/* <button className='btn btn-primary w-full' type='submit'>
                  {isPending ? "Signing up..." : "Create Account"}
                </button> */}

                <button className='btn btn-primary w-full' type='submit'>
                  {isPending ? (
                    <>
                      <span className='loading loading-spinner loading-xs'></span>
                      Loading
                    </>
                  ) : (
                    "Create Account"
                  )} 

                </button>
                {error && <p className="text-red-500 text-sm mt-2">{error.message || "Signup failed. Please try again."}</p>}

                <div className='text-center mt-4'>
                  <p className='text-xs'>
                    Already have an account?{' '}
                    <Link to="/login" className='text-primary hover:underline'>
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>

            </form>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="/i.png" alt="Language connection illustration" className="w-full h-full" />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">Connect with friends/loved ones partners worldwide</h2>
              <p className="opacity-70">
                Practice conversations, make friends, and improve your language skills together
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SignUpPage;
