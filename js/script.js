const urlCategories = "https://www.themealdb.com/api/json/v1/1/categories.php";
const $categorySection = document.querySelector("#categories");
const $mealSection = document.querySelector("#meals");
const $recipe = document.querySelector("#recipe");


const init = () => {
    if ($categorySection) {
        addCategories();
    }
    if ($mealSection) {
        addMeals();
    }
    if ($recipe) {
        addMealInfo();
    }
};

init();

async function addCategories() {
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

async function addMeals() {
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
        $a.textContent = meal.strMeal;
        $mealSection.appendChild($a);
    });

    const img = getRandomItemFromArray(data.meals).strMealThumb;
    setBannerImage(img);
}

async function addMealInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const mealID = Object.fromEntries(urlParams.entries()).i;

    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    const data = await response.json();

    const mealData = data.meals[0];
    const ingredients = [];

    for (let i = 1; i < 21; i++) {
        if ((mealData[`strIngredient${i}`] != "") && (mealData[`strIngredient${i}`] != null)) {
            const ingredient = {
                description: '',
                measure: '',
                thumb: ''
            };

            const ingredientString = mealData[`strIngredient${i}`];
            ingredient.description = ingredientString;
            ingredient.measure = mealData[`strMeasure${i}`];
            ingredient.thumb = `https://www.themealdb.com/images/ingredients/${ingredientString.replaceAll(" ", "%20")}-Small.png`;

            ingredients.push(ingredient);
        }
    }

    const $title = document.querySelector("#mealTitle");
    const $backButton = document.querySelector("#backToCategoryButton");
    const $mealImage = document.querySelector("#mealPicture");
    const $instructions = document.querySelector("#instructionsSection");

    $title.innerHTML = mealData.strMeal;

    $backButton.innerHTML = `Terug naar ${mealData.strCategory}`;
    $backButton.setAttribute("href", `categorie.html?c=${mealData.strCategory}`);

    $mealImage.setAttribute("src", mealData.strMealThumb);

    // const $instructions = document.querySelector("#instructions");
    // $instructions.innerHTML = mealData.strInstructions.replaceAll("\r\n", "<br>");
    // // $instructions.innerHTML = mealData.strInstructions.replaceAll("\r\n", "</p> <p>");

    const instructionsParagraphs = mealData.strInstructions.split("\r\n" || "\r\n\r\n");
    instructionsParagraphs.forEach(string => {
        const $p = document.createElement("p");
        $p.textContent = string;
        console.log(string);
        $p.classList.add("font-caviar");
        $p.classList.add("text-indigo-950");
        $instructions.appendChild($p);
    });

    addIngredients(ingredients);
}

function setBannerImage(imageURL) {
    const $banner = document.querySelector(".banner");
    $banner.classList.add(`bg-[url("${imageURL}")]`)
}

function getRandomItemFromArray(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

function addIngredients(ingredients) {
    const $ingredients = document.querySelector("#ingredients");
    let colorCode = 1;

    ingredients.forEach(ingredient => {
        const $div = document.createElement("div");
        const $img = document.createElement("img");
        const $spanIngr = document.createElement("span");
        const $pIngredient = document.createElement("p");
        const $spanMeas = document.createElement("span");
        const $pMeasure = document.createElement("p");

        $img.classList = "my-1 size-10";
        $img.setAttribute("src", ingredient.thumb);
        $div.classList = "hidden md:inline-block w-full";
        $div.appendChild($img);

        $pIngredient.classList = "flex col-span-2 my-1 h-full items-center";
        $pIngredient.innerHTML = ingredient.description;

        $pMeasure.classList = "flex col-span-3 my-1 h-full items-center";
        $pMeasure.innerHTML = ingredient.measure;

        if (colorCode === -1) {
            $div.classList.add("bg-indigo-50");
            $pIngredient.classList.add("bg-indigo-50");
            $pMeasure.classList.add("bg-indigo-50");
        }

        $ingredients.appendChild($div);
        $ingredients.appendChild($pIngredient);
        $ingredients.appendChild($pMeasure);

        colorCode = colorCode * -1;
    });
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



