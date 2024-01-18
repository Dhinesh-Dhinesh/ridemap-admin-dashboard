import { useState, useEffect } from 'react';

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import useMediaQuery from "@mui/material/useMediaQuery";
import FormHelperText from '@mui/material/FormHelperText';
import { AutocompleteRenderInputParams } from '@mui/material/Autocomplete/Autocomplete';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { LoadingButton } from "@mui/lab";
import { InputAdornment, Tooltip } from "@mui/material";
import Zoom from '@mui/material/Zoom';


// mui icons
import InfoIcon from '@mui/icons-material/Info';

// Firebase
import { collection, getCountFromServer, query, where } from 'firebase/firestore';
import { db } from '../../firebase';

// form control
import { useForm, SubmitHandler, Controller } from 'react-hook-form';

// Date Picker
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

//& Redux
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getDepartments, getBusses } from '../../redux/features/instituteSlice';
import { shallowEqual } from 'react-redux';

//! types
import { useLocation } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import { parseValidUpto } from '../../util/dateFormatter';

type FormData = {
    name: string;
    fatherName: string;
    emailOrPhone: string;
    phone: string;
    enrollNo: string;
    address: string;
    city: string;
    busStop: string;
    busNo: string | null;
    department: string | null;
    validUpto: string | Dayjs;
    gender: string;
}

export default function editUser() {

    // form
    const [busNo, setBusNo] = useState<string>('')
    const [busNoCount, setBusNoCount] = useState<number>(0);
    const [sumbitLoading, setSubmitLoading] = useState<boolean>(false);
    const { handleSubmit, control, setValue, formState, reset, setError } = useForm<FormData>();

    const location = useLocation();
    const isNonMobile = useMediaQuery("(min-width:600px)");

    // redux
    const dispatch = useAppDispatch();
    const { institute, departments, busses } = useAppSelector((state) => {
        return {
            departments: state?.institute?.departments,
            busses: state.institute?.busses,
            institute: state?.auth?.admin?.institute,
        }
    },
        shallowEqual
    );

    // handlers
    const handleEmailOrPhoneChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = event.target.value;

        if (formState.isDirty && value.match(/(^\d{10}$)/)) {
            setValue('phone', value, { shouldValidate: true });
        }
    };

    const onSubmit: SubmitHandler<FormData> = (formData) => {

        setSubmitLoading(true);

        console.log(formData)

        alert(formData)

        setBusNo('')
        reset();

        setSubmitLoading(false)
    }


    // gets the state from the state object passed from the previous page
    useEffect(() => {
        if (location.state) {

            let values: FormData = location.state.userData;

            let parsedValidUpto = parseValidUpto(values.validUpto as string)

            reset({
                name: values.name,
                fatherName: values.fatherName,
                emailOrPhone: values.emailOrPhone,
                phone: values.phone,
                enrollNo: values.enrollNo,
                address: values.address,
                city: values.city,
                busStop: values.busStop,
                busNo: values.busNo,
                department: values.department,
                validUpto: dayjs(parsedValidUpto),
                gender: values.gender
            })

            console.log(values.validUpto)
        }
    }, [location]);

    // for setting value of departments & busses
    useEffect(() => {
        if (institute) {
            if (!departments) {
                dispatch(getDepartments(institute))
            }
            if (!busses) {
                dispatch(getBusses(institute))
            }
        }
    }, [institute, dispatch]);

    // for get the count of the selected busno
    useEffect(() => {
        if (institute) {
            const getBusNoCount = async () => {
                try {
                    const usersCollection = collection(db, `institutes/${institute}/users`);
                    const q = query(usersCollection, where('busNo', '==', busNo));

                    const snapshot = await getCountFromServer(q);
                    setBusNoCount(snapshot.data().count);
                    console.log(snapshot.data().count);
                } catch (err) {
                    console.log(err)
                }
            }
            setBusNoCount(0)
            getBusNoCount();
        }
    }, [busNo])

    return (
        <Box m="20px">
            <div className='mb-4'>
                <h1 className="text-3xl font-bold">Edit User</h1>
                <h4 className="text-l font-semibold mt-3 ml-0.5">Edit user data</h4>
            </div>
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
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                            sx={{ gridColumn: "span 2" }}
                        />
                    )}
                    rules={{
                        required: 'Required', pattern: {
                            value: /^[A-Za-z.]+(\s[A-Za-z.]+)*$/i,
                            message: "Only alphabets are allowed with spaces between words"
                        }
                    }}
                />
                <Controller
                    name="fatherName"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                            label="Father's Name"
                            variant="outlined"
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                            sx={{ gridColumn: "span 2" }}
                        />
                    )}
                    rules={{
                        required: 'Required', pattern: {
                            value: /^[A-Za-z.]+(\s[A-Za-z.]+)*$/i,
                            message: "Only alphabets are allowed with spaces between words"
                        }
                    }}
                />
                <Controller
                    name="emailOrPhone"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                            disabled
                            label="Email or phone"
                            variant="outlined"
                            value={value}
                            onChange={(e) => {
                                // Remove spaces at the beginning and end of the input
                                const trimmedValue = e.target.value.trim();
                                onChange(trimmedValue.toLowerCase());
                                handleEmailOrPhoneChange(e);
                            }}
                            error={!!error}
                            helperText={error ? error.message : null}
                            sx={{ gridColumn: "span 4" }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Tooltip TransitionComponent={Zoom} arrow enterTouchDelay={0} sx={{ cursor: "default" }} disableInteractive={true}
                                            title="Account creation is possible via phone or email. If you prefer to use email as your login, enter it here; otherwise, use phone.">
                                            <InfoIcon />
                                        </Tooltip>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )}
                    rules={{ required: 'Required', pattern: { value: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|(^\d{10}$)$/i, message: "Invalid email or phone number" } }}
                />
                <Controller
                    name="phone"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                            label="Whatsapp no"
                            type='number'
                            variant="outlined"
                            value={value}
                            onChange={onChange}
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
                    name="enrollNo"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                            label="Enroll no"
                            variant="outlined"
                            value={value}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === "") {
                                    onChange("");
                                } else if (/^[a-zA-Z0-9]+$/.test(value)) {
                                    onChange(value.toUpperCase());
                                }
                            }}
                            error={!!error}
                            helperText={error ? error.message : null}
                            sx={{ gridColumn: "span 2" }}
                        />
                    )}
                    rules={{ required: 'Required' }}
                />
                <Controller
                    name="address"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                            label="Address of communication"
                            variant="outlined"
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                            sx={{ gridColumn: "span 4" }}
                        />
                    )}
                    rules={{ required: 'Required' }}
                />
                <Controller
                    name="city"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                            label="City"
                            variant="outlined"
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                            sx={{ gridColumn: "span 2" }}
                        />
                    )}
                    rules={{ required: 'Required' }}
                />
                <Controller
                    name="busStop"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                            label="Bus stop"
                            variant="outlined"
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                            sx={{ gridColumn: "span 1" }}
                        />
                    )}
                    rules={{ required: 'Required' }}
                />
                <Controller
                    name="busNo"
                    control={control}
                    defaultValue={null}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <FormControl fullWidth error={!!error} sx={{ gridColumn: "span 1" }}>
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={busses as string[] || []}
                                renderInput={(params: AutocompleteRenderInputParams) => <TextField {...params} label="Bus no" error={!!error} />}
                                onChange={(_e, newValue) => {
                                    onChange(newValue as string)
                                    setBusNo(newValue as string)
                                }}
                                value={value || null}
                            />
                            {error && (
                                <FormHelperText>{error.message}</FormHelperText>
                            )}
                            {
                                (busNoCount !== 0 && busNoCount >= 48) ? (
                                    <FormHelperText sx={{ color: "#ff0000" }}>Bus No {value} has {busNoCount} passengers, you should modify the bus number if possible.</FormHelperText>
                                ) : null
                            }
                            {
                                (busNoCount !== 0 && busNoCount < 48) ? (
                                    <FormHelperText>User Count : {busNoCount}</FormHelperText>
                                ) : null
                            }
                        </FormControl>
                    )}
                    rules={{ required: 'Required' }}
                />
                <Controller
                    name="department"
                    control={control}
                    defaultValue={null}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <FormControl fullWidth error={!!error} sx={{ gridColumn: "span 1" }}>
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={departments as string[] || []}
                                renderInput={(params: AutocompleteRenderInputParams) => <TextField {...params} label="Department" error={!!error} />}
                                onChange={(_e, newValue) => onChange(newValue as string)}
                                value={value || null}
                            />
                            {error && (
                                <FormHelperText>{error.message}</FormHelperText>
                            )}
                        </FormControl>
                    )}
                    rules={{ required: 'Required' }}
                />
                <Controller
                    name="validUpto"
                    defaultValue=''
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                // defaultValue={}
                                label={'Valid upto'}
                                views={['month', 'year']}
                                disablePast={true}
                                onChange={(newValue) => {
                                    if (newValue === null) {
                                        // Handle empty input
                                        onChange('');
                                        return;
                                    }

                                    // Convert newValue to a dayjs date object for comparison
                                    const selectedDate = dayjs(newValue);

                                    if (selectedDate.isBefore(dayjs(), 'date')) {
                                        // If the selected date is in the past, handle it as needed (e.g., show an error)
                                        // onChange(''); // Clear the input or handle it as needed
                                        setError('validUpto', {
                                            type: 'manual',
                                            message: 'Year and month must not be in the past.',
                                        });
                                    } else {
                                        onChange(newValue?.toString() ?? ''); // Update the state with the valid date
                                    }
                                }}
                                slotProps={{
                                    textField: {
                                        error: !!error,
                                        helperText: error ? error.message : null,
                                    },
                                }}
                                value={value}
                            />
                        </LocalizationProvider>
                    )}
                    rules={{ required: 'Required' }}
                />
                <Controller
                    name="gender"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <FormControl fullWidth error={!!error} sx={{ gridColumn: "span 1" }}>
                            <div className={`flex items-center border-2 h-14 px-2 rounded ${error ? "border-red-400" : ''}`}>
                                <FormLabel id="demo-row-radio-buttons-group-label" className='mr-3'>Gender : </FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    value={value}
                                    onChange={(event) => onChange(event.target.value)}
                                >
                                    <FormControlLabel value="Male" control={<Radio />} label="Male" />
                                    <FormControlLabel value="Female" control={<Radio />} label="Female" />
                                </RadioGroup>
                            </div>
                            {error && (
                                <FormHelperText>{error.message}</FormHelperText>
                            )}
                        </FormControl>
                    )}
                    rules={{ required: 'Required' }}
                />
                <LoadingButton
                    fullWidth
                    sx={{ marginTop: "1rem" }}
                    color="primary"
                    type="submit"
                    variant="contained"
                    loading={sumbitLoading}
                >
                    Submit
                </LoadingButton>
            </Box>
        </Box>
    )
}
