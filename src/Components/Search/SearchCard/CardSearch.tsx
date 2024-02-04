import { User } from '../../../pages/Admin/Users/useUsers';
import style from './CardSearch.module.scss';



export default function CardSearch({ user }: { user: User }) {
	console.log(user.name, 'user');

	return (
		<div className={style.SearchCard_wrapper}>
			<div className={style.img_wrapper}>
				<img className={style.card_img} src={user.image} alt="photo of" />
			</div>

			<div className={style.card_container}>
				<div className={style.super_wrapper}>
					<h2>
						{user.name}
					</h2>
					<div className={style.info_wrapper}>
						<p>Current Room:</p>
						<h1>{user.room || "N/A"}</h1>
					</div>
				</div>
			</div>
		</div>
	);
}
