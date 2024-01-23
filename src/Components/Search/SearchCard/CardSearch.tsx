import style from './CardSearch.module.scss';
export default function CardSearch() {
	return (
		<div className={style.SearchCard_wrapper}>
			<div className={style.img_wrapper}>
				<img
					className={style.card_img}
					src="https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg"
					alt="photo of"
				/>
			</div>

			<div className={style.card_container}>
				<div className={style.super_wrapper}>
					<h2>
						Lue Kely <br /> Anunciacion
					</h2>
					<div className={style.info_wrapper}>
						<p>Current Room:</p>
						<h1>304</h1>
					</div>
				</div>
			</div>
		</div>
	);
}
