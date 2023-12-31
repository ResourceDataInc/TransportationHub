export const yyyymmddFormat = () => {
    const x = new Date();
    const y = x.getFullYear().toString();
    let m = (x.getMonth() + 1).toString();
    let d = x.getDate().toString();
    (d.length === 1) && (d = '0' + d);
    (m.length === 1) && (m = '0' + m);
    const yyyymmdd = y + m + d;
    return yyyymmdd;
};

export const weekdayName = () => {
    const weekday = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const d = new Date();
    let day = weekday[d.getDay()];
    return day;
};