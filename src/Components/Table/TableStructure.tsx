/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useMemo, useState } from "react";
import BodyTable from "./BodyTable";
import ToolTable from "./ToolTable";
import PaginateTable from "./PaginateTable";
import paginate from "./utils/paginate";
import sortPath from "./utils/sortPath";
import styles from "./Table.module.scss";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Icon } from '@iconify/react/dist/iconify.js';

const doc = new jsPDF();

export interface TableStructure {
    id: string
    title: string
    searchPath: string,
    defaultSort?: string,
    structure: Column[]
}

export interface Column {
    label: string;
    width: string;
    height?: string;
    fontSize?: string;
    path?: string;
    element?: (val: any) => React.ReactElement;
}

export interface sortColumnProps {
    path: string;
    order: boolean;
}

interface thisProps {
    data: Array<any>;
    isEditable: boolean;
    structure: TableStructure;
    handleUpdate?: (arg: any) => void;
    handleDelete?: (arg: any) => void;
    handleAdd?: () => void;
    handleRefresh?: () => void;
}

export default function MainTable({
    data,
    isEditable,
    structure,
    handleAdd,
    handleUpdate,
    handleDelete,
}: thisProps) {

    const [page, setPage] = useState({
        current: 0,
        size: 5,
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [sortColumn, setSortColumn] = useState<sortColumnProps>({
        path: structure.defaultSort || structure.searchPath,
        order: true,
    });


    let sortedData = [...data];


    //sorting by search query filter
    sortedData = useMemo(
        () => (searchQuery ? sortedData.filter((item: any) => item[structure.searchPath].toLowerCase().includes(searchQuery.toLowerCase())) : sortedData),
        [searchQuery, sortedData, structure.searchPath]
    );

    //get total data filtered by search
    const sizeData = sortedData.length;

    //sorting by path
    sortedData = useMemo(
        () => (sortPath(sortedData, sortColumn.path, sortColumn.order)),
        [sortColumn, sortedData]);

    //pagination data
    sortedData = useMemo(
        () => paginate(sortedData, page.current, page.size),
        [page, sortedData]
    );

    return (
        <section className={styles.container_table}>
            {/*  */}
            <div className={styles.printContainer}>

                <button className={styles.printButton}
                    onClick={() => {
                        autoTable(doc, {
                            head: [structure.structure.map((item: any) => item.label)],
                            body: sortedData.map(item => [
                                ...structure.structure.map((cur: any) => item[cur.path])
                            ])
                        });

                        doc.save('attendance_report.pdf');
                    }}><Icon icon="material-symbols:print" />Print</button>
            </div>
            {/*  */}
            <ToolTable
                searchValue={searchQuery}
                changeText={onChangeSearchQuery}
                title={structure.title}
                isHaveAdd={Boolean(handleAdd)}
                handleAdd={handleAdd || (() => { })}
            />

            <BodyTable
                isEditable={isEditable}
                data={sortedData}
                tableProps={structure}
                sortColumn={sortColumn}
                handleSortColumn={onHandleSortColumn}
                deleteColumn={onDelete}
                updateColumn={handleUpdate}
            />
            {/* <select value={page.size} onChange={(e) => onHanldePageChange(e.target.value)}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={100}>100</option>
            </select> */}
            <PaginateTable page={page.current} size={page.size} currentTotal={sortedData.length} total={sizeData} handlePagination={onHandlePagination} />
        </section>
    );

    function onDelete(data: any) {
        if (handleDelete) {
            handleDelete(data);
        }
        // setPage(page => ({
        //     ...page,
        //     current: 0,
        // }));
    }

    // function onHanldePageChange(inputValue: string) {
    //     setPage({ current: 0, size: parseInt(inputValue) });
    // }


    function onHandlePagination(inputValue: number) {
        const currentValue = inputValue * page.size;

        if (currentValue >= sizeData || currentValue < 0) return;

        setPage(page => ({ ...page, current: inputValue }));
    }

    function onChangeSearchQuery(inputValue: string) {
        setSearchQuery(inputValue);
        setPage(page => ({
            ...page,
            current: 0,
        }));
    }

    function onHandleSortColumn(path: string, order = true) {

        const temp = { order, path };
        if (temp.path == sortColumn.path)
            temp.order = temp.order ? false : true;

        setSortColumn({ order: temp.order, path: temp.path });
    }

}