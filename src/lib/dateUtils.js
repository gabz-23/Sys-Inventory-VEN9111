export const createDateChangeHandler = (fieldOnChange) => {
    return (e) => {
        const val = e.target.value;
        if (val) {
            const parts = val.split('-');
            if (parts.length === 3) {
                const [year, month, day] = parts;
                if (year.length > 4 || month === '00' || day === '00') return;
            }
        }
        fieldOnChange(e);
    };
};
