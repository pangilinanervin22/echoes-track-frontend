"use client"

import IconArrowLeft_svg from './assets/IconArrowLeft_svg';
import styles from './Table.module.scss'
import IconArrowRight_svg from './assets/IconArrowRight_svg';

interface thisProps {
    size: number,
    page: number,
    total: number;
    currentTotal: number;
    handlePagination: Function;
}

export default function PaginateTable({ page, size, total, currentTotal, handlePagination }: thisProps) {
    const pageStart = page * size;
    const pageEnd = pageStart + currentTotal;

    return (
        <section className={styles.paginate_table}>
            <p>{`${pageStart + 1}-${pageEnd} of ${total}`}</p>
            <div className={pageStart + 1 === 1 ? styles.disable : ""} onClick={() => handlePagination(page - 1)}>
                <IconArrowLeft_svg />
            </div>
            <div className={pageEnd === total ? styles.disable : ""} onClick={() => handlePagination(page + 1)}>
                <IconArrowRight_svg />
            </div>
        </section>
    )
}
