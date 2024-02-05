/* eslint-disable @typescript-eslint/ban-types */
"use client"

import styles from './Table.module.scss'
import IconSearch_svg from './assets/IconSearch_svg';
import IconAdd_svg from './assets/IconAdd_svg';

interface thisProps {
  searchValue: string;
  isHaveAdd: boolean;
  title?: string;
  changeText: Function;
  handleAdd?: Function;
}

export default function ToolTable({ searchValue, title, changeText, handleAdd, isHaveAdd }: thisProps) {

  return (
    <section className={styles.tool_table}>
      <div className={styles.search}>
        <input type="text" placeholder="Search Name" title="name"
          onChange={(event) => changeText(event.target.value)} value={searchValue} />
        <IconSearch_svg />
      </div>
      {isHaveAdd &&
        <div className={styles.add_button} onClick={() => handleAdd!()}>
          <IconAdd_svg />
          <button>Add {title}</button>
        </div>
      }
    </section>
  )
}
