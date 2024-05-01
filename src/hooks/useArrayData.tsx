import { useState } from "react";


function useArrayData<T>({ initialData = [] }: { initialData: T[] }) {
    //A hook to facilitate working with array of object type data

    //what happens if it is an array of array of T?
    const [data, setData] = useState<T[]>(initialData || []);
    const addDataFront = (newData: T) => setData([newData, ...data]);
    const addData = (newData: T) => setData([...data, newData]);

    const editElementAt = (index: number, newData: Partial<T>) => {
        if (index < 0 || index >= data.length) return;
        const newArr = [...data];
        newArr[index] = { ...newArr[index], ...newData };
        setData(newArr);
    }

    const deleteElementAt = (index: number) => {
        if (index < 0 || index >= data.length) return;
        const newArr = [...data];
        newArr.splice(index, 1);
        setData(newArr);
    }

    const deleteElemThat = (condition: (item: T) => boolean) => {
        const newArr = data.filter(item => !condition(item));
        setData(newArr);
    }

    return { data, addDataFront, addData, editElementAt, deleteElementAt, deleteElemThat }

}

export default useArrayData;