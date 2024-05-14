import { useState } from "react";


//for some reason this does not work
function useObject<T>(initialValue: T) {
    const [val, setVal] = useState<T>(initialValue)

    const changeVal = (newValue: Partial<T>) => {
        setVal(prev => {
            return {
                ...prev,
                ...newValue,

            }
        })

    }
    return [val, changeVal]
}

export default useObject