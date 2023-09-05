import { Box, TextField } from "@mui/material"
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import { shallowEqual } from "react-redux";

interface ChipData {
    key: number;
    label: string;
}

const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
}));

const Settings = () => {

    const [bussesChipData, setBussesChipData] = useState<readonly ChipData[]>();
    const [depChipData, setDepChipData] = useState<readonly ChipData[]>();

    const [bussesInput, setBussesInput] = useState<string>('');
    const [depInput, setDepInput] = useState<string>('');

    const { institute, departments, busses } = useAppSelector((state) => {
        return {
            departments: state?.institute?.departments,
            busses: state.institute?.busses,
            institute: state?.auth?.admin?.institute
        }
    },
        shallowEqual
    );


    const handleDelete = (chipToDelete: ChipData) => () => {
        setBussesChipData((chips) => { if (chips) return chips.filter((chip) => chip.key !== chipToDelete.key).sort((a, b) => a.label.localeCompare(b.label)) });
    };

    useEffect(() => {
        setBussesChipData(busses?.map((bus, index) => {
            return { key: index, label: bus }
        }).sort((a, b) => a.label.localeCompare(b.label)));

        setDepChipData(departments?.map((dep, index) => {
            return { key: index, label: dep }
        }).sort((a, b) => a.label.localeCompare(b.label)));
    }, [busses, departments])

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <div className='mb-4'>
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <h4 className="text-l font-semibold mt-3 ">Data Administration Center</h4>
                </div>
            </Box>
            <Box>

                {/* Busses */}

                <div className="text-md font-semibold mb-2">Busses</div>
                <Paper
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        listStyle: 'none',
                        p: 0.5,
                        m: 0,
                        mb: 2,
                    }}
                    component="ul"
                >
                    {bussesChipData && bussesChipData.map((data) => {
                        return (
                            <ListItem key={data.key}>
                                <Chip
                                    label={data.label}
                                    onDelete={data.label === 'React' ? undefined : handleDelete(data)}
                                />
                            </ListItem>
                        );
                    })}
                </Paper>
                <TextField
                    id="outlined-basic"
                    label="Add Busses"
                    variant="outlined"
                    onChange={(e) => { setBussesInput(e.target.value.toUpperCase()) }}
                    value={bussesInput}
                />

                {/* Departments */}

                <div className="text-md font-semibold mb-2 mt-8">Departments</div>
                <Paper
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        listStyle: 'none',
                        p: 0.5,
                        m: 0,
                        mb: 2,
                    }}
                    component="ul"
                >
                    {depChipData && depChipData.map((data) => {
                        return (
                            <ListItem key={data.key}>
                                <Chip
                                    label={data.label}
                                    onDelete={data.label === 'React' ? undefined : handleDelete(data)}
                                />
                            </ListItem>
                        );
                    })}
                </Paper>
                <TextField
                    id="outlined-basic"
                    label="Add Departments"
                    variant="outlined"
                    onChange={(e) => { setDepInput(e.target.value.toUpperCase()); }}
                    value={depInput}
                />
            </Box>
        </Box>
    )
}

export default Settings;