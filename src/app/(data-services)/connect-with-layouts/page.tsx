"use client"
import ModalUserOption from '@/components/ModalUserOption';
import ResizableBox from '@/components/ResizableBox';
import { useAppContext, useDispatch } from '@/contexts/AppContext'
import { ApiData, ApiDataComponent, Layout, Page, StatisticalGraphType } from '@/types/types';
import { ChevronDownIcon, PlusSquareIcon } from '@chakra-ui/icons';
import { chakra, Button, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
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
    const [pageName, setPageName] = useState<string>("Page 1");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const router = useRouter();
    const appState = useAppContext();
    const alreadySelected = rows.map(row => row.boxes.map(box => box.dataSource)).flat();
    const availableOptions = appState?.selectedApiData?.map(apiData => apiData.description).filter(e => !alreadySelected.includes(e)) ?? [];
    //the menu should only have the non selected options
    const dispatch = useDispatch();

    if (!appState?.selectedApiData) {
        return "something went wrong"
    }

    console.log("App State for pages is: ", appState.pages)


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

    const savePage = () => {
        console.log("Submitting the following Data: ", rows);
        const componentNames = rows.map(row => row.boxes.map(box => box.label)).flat();
        const templateAreas = rows.map(row => row.boxes.map(box => box.label)).map(row => `"${row.join(" ")}"`);
        const columnsLength = Math.max(...rows.map(row => row.boxes.length));
        const rowsLength = rows.length;
        const gridColumns = Array(columnsLength).fill("1fr").join(" ");
        const gridRows = Array(rowsLength).fill("1fr").join(" ");
        const layout: Layout = {
            columns: gridColumns,
            rows: gridRows,
            areas: templateAreas,
            components: componentNames,
        }
        const apiDataComponents: ApiDataComponent[] = rows.map(row => row.boxes.map(box => {
            const data = appState.selectedApiData.find(apiData => apiData.description === box.dataSource) as ApiData;
            data.graph = box.graphType;
            return { data, componentName: box.label }
        })).flat();
        const page: Page = { layout, pageName, associatedData: apiDataComponents }
        //@ts-expect-error
        dispatch({ type: "add-page-with-layout", payload: page })
    }

    const goToNewPage = () => {
        //this has plenty of logic problems
        //i cannot change between pages
        console.log("Creating new Page")
        setRows([]);
        setPageName(prev => "New Page");
    }

    const showModalForUserAction = () => {
        console.log("User has finished with all pages")
        setIsModalOpen(true);
    }

    const generateDocument = () => {
        console.log("Generating Requirements Document")
        fetch("/api/create-requirements-file", {
            method: "POST",
            body: JSON.stringify(appState),
        }).then((response) => {
            if (response.ok) {
                console.log("Email sent")
            } else {
                console.error("Error sending email")
            }
            return response.blob();
        }).then((val) => {
            const url = URL.createObjectURL(val);
            const a = document.createElement('a');
            a.href = url;
            a.download = "Requirements.md";
            a.click();
            URL.revokeObjectURL(url);
        }).catch((error) => {
            console.error("Error sending email: ", error)
        })
    }

    const generateCode = () => {
        console.log("Generating Code")
        router.push("/generate-code")
    }


    console.log("Page name is: ", pageName)
    return (
        <Flex flexDir="column" p={"1rem"} columnGap={"1rem"} rowGap={"1rem"} wrap={"wrap"}>
            <Flex columnGap="1rem">
                <EditableSpan key={pageName} text={pageName} setText={setPageName} />
                <Button rightIcon={<PlusSquareIcon />} onClick={goToNewPage}>New Page</Button>
            </Flex>
            <ModalUserOption title="Get Software Developed Faster" description="You have finished with all the pages, would you like to submit all the pages?" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <Flex py="1rem" justifyContent="space-between">
                    <Button onClick={generateDocument}>Generate Document</Button>
                    <Button onClick={generateCode}>Generate Code</Button>
                </Flex>
            </ModalUserOption>
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
            <Button w="35%" onClick={savePage} position="fixed" bottom="1rem" right="1rem" colorScheme='blue'>Save Page</Button>
            <Button w="35%" onClick={showModalForUserAction} position="fixed" bottom="1rem" left="1rem" colorScheme='red'>Submit All</Button>
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
    const [editedText, setEditedText] = React.useState(text);
    const ref = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (isBeingEdited && ref.current !== null) {
            ref.current.focus()
        }
    }, [isBeingEdited]);

    const handleChange = (inp: string) => {
        setEditedText(inp);
    }

    const handleBlur = () => {
        setIsBeingEdited(false);
        setText(editedText);
    }

    return <chakra.div p="1rem" w="70%">
        {isBeingEdited ? <input type="text" value={editedText} onChange={(e) => handleChange(e.target.value)} onBlur={handleBlur}
            ref={ref}
            autoFocus
            style={{
                display: `${isBeingEdited ? "" : "none"}`,
                width: "70%",
                font: "inherit",
            }} /> : <chakra.span onDoubleClick={() => setIsBeingEdited(true)} onClick={() => setIsBeingEdited(true)} textDecoration={"underline"} style={{
                display: `${isBeingEdited ? "none" : ""}`,
                cursor: "pointer",
                width: "70%",
            }}>
            {editedText}

        </chakra.span>}



    </chakra.div>

}


export default AssociateDataSourcesWithLayoutsPage
