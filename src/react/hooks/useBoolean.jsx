import { useState } from 'react';

const useBoolean = (inital = false) => {
    const [bool, setBool] = useState(inital);
    const toogle = () => {
        setBool(!bool);
    };
    return [bool, toogle];
};
export default useBoolean;
