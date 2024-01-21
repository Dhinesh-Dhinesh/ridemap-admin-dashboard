// MUI
import { Alert, Box, TextField, useMediaQuery } from "@mui/material"
import { BaseButton } from "../../../components/BaseButton";

// MUI icons
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// Router
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// React Hook Form
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { LoadingButton } from "@mui/lab";
import useApi from "../../../util/api";

import SnackBar from '../../../components/SnackBar';
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { getAdmins } from "../../../redux/features/instituteSlice";

const formDataProps = [
    'name',
    'phone',
    'email',
    'password',
    'confirmPassword',
] as const;

type FormData = {
    [K in typeof formDataProps[number]]: string;
};

type snackBar = {
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning" | undefined;
}

const CreateAdmin: React.FC = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [createUserLoading, setCreateUserLoading] = useState(false);
    const [snackBar, setSnackBar] = useState<snackBar>({
        open: false,
        message: "",
        severity: undefined,
    });

    const isNonMobile = useMediaQuery("(min-width:600px)");
    const institute = useAppSelector((state) => state?.auth?.user?.institute);
    const api = useApi();
    const navigate = useNavigate()
    const dispatch = useAppDispatch();

    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    const validatePassword = (value: string) => {
        const confirmPassword = getValues("password");
        if (value !== confirmPassword) {
            return "Passwords do not match";
        }
        return true;
    };

    // form
    const { handleSubmit, control, getValues, reset } = useForm<FormData>();

    const onSubmit: SubmitHandler<FormData> = (data) => {

        setCreateUserLoading(true);

        const adminData = {
            name: data.name.trim(),
            email: data.email.trim(),
            phone: data.phone.trim(),
            password: data.password,
            institute
        }

        api.post("admin/create", adminData).then(data => {
            console.log(data)
            dispatch(getAdmins(institute as string));
            reset();
            setSnackBar({
                open: true,
                message: "Admin account successfully created",
                severity: "success",
            });
        }).catch(err => {
            console.log(err)
            if (err.response?.data?.code === "auth/email-already-exists") {
                setSnackBar({
                    open: true,
                    message: "Email already exists",
                    severity: "warning"
                })
            } else {
                setSnackBar({
                    open: true,
                    message: "Something went wrong",
                    severity: "error",
                });
            }
        }).finally(() => {
            setCreateUserLoading(false);
            setTimeout(() => {
                setSnackBar((prev) => ({ ...prev, open: false }))
            }, 1000);
        })
    };

    return (
        <Box m="20px">

            {/* Header */}

            <Box display="flex" justifyContent="space-between" alignItems="center">
                <div className='mb-4'>
                    <h1 className="text-3xl font-bold">Create Admin</h1>
                    <h4 className="text-l font-semibold mt-3 ml-0.5">Create a new admin profile</h4>
                </div>
                <BaseButton onClick={() => navigate("/admin")}>
                    <div className="flex justify-center items-center">
                        <ArrowBackIosIcon fontSize="small" />
                        <p>Back</p>
                    </div>
                </BaseButton>
            </Box>

            {/* Content */}

            <Box
                component="form"
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                    boxShadow: 4, padding: "1rem", borderRadius: "10px",
                    "& > div": {
                        gridColumn: isNonMobile ? undefined : "span 4",
                    },
                }}
                autoComplete='off'
                onSubmit={handleSubmit(onSubmit)}
            >
                <Controller
                    name="name"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                            label="Name"
                            variant="outlined"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            error={!!error}
                            helperText={error ? error.message : null}
                            sx={{ gridColumn: "span 2" }}
                        />
                    )}
                    rules={{ required: 'Required', pattern: { value: /^[A-Za-z/.\s]+$/i, message: "Only alphabets are allowed" } }}
                />
                <Controller
                    name="phone"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                            label="Phone"
                            type='number'
                            variant="outlined"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            error={!!error}
                            helperText={error ? error.message : null}
                            sx={{ gridColumn: "span 2" }}
                            inputProps={{
                                inputMode: "numeric",
                                innerspinbutton: "false",
                            }}
                        />
                    )}
                    rules={{ required: 'Required', pattern: { value: /^[0-9]{10}$/i, message: "Invalid phone number" } }}
                />
                <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                            label="Email"
                            variant="outlined"
                            value={value}
                            onChange={(e) => onChange(e.target.value.toLowerCase())}
                            error={!!error}
                            helperText={error ? error.message : null}
                            sx={{ gridColumn: "span 4" }}
                        />
                    )}
                    rules={{ required: 'Required', pattern: { value: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i, message: "Invalid email" } }}
                />
                <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    rules={{
                        required: "Password is required",
                        minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters long",
                        }
                    }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                            label="Password"
                            variant="outlined"
                            type={showPassword ? "text" : "password"}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            error={!!error}
                            helperText={error ? error.message : null}
                            sx={{ gridColumn: "span 2" }}
                            InputProps={{
                                endAdornment: (
                                    <IconButton onClick={handleTogglePassword} edge="end">
                                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                    </IconButton>
                                ),
                            }}
                        />
                    )}
                />
                <Controller
                    name="confirmPassword"
                    control={control}
                    defaultValue=""
                    rules={{
                        required: "Please confirm your password",
                        validate: validatePassword,
                    }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                            label="Confirm Password"
                            variant="outlined"
                            type={showPassword ? "text" : "password"}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            error={!!error}
                            helperText={error ? error.message : null}
                            sx={{ gridColumn: "span 2" }}
                            InputProps={{
                                endAdornment: (
                                    <IconButton onClick={handleTogglePassword} edge="end">
                                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                    </IconButton>
                                ),
                            }}
                        />
                    )}
                />
                <div>
                    <LoadingButton
                        fullWidth
                        sx={{ marginTop: "1.5rem" }}
                        color="primary"
                        type="submit"
                        variant="contained"
                        loading={createUserLoading}
                    >
                        Create
                    </LoadingButton>
                </div>
            </Box>
            <SnackBar isOpen={snackBar.open}>
                <div className="w-full">
                    <Alert severity={snackBar.severity} variant='filled'>{snackBar.message}</Alert>
                </div>
            </SnackBar>
        </Box>
    )
}

export default CreateAdmin;