const favMeals = document.querySelector(".fav-meals");
getRandomMeal();
fetchFavMeals();
async function getRandomMeal() {
	const randomResp = await fetch(
		"https://www.themealdb.com/api/json/v1/1/random.php"
	);
	const randomRespData = await randomResp.json();
	const randomMeal = randomRespData.meals[0];
	addMeal(randomMeal, true);
}
async function getMealById(id) {
	const getResp = await fetch(
		"https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
	);
	const getRespData = await getResp.json();
	const getMeal = getRespData.meals[0];
	return getMeal;
}
async function getMealsBySearch(term) {
	const resp = await fetch(
		"www.themealdb.com/api/json/v1/1/search.php?s=" + term
	);
	const searchData = await randomResp.json();
	const searchMeal = searchData.meals[0];
	return searchMeal;
}
function addMeal(mealData, random = false) {
	const meal = document.createElement("div");
	const meals = document.querySelector(".meals");
	meal.classList.add("meal");
	meal.innerHTML = `
					<div class="meal-header">
                     ${random ? `<h3 class="random">Random Recipe</h3>` : ""}
						<img
							src="${mealData.strMealThumb}"
							alt="${mealData.strMeal}"
						/>
					</div>
					<div class="meal-body">
						<h4>${mealData.strMeal}</h4>
						<button class="fav-btn"><i class="fas fa-heart"></i></button>
					</div>`;
	meals.appendChild(meal);
	const btn = meal.querySelector(".meal-body .fav-btn");
	btn.addEventListener("click", () => {
		if (btn.classList.contains("active")) {
			removeMealLS(mealData.idMeal);
			btn.classList.remove("active");
		} else {
			addMealLS(mealData.idMeal);
			btn.classList.toggle("active");
		}
		fetchFavMeals();
	});
}
function getMealsLS() {
	const mealIds = JSON.parse(localStorage.getItem("mealIds"));
	return mealIds === null ? [] : mealIds;
}
function addMealLS(mealId) {
	const mealIds = getMealsLS();
	localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}
function removeMealLS(mealId) {
	const mealIds = getMealsLS();
	localStorage.setItem(
		"mealIds",
		JSON.stringify(mealIds.filter(id => id !== mealId))
	);
	fetchFavMeals();
}
async function fetchFavMeals() {
	// celaning fav meal container
	favMeals.innerHTML = "";
	const mealIds = getMealsLS();
	for (let i = 0; i < mealIds.length; i++) {
		const mealId = mealIds[i];
		let meal = await getMealById(mealId);
		addMealFav(meal);
	}
	// add them to the screen
}
function addMealFav(mealData) {
	const favMeal = document.createElement("li");
	favMeal.innerHTML = `
	<img
		src="${mealData.strMealThumb}"
		alt="${mealData.strMeal}"
	/><span>${mealData.strMeal}</span>
	<button class="clear"><i class="fas fa-window-close"></i></button>`;
	const btn = favMeal.querySelector(".clear");
	btn.addEventListener("click", () => {
		removeMealLS(mealData.idMeal);
	});
	favMeals.appendChild(favMeal);
}

const searchTerm = document.getElementById("search-term");
const searchBtn = document.getElementById("search");
searchBtn.addEventListener("click", () => {
	const search = searchTerm.value;
	getMealsBySearch(search);
});
