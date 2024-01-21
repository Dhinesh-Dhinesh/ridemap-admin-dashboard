export const customSortComparator = (v1: any, v2: any) => {
    // Skip processing null values
    if (v1 === null && v2 === null) {
        return 0;
    }

    if (v1 === null) {
        return 1;
    }

    if (v2 === null) {
        return -1;
    }

    const dateString1 = v1 as string;
    const dateString2 = v2 as string;

    // Skip processing empty strings
    if (!dateString1.trim() && !dateString2.trim()) {
        return 0;
    }

    if (!dateString1.trim()) {
        return 1;
    }

    if (!dateString2.trim()) {
        return -1;
    }

    try {
        const parts1 = dateString1.split(/[\/, ]/);
        const parts2 = dateString2.split(/[\/, ]/);

        // Ensure parts is not undefined and has the expected structure
        if (!parts1 || parts1.length !== 6 || !parts2 || parts2.length !== 6) {
            throw new Error(`Invalid date string format`);
        }

        const [day1, month1, year1, _time1, hour1, period1] = parts1;
        const [day2, month2, year2, _time2, hour2, period2] = parts2;

        // Months are 0-indexed in JavaScript Date, so subtract 1
        const jsDate1 = new Date(+year1, +month1 - 1, +day1, +(hour1.split(':')[0]), +(hour1.split(':')[1]), 0);
        const jsDate2 = new Date(+year2, +month2 - 1, +day2, +(hour2.split(':')[0]), +(hour2.split(':')[1]), 0);

        // Adjust for AM/PM
        if (period1.toLowerCase() === 'pm') {
            jsDate1.setHours(jsDate1.getHours() + 12);
        }

        if (period2.toLowerCase() === 'pm') {
            jsDate2.setHours(jsDate2.getHours() + 12);
        }

        return jsDate2.getTime() - jsDate1.getTime();
    } catch (error: any) {
        console.error(`Error processing date strings: ${error.message}`);
        return 0;
    }
};