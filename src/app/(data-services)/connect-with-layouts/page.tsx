"use client"
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts"
import ResizableBox from '@/components/ResizableBox';
import { useGlobalState } from '@/contexts/AppContext'
import { useGoHome } from '@/hooks/useGoHome';
import { ApiData, ApiDataComponent, ComponentInLayout, Layout, Page, StatisticalGraphType } from '@/types/types';
import { ChevronDownIcon, DeleteIcon, PlusSquareIcon } from '@chakra-ui/icons';
import { chakra, Button, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList, useToast } from '@chakra-ui/react';
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




const defaultBox = { width: 450, height: 450, position: 0, dataSource: "", graphType: StatisticalGraphType.BarGraph, label: "Label0" }
function AssociateDataSourcesWithLayoutsPage() {
    useGoHome({ condition: (state) => state == null || !state?.selectedApiData || state?.selectedApiData.length === 0 })
    const toast = useToast();
    const [rows, setRows] = useState<Row[]>([{ boxes: [defaultBox], id: 0 }]);
    const [pageName, setPageName] = useState<string>("Page 1");
    const router = useRouter();
    //those should probably be in the same hook and then just pick what you want
    const { appState, dispatch } = useGlobalState();
    const alreadySelected = rows.map(row => row.boxes.map(box => box.dataSource)).flat();
    const availableOptions = appState?.selectedApiData?.map(apiData => apiData.description).filter(e => !alreadySelected.includes(e)) ?? [];
    //the menu should only have the non selected options



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
        const newLabel = "Label" + rows.reduce((acc, current) => {
            return acc + current.boxes.length;
        }, 0)
        //the dimension stuff doesnt work that well but it is something
        const widthOfTheLastOne = newRows[rowId].boxes[newRows[rowId].boxes.length - 1].width
        const heightOfTheLastOne = newRows[rowId].boxes[newRows[rowId].boxes.length - 1].height
        console.log("Width and height of previous box", widthOfTheLastOne, heightOfTheLastOne)
        const newBox = { ...defaultBox, label: newLabel, position: newRows[rowId].boxes.length, width: widthOfTheLastOne, height: heightOfTheLastOne };

        newRows[rowId].boxes.push(newBox);
        console.log("New rows: ", newRows)
        setRows(newRows);
    }

    const deleteBox = (rowId: number, colId: number) => {
        console.log("Deleting box at row: ", rowId, " and column: ", colId)
        const newRows = [...rows]
        //the second map is needed to fix the position after removing elements
        const newRow = newRows[rowId].boxes.filter((b) => b.position !== colId).map((box, index) => { return { ...box, position: index } })
        newRows[rowId].boxes = newRow
        setRows(newRows)
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

    const savePage = (shouldShowToast: boolean) => {
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
        const apiDataComponents: ApiDataComponent[] = rows.map((row, index) => row.boxes.map(box => {
            const data = appState?.selectedApiData.find(apiData => apiData.description === box.dataSource) as ApiData;
            data.graph = box.graphType;
            const component: ComponentInLayout = { componentName: box.label, column: box.position, row: index, sizeX: box.width, sizeY: box.height }
            return { data, component }
        })).flat();
        const page: Page = { layout, pageName, associatedData: apiDataComponents }
        //@ts-expect-error
        dispatch({ type: "add-page-with-layout", payload: page })
        if (shouldShowToast) {
            toast({
                duration: 3000,
                status: "success",
                title: "Progress:",
                description: "Page saved successfully",
                isClosable: true,
            })
        }

    }

    const goToNewPage = () => {
        //this has plenty of logic problems
        //i cannot change between pages
        if (availableOptions.length === 0) {
            //can add an option to proceed anyway
            toast({
                title: "Error",
                status: "warning",
                description: "You have already selected all the data sources",
                duration: 6000,
                isClosable: true,
            })
            return;
        }
        savePage(false);
        console.log("Creating new Page")
        setRows([]);
        setPageName(prev => "New Page");
    }

    const goToNonFunctionalRequirements = () => {
        console.log("User has finished with all pages")
        //used so i dont have to click save page when im done
        savePage(false)
        router.push("/non-functional-requirements")
    }

    const getHeightOfRest = (pos: number) => {
        return rows.filter((el, index) => index < pos).map(r => {
            return Math.max(...r.boxes.map(b => b.height))
        }).reduce((acc, curr) => {
            return acc + curr
        }, 0)
    }

    console.log("Page name is: ", pageName)
    return (
        <Flex flexDir="column" p={"1rem"} columnGap={"1rem"} rowGap={"1rem"} wrap={"wrap"}>
            <Flex columnGap="1rem" alignItems={"center"} w="100%">
                <EditableSpan key={pageName} text={pageName} setText={setPageName} />
                <Button ml="auto" rightIcon={<PlusSquareIcon />} w="12rem" onClick={goToNewPage}>New Page</Button>
            </Flex>
            {/* <ModalUserOption title="Get Software Developed Faster" description="You have finished with all the pages, would you like to submit all the pages?" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <Flex py="1rem" justifyContent="space-between">
                    <Button onClick={generateDocument}>Generate Document</Button>
                    <Button onClick={generateCode}>Generate Code</Button>
                </Flex>
            </ModalUserOption> */}
            {rows.map((row, rowIndex) => {
                const getWidthOfRest = (pos: number) => {
                    return row.boxes.filter((el, index) => index < pos).reduce((acc, curr) => acc + curr.width, 0)
                }


                return <Flex key={row.id + " " + rowIndex} flexDir="row" wrap="nowrap" columnGap="1rem">
                    {row.boxes.map((box, index) => {
                        return <ResizableBox normaliseByX={getWidthOfRest(index)} normaliseByY={getHeightOfRest(rowIndex)} key={index + box.label} width={box.width} height={box.height} setHeight={(height) => changeBox(rowIndex, index, { height })} setWidth={(width) => changeBox(rowIndex, index, { width })}>
                            <Flex w="100%" h="100%" flexDir="column">
                                <Flex w="100%" px="1rem" justifyContent={"space-between"} alignItems={"center"}>
                                    <EditableSpan text={box.label} setText={(text) => changeBox(rowIndex, index, { label: text })} />
                                    <IconButton onClick={() => deleteBox(rowIndex, index)} aria-label="delete-box" icon={<DeleteIcon />}></IconButton>
                                </Flex>
                                <Flex flexDir="row" justifyContent="space-between">
                                    {/* dropdown for data source */}
                                    <ChooseGraphType setGraphType={(graphType) => changeBox(rowIndex, index, { graphType })} graphType={box.graphType} />
                                    {/* dropdown for graph type */}
                                    <ChooseDataSource setDataSource={(dataSource) => changeBox(rowIndex, index, { dataSource })} dataSource={box.dataSource} availableOptions={availableOptions} />

                                </Flex>
                                <RenderChart graphType={box.graphType} width={box.width * 0.65} height={box.height * 0.5} />

                                {/* this should be memoised only change when type width or height change*/}
                            </Flex>
                        </ResizableBox>
                    })}
                    <Flex flexDir={"column"} rowGap={"1rem"}>

                        <Button aria-label='Add Box in Row' onClick={() => addBox(rowIndex)} rightIcon={<PlusSquareIcon />}>Add Chart</Button>
                        <Button colorScheme="red" onClick={() => deleteRow(rowIndex)}>Delete Row</Button>
                    </Flex>
                </Flex>

            })}
            <Button w="65%" alignSelf="center" onClick={addRow}>Add Row</Button>
            <Button w="35%" onClick={goToNonFunctionalRequirements} position="fixed" bottom="1rem" left="33%" colorScheme='green'>Submit All</Button>
        </Flex>
    )
}


interface FakeChartProps {
    graphType: StatisticalGraphType
    width: number,
    height: number,

}


function RenderChart({ graphType, width, height }: FakeChartProps) {
    if (graphType === StatisticalGraphType.BarGraph) {
        const data = [{ name: 'Page A', uv: 400, pv: 2400, amt: 2400 }];
        return <BarChart width={width} height={height} data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Bar dataKey="uv" barSize={30} fill="#8884d8"
            />
        </BarChart>
    }
    if (graphType === StatisticalGraphType.PieChart) {
        const data01 = [
            {
                "name": "Group A",
                "value": 400
            },
            {
                "name": "Group B",
                "value": 300
            },
            {
                "name": "Group C",
                "value": 300
            },
            {
                "name": "Group D",
                "value": 200
            },
            {
                "name": "Group E",
                "value": 278
            },
            {
                "name": "Group F",
                "value": 189
            }
        ];
        const data02 = [
            {
                "name": "Group A",
                "value": 2400
            },
            {
                "name": "Group B",
                "value": 4567
            },
            {
                "name": "Group C",
                "value": 1398
            },
            {
                "name": "Group D",
                "value": 9800
            },
            {
                "name": "Group E",
                "value": 3908
            },
            {
                "name": "Group F",
                "value": 4800
            }
        ];
        return <PieChart width={width} height={height}>
            <Pie data={data01} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} fill="#8884d8" />
            <Pie data={data02} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#82ca9d" label />
        </PieChart>
    }
    if (graphType === StatisticalGraphType.ScatterPlot) {
        const data01 = [
            {
                "x": 100,
                "y": 200,
                "z": 200
            },
            {
                "x": 120,
                "y": 100,
                "z": 260
            },
            {
                "x": 170,
                "y": 300,
                "z": 400
            },
            {
                "x": 140,
                "y": 250,
                "z": 280
            },
            {
                "x": 150,
                "y": 400,
                "z": 500
            },
            {
                "x": 110,
                "y": 280,
                "z": 200
            }
        ];
        const data02 = [
            {
                "x": 200,
                "y": 260,
                "z": 240
            },
            {
                "x": 240,
                "y": 290,
                "z": 220
            },
            {
                "x": 190,
                "y": 290,
                "z": 250
            },
            {
                "x": 198,
                "y": 250,
                "z": 210
            },
            {
                "x": 180,
                "y": 280,
                "z": 260
            },
            {
                "x": 210,
                "y": 220,
                "z": 230
            }
        ];
        return <ScatterChart
            width={width}
            height={height}
            margin={{
                top: 20,
                right: 20,
                bottom: 10,
                left: 10,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" type="number" name="stature" unit="cm" />
            <YAxis dataKey="y" type="number" name="weight" unit="kg" />
            <ZAxis dataKey="z" type="number" range={[64, 144]} name="score" unit="km" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Legend />
            <Scatter name="A school" data={data01} fill="#8884d8" />
            <Scatter name="B school" data={data02} fill="#82ca9d" />
        </ScatterChart>
    }
    if (graphType === StatisticalGraphType.LineGraph) {
        const data = [
            {
                "name": "Page A",
                "uv": 4000,
                "pv": 2400,
                "amt": 2400
            },
            {
                "name": "Page B",
                "uv": 3000,
                "pv": 1398,
                "amt": 2210
            },
            {
                "name": "Page C",
                "uv": 2000,
                "pv": 9800,
                "amt": 2290
            },
            {
                "name": "Page D",
                "uv": 2780,
                "pv": 3908,
                "amt": 2000
            },
            {
                "name": "Page E",
                "uv": 1890,
                "pv": 4800,
                "amt": 2181
            },
            {
                "name": "Page F",
                "uv": 2390,
                "pv": 3800,
                "amt": 2500
            },
            {
                "name": "Page G",
                "uv": 3490,
                "pv": 4300,
                "amt": 2100
            }
        ]
        return <LineChart width={width} height={height} data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="pv" stroke="#8884d8" />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
        </LineChart>
    }
    return <chakra.div bg="gray.200">No Graph Selected</chakra.div>
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
        if (graphType === "PieChart") {
            return StatisticalGraphType.PieChart
        }
        if (graphType === "ScatterPlot") {
            return StatisticalGraphType.ScatterPlot
        }
        if (graphType === "LineGraph") {
            return StatisticalGraphType.LineGraph
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

    return <chakra.div py="1rem" w="50%">
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
