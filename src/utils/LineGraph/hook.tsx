import { Line } from "./type";

export const fuseData = (lines : Line[]) => {
    var result: object[] = [];
    const allKeys = lines.map((line) => line.data.map((data) => data.key)).flat();
    allKeys.forEach((key) => {
        var obj = {};
        lines.forEach((line) => {
            const data = line.data.find((data) => data.key === key);
            obj = {...obj, [line.name]: data?.value, key: key};
        });
        result.push(obj);
    });
    return result;
}