const urlCategories = "https://www.themealdb.com/api/json/v1/1/categories.php";

const init = () => {
    addCategories();
    addMeals();
};

init();

async function addCategories() {
    const $categorySection = document.querySelector("#categories");
    if ($categorySection) {
        const response = await fetch(urlCategories);
        const data = await response.json();

        data.categories.forEach(item => {
            const $a = document.createElement("a");
            $a.setAttribute("href", `categorie.html?c=${item.strCategory}`);
            $a.setAttribute("id", item.idCategory);
            const $figure = document.createElement("figure");
            $figure.classList.add(`bg-[url("${item.strCategoryThumb}")]`);
            $figure.classList.add("size-32");
            $figure.classList.add("xl:size-48");
            $figure.classList.add("rounded-full");
            $a.appendChild($figure);
            const $figcaption = document.createElement("figcaption");
            const $p = document.createElement("p");
            $p.classList.add("font-caviar");
            $p.classList.add("text-indigo-700");
            $p.textContent = item.strCategory;
            $figcaption.appendChild($p);
            $figure.appendChild($figcaption);
            $categorySection.appendChild($a);
        });
    }
}

async function addMeals() {
    const $mealSection = document.querySelector("#meals");

    if ($mealSection) {
        const urlParams = new URLSearchParams(window.location.search);
        const category = Object.fromEntries(urlParams.entries()).c;

        // Of zo:
        // const params = new Proxy(new URLSearchParams(window.location.search), {
        //     get: (searchParams, prop) => searchParams.get(prop),
        // });
        // let category = params.c;

        // console.log("Category:");
        // console.log(category);
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
        const data = await response.json();

        data.meals.forEach(meal => {
            const $a = document.createElement("a");
            $a.id = meal.idMeal;
            $a.setAttribute("href", `maaltijd.html?i=${meal.idMeal}`);
            // $a.classList.add(["hover:bg-indigo-100", "hover:text-indigo-800"].join(" "));
            $a.classList.add("hover:bg-indigo-100");
            $a.classList.add("hover:font-bold");
            const $p = document.createElement("p");
            $p.textContent = meal.strMeal;
            $a.appendChild($p);
            $mealSection.appendChild($a);
        });

        const img = getRandomItemFromArray(data.meals).strMealThumb;
        setBannerImage(img);
    }
}

function setBannerImage(imageURL) {
    const $banner = document.querySelector(".banner");
    $banner.classList.add(`bg-[url("${imageURL}")]`)
}

function getRandomItemFromArray(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}


// const categories = data.meals.map(element => element.strCategory);

// const optionList = categories.map(category => `<option value="${category}">${category}</option>`).join('');
// console.log(optionList);
// selectionList.innerHTML = optionList;

// categories.forEach(element => {
//     const option = document.createElement("option");
//     option.setAttribute("value", element);
//     option.textContent = element;
//     selectionList.appendChild(option);
// });

// $button.addEventListener('click', handleButtonClicked);

// function handleButtonClicked(event) {
//     event.preventDefault();
//     localStorage.setItem(`category`, $selectOption.value);
//     showMeals($selectOption.value);
// }

// async function showMeals(foodCategory) {
//     const urlMeals = "https://www.themealdb.com/api/json/v1/1/filter.php?c=" + foodCategory;

//     const response = await fetch(urlMeals);
//     const data = await response.json();
//     const meals = data.meals;

//     for (let i = 0; i < 6; i++) {
//         const randomNumber = Math.floor((Math.random()) * meals.length);
//         const meal = meals[randomNumber];
//         console.log(meal);

//         const $li = document.createElement('li');
//         $li.classList.add('menuItem');

//         const $img = document.createElement('img');
//         $img.setAttribute('src', meal.strMealThumb);

//         const $p = document.createAttribute('p');
//         $p.textContent = meal.strMeal;

//         $li.appendChild($img);
//         $li.appendChild($p);
//         $maaltijden.appendChild($li);
//     }
//  }



