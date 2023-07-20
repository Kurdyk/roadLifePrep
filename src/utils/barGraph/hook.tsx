import { Bar } from "./type";


export const fuseData = (bars : Bar[]) => {
    var result: object[] = [];
    const allKeys = bars.map((bar) => bar.data.map((data) => data.key)).flat();
    allKeys.forEach((key) => {
        var obj = {};
        bars.forEach((bar) => {
            const data = bar.data.find((data) => data.key === key);
            obj = {...obj, [bar.name]: data?.value, key: key};
        });
        result.push(obj);
    });
    return result;
}
