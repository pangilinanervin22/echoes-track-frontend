import React, { useState } from 'react';
import ScanHeader from '../../Components/Scan/ScanHeader/ScanHeader';
import styles from './Scan.module.scss';
import { Outlet } from 'react-router-dom';

export default function Scan() {
	return (
		<div className={styles.main_wrapper}>
			<ScanHeader />
			<Outlet />
		</div>
	);
}
