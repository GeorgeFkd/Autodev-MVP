"use client"
import ResizableBox from '@/components/ResizableBox';
import { useAppContext, useDispatch } from '@/contexts/AppContext'
import { StatisticalGraphType } from '@/types/types';
import { ChevronDownIcon, PlusSquareIcon } from '@chakra-ui/icons';
import { chakra, Button, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import React, { useState } from 'react'

type Box = {
    width: number,
    height: number,
    //might not be needed
    position: number,
    //openAPI operation for now
    dataSource: string,
    graphType: StatisticalGraphType,
    label: string,
    //x and y but i dont know how to handle that yet
}

interface Row {
    boxes: Box[],
    id: number,
}

const defaultBox = { width: 450, height: 450, position: 0, dataSource: "", graphType: StatisticalGraphType.BarGraph, label: "Label" }
function AssociateDataSourcesWithLayoutsPage() {
    const [rows, setRows] = useState<Row[]>([{ boxes: [defaultBox], id: 0 }]);
    const [selectedDataSources, setSelectedDataSources] = useState<string[]>([]);
    const appState = useAppContext();
    const availableOptions = appState?.selectedApiData?.map(apiData => apiData.description).filter(e => !selectedDataSources.includes(e)) ?? [];
    //the menu should only have the non selected options
    const dispatch = useDispatch();

    if (!appState?.selectedApiData) {
        return "something went wrong"
    }


    const changeBox = (rowId: number, boxId: number, newBox: Partial<Box>) => {
        console.log("Changing it to: ", newBox)
        const newRows = [...rows];
        const currentBox = newRows[rowId].boxes[boxId];
        newRows[rowId].boxes[boxId] = { ...currentBox, ...newBox };
        console.log("End result: ", newRows)
        setRows(newRows);
    }

    const addBox = (rowId: number) => {
        const newRows = [...rows];
        newRows[rowId].boxes.push(defaultBox);
        console.log("New rows: ", newRows)
        setRows(newRows);
    }

    const addRow = () => {
        console.log("Adding row")
        setRows([...rows, { boxes: [defaultBox], id: rows.length }]);
    }

    const deleteRow = (rowId: number) => {
        console.log("Deleting row: ", rowId)
        const newRows = rows.filter((row) => row.id !== rowId);
        setRows(newRows);
    }

    const handleSubmit = () => {
        console.log("Submitting the following Data: ", rows);

    }




    //Have an editable title up above with < > controls to circle between the pages
    //Then render clickable boxes that launch a pop-up and then 

    return (
        <Flex flexDir="column" p={"1rem"} columnGap={"1rem"} rowGap={"1rem"} wrap={"wrap"}>
            {rows.map((row, rowIndex) => {
                return <Flex key={row.id + " " + rowIndex} flexDir="row" wrap="nowrap" columnGap="1rem">
                    {row.boxes.map((box, index) => {
                        return <ResizableBox key={index + box.label} width={box.width} height={box.height} setHeight={(height) => changeBox(rowIndex, index, { height })} setWidth={(width) => changeBox(rowIndex, index, { width })}>
                            <Flex w="100%" h="100%" flexDir="column">
                                <EditableSpan text={box.label} setText={(text) => changeBox(rowIndex, index, { label: text })} />
                                <Flex flexDir="row" justifyContent="space-between">
                                    {/* dropdown for data source */}
                                    <ChooseGraphType setGraphType={(graphType) => changeBox(rowIndex, index, { graphType })} graphType={box.graphType} />
                                    {/* dropdown for graph type */}
                                    <ChooseDataSource setDataSource={(dataSource) => changeBox(rowIndex, index, { dataSource })} dataSource={box.dataSource} availableOptions={availableOptions} />
                                </Flex>
                            </Flex>
                        </ResizableBox>
                    })}
                    <IconButton aria-label='Add Box in Row' onClick={() => addBox(rowIndex)} icon={<PlusSquareIcon />} />
                    <Button onClick={() => deleteRow(rowIndex)}>Delete Row</Button>
                </Flex>

            })}
            <Button w="65%" alignSelf="center" onClick={addRow}>Add Row</Button>
            <Button w="35%" position="fixed" bottom="1rem" right="1rem" colorScheme='blue'>Submit</Button>
        </Flex>
    )
}

function ChooseDataSource({ setDataSource, dataSource, availableOptions }: { setDataSource: (dataSource: string) => void, dataSource: string, availableOptions: string[] }) {
    return <chakra.div p="0.75rem"><Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            {dataSource || "Choose Data Source"}
        </MenuButton>
        <MenuList>
            {availableOptions.map((option) => {
                return <MenuItem key={option} onClick={() => setDataSource(option)}>{option}</MenuItem>
            })}
        </MenuList>
    </Menu>
    </chakra.div>
}

function ChooseGraphType({ setGraphType, graphType }: { setGraphType: (graphType: StatisticalGraphType) => void, graphType: StatisticalGraphType }) {

    const fromStringToGraphType = (graphType: string): StatisticalGraphType => {
        if (graphType === "BarGraph") {
            return StatisticalGraphType.BarGraph
        }
        if (graphType === "Histogram") {
            return StatisticalGraphType.Histogram
        }
        if (graphType === "PieChart") {
            return StatisticalGraphType.PieChart
        }
        if (graphType === "ScatterPlot") {
            return StatisticalGraphType.ScatterPlot
        }
        return StatisticalGraphType.BarGraph
    }

    return <chakra.div p="0.75rem"><Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            {graphType || "Choose Graph Type"}
        </MenuButton>
        <MenuList>

            {Object.keys(StatisticalGraphType).map((graphType) => {
                return <MenuItem key={graphType} onClick={() => setGraphType(fromStringToGraphType(graphType))}>{graphType}</MenuItem>

            })}
        </MenuList>
    </Menu>
    </chakra.div>
}

interface EditableSpanProps {
    text: string,
    setText: (text: string) => void,
}
function EditableSpan({ setText, text }: EditableSpanProps) {
    const [isBeingEdited, setIsBeingEdited] = React.useState(false);
    const ref = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (isBeingEdited) {
            if (ref.current !== null) {
                ref.current.focus()
            }
        }
    }, [isBeingEdited]);
    return <chakra.div p="1rem" w="70%">
        <chakra.input id={text} type="text" value={text} onChange={(e) => setText(e.target.value)} onBlur={(e) => setIsBeingEdited(false)}
            ref={ref}
            p="0.75rem"
            style={{
                display: `${isBeingEdited ? "" : "none"}`,
                width: "70%",
                font: "inherit",
            }} />

        <chakra.span onClick={() => setIsBeingEdited(true)} textDecoration={"underline"} style={{
            display: `${isBeingEdited ? "none" : ""}`,
            cursor: "pointer",
            width: "70%",
        }}>
            {text}

        </chakra.span>
    </chakra.div>

}


export default AssociateDataSourcesWithLayoutsPage
