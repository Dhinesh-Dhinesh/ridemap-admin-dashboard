import { useForm, SubmitHandler } from 'react-hook-form';
import jwt_decode from "jwt-decode";

//~ Firebase
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';
import CircularProgress from '@mui/material/CircularProgress';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

type FormData = {
    Email: string;
    Password: string;
};

const Login: React.FC = () => {
    const { register, handleSubmit, formState: { errors }, setError } = useForm<FormData>();

    const [localLoading, setLocalLoading] = useState<boolean>(false);

    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const onSubmit: SubmitHandler<FormData> = (data) => {
        setLocalLoading(true)

        signInWithEmailAndPassword(auth, data.Email, data.Password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log(user)
                // ...
                setLocalLoading(false)
            })
            .catch((error) => {
                console.log(error.code)
                switch (error.code) {
                    case 'auth/invalid-email':
                        setError('Email', { message: 'Invalid Email', type: 'invalid-email' })
                        break;
                    case 'auth/user-not-found':
                        setError('Email', { message: 'User not found', type: 'user-not-found' })
                        break;
                    case 'auth/wrong-password':
                        setError('Password', { message: 'Wrong Password', type: 'wrong-password' })
                        break;
                    default:
                        break;
                }
                setLocalLoading(false)
            }).finally(() => {
                setLocalLoading(false)
            });
    }

    const { loading } = useAppSelector((state) => state.auth);

    // navigate user ot dashboard if already logged in

    const navigate = useNavigate();

    useEffect(() => {
        const unSubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                user.getIdToken().then((token) => {
                    // decode token and get custom claim
                    const decodedToken = jwt_decode(token);
                    const { admin }: any = decodedToken;
                    if (admin) {
                        navigate('/dashboard')
                    } else {
                        alert('You are not authorized to access this page')
                    }
                })
            }
        });

        return () => unSubscribe();
    }, [navigate])

    if (localLoading || loading) return <div className='flex justify-center items-center h-screen'><CircularProgress /></div>

    return (
        <div className='h-screen w-screen'>
            <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
                <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
                    <h1 className="text-3xl font-semibold text-center text-purple-700">
                        Ridemap
                    </h1>
                    <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-2">
                            <label
                                htmlFor="email"
                                className="block text-sm font-semibold text-gray-800"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                {...register("Email", { required: true, pattern: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i })}
                                className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            />
                            {errors?.Email?.type === "required" && <p className='text-red-600 text-sm mt-2'>* required</p>}
                            {errors?.Email?.type === "pattern" && <p className='text-red-600 text-sm mt-2'>* Enter a valid email</p>}
                            {errors?.Email?.type === "invalid-email" && <p className='text-red-600 text-sm mt-2'>* Enter a valid email</p>}
                            {errors?.Email?.type === "user-not-found" && <p className='text-red-600 text-sm mt-2'>* User not found</p>}
                        </div>
                        <div className="mb-2">
                            <label
                                htmlFor="password"
                                className="block text-sm font-semibold text-gray-800"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    {...register("Password", { required: true, pattern: /^.{8,}$/i })}
                                    className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                />
                                <InputAdornment position="end" className="absolute top-5 right-4">
                                    <IconButton
                                        onClick={handleTogglePasswordVisibility}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                                {errors?.Password?.type === "required" && <p className='text-red-600 text-sm mt-2'>* required</p>}
                                {errors?.Password?.type === "pattern" && <p className='text-red-600 text-sm mt-2'>* Password need to be eight characters long.</p>}
                                {errors?.Password?.type === "wrong-password" && <p className='text-red-600 text-sm mt-2'>* Wrong password.</p>}
                            </div>
                        </div>
                        <a
                            href="#"
                            className="text-xs text-purple-600 hover:underline"
                        >
                            Forget Password?
                        </a>
                        <div className="mt-6">
                            <button
                                type="submit"
                                className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600">
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;