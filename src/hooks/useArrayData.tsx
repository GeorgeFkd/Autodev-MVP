import { useState } from "react";


function useArrayData<T>({ initialData = [] }: { initialData: T[] }) {
    //A hook to facilitate working with array of object type data
    //what happens if it is an array of array of T?
    const [data, setData] = useState<T[]>(initialData || []);
    const addDataFront = (newData: T) => setData([newData, ...data]);
    const addData = (newData: T) => setData([...data, newData]);

    const editElementAt = (index: number, newData: Partial<T>) => {
        console.log("Editing element at: ", index, " with data: ", newData)
        console.log("Index: ", index, " Data length: ", data.length, " Data: ", data)
        if (index < 0 || index >= data.length) return;
        console.log("Editing it")
        const newArr = [...data];
        newArr[index] = { ...newArr[index], ...newData };
        setData(newArr);
    }

    const deleteElementAt = (index: number) => {
        if (index < 0 || index >= data.length) return;
        //not sure about this one
        const newArr = [...data];
        newArr.splice(index, 1);
        setData(newArr);
    }

    const deleteElemThat = (condition: (item: T) => boolean) => {
        const newArr = data.filter(item => !condition(item));
        setData(newArr);
    }



    return { data, setData, addDataFront, addData, editElementAt, deleteElementAt, deleteElemThat }

}

export default useArrayData;