import { useState, ChangeEvent, useEffect } from 'react';

// Mui
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import useMediaQuery from "@mui/material/useMediaQuery";
import FormHelperText from '@mui/material/FormHelperText';
import { AutocompleteRenderInputParams } from '@mui/material/Autocomplete/Autocomplete';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';

import {
    Typography, Card, CardContent, CardActionArea, TableContainer, Table,
    TableBody, TableRow, TableCell, InputAdornment, Tooltip
} from "@mui/material";

import Zoom from '@mui/material/Zoom';

// mui icons
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';


// mui customs
import { BaseButton } from '../../components/BaseButton';

// Dialog
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

// Date Picker
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// form control
import { useForm, SubmitHandler, Controller } from 'react-hook-form';

//& Redux
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getDepartments } from '../../redux/features/instituteSlice';
import { shallowEqual } from 'react-redux';



// Router
import { useNavigate } from 'react-router-dom';

const formDataProps = [
    'name',
    'fatherName',
    'emailOrPhone',
    'phone',
    'enrollNo',
    'address',
    'city',
    'busStop',
    'department',
    'validUpto',
    'gender',
    'photo',
] as const;

type FormData = {
    [K in typeof formDataProps[number]]: string;
};

const CreateUser: React.FC = () => {

    const isNonMobile = useMediaQuery("(min-width:600px)");

    const navigate = useNavigate();

    // redux
    const dispatch = useAppDispatch();
    const { departments, institute } = useAppSelector((state) => {
        return {
            departments: state?.institute?.departments,
            institute: state?.auth?.admin?.institute
        }
    },
        shallowEqual
    );

    // dialog
    const [open, setOpen] = useState<boolean>(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // for changing date format from validUpto date string
    function getMonthAndYear(dateString: string): string {
        const date = new Date(dateString);
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();

        return month + " " + year;
    }


    // form
    const [formData, setFormData] = useState<FormData>({} as FormData)
    const { name, fatherName, emailOrPhone, phone, enrollNo, address, city, busStop, department, validUpto, photo, gender } = formData

    const { handleSubmit, control, setValue, formState } = useForm<FormData>();

    const onSubmit: SubmitHandler<FormData> = (data) => {
        setFormData(data);
        handleClickOpen();
    };

    const handleEmailOrPhoneChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = event.target.value;

        if (formState.isDirty && value.match(/(^\d{10}$)/)) {
            setValue('phone', value, { shouldValidate: true });
        }
    };

    // for setting value of departments
    useEffect(() => {
        if (institute) {
            if (!departments) {
                dispatch(getDepartments(institute))
            }
        }
    }, [institute, dispatch]);

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <div className='mb-4'>
                    <h1 className="text-3xl font-bold">Create User</h1>
                    <h4 className="text-l font-semibold mt-3 ml-0.5">Create a new user profile</h4>
                </div>
                <BaseButton onClick={() => navigate("/users")}>
                    <div className="flex justify-center items-center">
                        <ArrowBackIosIcon fontSize="small" />
                        <p>Back</p>
                    </div>
                </BaseButton>
            </Box>
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
                    rules={{ required: 'Required', pattern: { value: /^[A-Za-z/.\s]+$/i, message: "Only alphabets are allowed" } }}
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
                    rules={{ required: 'Required', pattern: { value: /^[A-Za-z/.\s]+$/i, message: "Only alphabets are allowed" } }}
                />
                <Controller
                    name="emailOrPhone"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                            label="Email or phone"
                            variant="outlined"
                            value={value}
                            onChange={(e) => {
                                onChange(e.target.value.toLowerCase());
                                handleEmailOrPhoneChange(e)
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
                            label="Phone"
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
                            onChange={(e) => onChange(e.target.value.toUpperCase())}
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
                            sx={{ gridColumn: "span 2" }}
                        />
                    )}
                    rules={{ required: 'Required' }}
                />
                <Controller
                    name="department"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange }, fieldState: { error } }) => (
                        <FormControl fullWidth error={!!error} sx={{ gridColumn: "span 1" }}>
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={departments as string[] || []}
                                renderInput={(params: AutocompleteRenderInputParams) => <TextField {...params} label="Department" error={!!error} />}
                                onChange={(_e, newValue) => onChange(newValue as string)}
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
                    defaultValue=""
                    control={control}
                    render={({ field: { onChange }, fieldState: { error } }) => (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label={'Valid upto'}
                                views={['month', 'year']}
                                disablePast={true}
                                onChange={(newValue) => {
                                    onChange(newValue?.toString() ?? '');
                                }}
                                slotProps={{
                                    textField: {
                                        error: !!error,
                                        helperText: error ? error.message : null,
                                    },
                                }}
                            />
                        </LocalizationProvider>
                    )}
                    rules={{ required: 'Required' }}
                />
                <Controller
                    name="photo"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <FormControl fullWidth error={!!error} sx={{ gridColumn: "span 1" }}>
                            <div className={`flex items-center border-2 h-14 px-2 rounded ${error ? "border-red-400" : ''}`}>
                                <p className={`flex items-center text-gray-600 text-l mr-3 max-md:text-xs ${!!error ? "text-red-600" : ''}`}>
                                    Profile Picture :
                                </p>
                                <Button variant="text" component="label" startIcon={<PersonIcon />} color={value ? "success" : undefined}>
                                    {value ? "Change image" : "Choose image"}
                                    <input
                                        hidden
                                        accept="image/*"
                                        multiple={false}
                                        type="file"
                                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                            if (event.target.files && event.target.files.length > 0) {
                                                const file = event.target.files[0];
                                                onChange(URL.createObjectURL(file));
                                            }
                                        }} />
                                </Button>
                            </div>
                            {error && (
                                <FormHelperText>{error.message}</FormHelperText>
                            )}
                        </FormControl>
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

                <div className="mt-6">
                    <button
                        type="submit"
                        className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600">
                        Submit
                    </button>
                </div>
            </Box>

            {/* Dialog */}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Preview"}
                </DialogTitle>
                <DialogContent>
                    <Card className="">
                        <CardActionArea>
                            <CardContent>
                                <Box sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                                    <Typography variant="h5" gutterBottom className='p-3 text-center'>
                                        {name}
                                    </Typography>
                                    <img src={photo} alt="Profile Photo" style={{ width: '150px', height: '150px', objectFit: 'cover' }} className='rounded-full' />
                                </Box>

                                <TableContainer>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                                                    Father's Name:
                                                </TableCell>
                                                <TableCell>:</TableCell>
                                                <TableCell>{fatherName}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                                                    Email/Phone
                                                </TableCell>
                                                <TableCell>:</TableCell>
                                                <TableCell>{emailOrPhone}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                                                    Phone
                                                </TableCell>
                                                <TableCell>:</TableCell>
                                                <TableCell>{phone}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                                                    Address
                                                </TableCell>
                                                <TableCell>:</TableCell>
                                                <TableCell>{address}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                                                    City
                                                </TableCell>
                                                <TableCell>:</TableCell>
                                                <TableCell>{city}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                                                    Bus Stop
                                                </TableCell>
                                                <TableCell>:</TableCell>
                                                <TableCell>{busStop}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                                                    Enrollment No
                                                </TableCell>
                                                <TableCell>:</TableCell>
                                                <TableCell>{enrollNo}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                                                    Department
                                                </TableCell>
                                                <TableCell>:</TableCell>
                                                <TableCell>{department}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                                                    Gender
                                                </TableCell>
                                                <TableCell>:</TableCell>
                                                <TableCell>{gender}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                                                    Valid Upto
                                                </TableCell>
                                                <TableCell>:</TableCell>
                                                <TableCell>{getMonthAndYear(validUpto)}</TableCell>
                                            </TableRow>


                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Disagree</Button>
                    <Button onClick={handleClose} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default CreateUser;