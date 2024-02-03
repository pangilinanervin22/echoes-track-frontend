"use client"

import React, { useMemo, useState } from "react";
import BodyTable from "./BodyTable";
import ToolTable from "./ToolTable";
import PaginateTable from "./PaginateTable";
import paginate from "./utils/paginate";
import sortPath from "./utils/sortPath";
import styles from "./Table.module.scss";

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
    handleUpdate: Function;
    handleDelete: Function;
    handleAdd?: Function;
    handleRefresh?: Function;
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
            <PaginateTable page={page.current} size={page.size} currentTotal={sortedData.length} total={sizeData} handlePagination={onHandlePagination} />
        </section>
    );

    function onDelete(data: any) {
        handleDelete(data);
        // setPage(page => ({
        //     ...page,
        //     current: 0,
        // }));
    }

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