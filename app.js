// UI Variables
const addBtn = document.getElementById("add-btn");

// Pair Object
class Pair {
    constructor(pairOne, pairTwo, id){
        this.pairOne = pairOne;
        this.pairTwo = pairTwo;
        this.id = id;
    }
}

// UI object
class UI {
    addCard(){
        const gridArea = document.querySelector(".grid-area");
        const addContainer = document.querySelector(".add-container");
        const card = document.createElement("div");
        card.className = "card";
        card.id = `${Date.now()}`
        card.innerHTML = `
        <div id="form-container">
            <form id="form">
                <input type="text" id="pair1" placeholder="Ex: btc">
                <input type="text" id="pair2" placeholder="Ex: usdt">
                <input type="submit" id="submit-btn" value="SUBMIT">
            </form>
        </div>
        <div class="price-container">
            <div id="show-price">
                <p><span id="first-pair">BTC</span> / <span id="last-pair">USDT</span></p>
                <p id="stock-price">---</p>
                <a id="go-to" target="_blank">Go To Pair <i class="fa-solid fa-arrow-right"></i></a>
            </div>
        </div>
        <div class="delete">
            <a id="delete-btn" aria-label="delete button"><i class="fa-solid fa-xmark fa-2x"></i></a>
        </div>
        `

        gridArea.insertBefore(card, addContainer);
        addBtn.disabled = true;

        const ui = new UI;
        const deleteBtns = document.querySelectorAll("#delete-btn");
        // console.log(deleteBtn)
        deleteBtns.forEach(function(deleteBtn){
            deleteBtn.addEventListener("click", ui.deleteCard);
        })
    }

    checkCards(){
        const form = document.getElementById("form");

        form.addEventListener("submit", function(e){
            const pair1 = document.getElementById("pair1");
            const pair2 = document.getElementById("pair2");
            const pair = new Pair(pair1.value, pair2.value, e.target.parentElement.parentElement.id)
            form.remove();
            addBtn.disabled = false;
            let cards = document.querySelectorAll(".card");

            // cards.forEach(function(card, index){
            //     let children = Array.from(card.children);
            //     // children = children.reverse();
            //     children.forEach(function(child){
            //         if(child.className === "price-container"){
            //             child.style.display = "block";
            //         }
            //     })
                
            // })
            // const a = document.getElementById("go-to");
            // a.setAttribute("href", `https://www.binance.com/en/trade/${pair1.value.toUpperCase()}_${pair2.value.toUpperCase()}`);
            // const firstPair = document.getElementById("first-pair");
            // firstPair.textContent = pair1.value.toUpperCase();
            // const lastPair = document.getElementById("last-pair");
            // lastPair.textContent = pair2.value.toUpperCase();

            // const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${pair1.value.toLowerCase()}${pair2.value.toLowerCase()}@trade`);
            // const stockPriceElement = document.getElementById("stock-price");
            // let lastPrice = null;

            // ws.onmessage = (e) => {
            //     let stockObject = JSON.parse(e.data);
            //     let price = parseFloat(stockObject.p);
            //     if(price < 1){
            //         price.toFixed(4);
            //     }else{
            //         price.toFixed(2);
            //     }
            //     // console.log(stockObject);
            //     cards[cards.length - 1].children[1].children[0].children[1].textContent = price
            //     cards[cards.length - 1].children[1].children[0].children[1].style.color = !lastPrice || lastPrice === price ? "black" : price > lastPrice ? "green" : "red"
            //     lastPrice = price;
            

            cards[cards.length - 1].children[1].style.display = "block";
            cards[cards.length - 1].children[1].children[0].children[2].setAttribute("href", `https://www.binance.com/en/trade/${pair1.value.toUpperCase()}_${pair2.value.toUpperCase()}`);
            const firstPairs = document.querySelectorAll("#first-pair") 
            const lastPairs = document.querySelectorAll("#last-pair") 
            firstPairs[cards.length - 1].textContent = pair1.value.toUpperCase();
            lastPairs[cards.length - 1].textContent = pair2.value.toUpperCase();

            const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${pair1.value.toLowerCase()}${pair2.value.toLowerCase()}@trade`);
            const stockPriceElement = document.getElementById("stock-price");
            let lastPrice = null;

            ws.onmessage = (e) => {
                let stockObject = JSON.parse(e.data);
                let price = parseFloat(stockObject.p);
                if(price < 1){
                    price.toFixed(4);
                }else{
                    price.toFixed(2);
                }
                // console.log(stockObject);
                cards[cards.length - 1].children[1].children[0].children[1].textContent = price
                cards[cards.length - 1].children[1].children[0].children[1].style.color = !lastPrice || lastPrice === price ? "black" : price > lastPrice ? "green" : "red"
                lastPrice = price;
            }
            Store.addPair(pair);
            e.preventDefault();
        })
    }

    deleteCard(e) {
        let cards = document.querySelectorAll(".card");
        if(e.target.id === "delete-btn"){
            Store.removePair(e.target.parentElement.parentElement.id);
            console.log(e.target.parentElement.parentElement.id)
            e.target.parentElement.parentElement.remove();
        }else if(e.target.parentElement.id === "delete-btn"){
            Store.removePair(e.target.parentElement.parentElement.parentElement.id);
            console.log(e.target.parentElement.parentElement.parentElement.id)
            e.target.parentElement.parentElement.parentElement.remove();
        }

        let lastDisabled = addBtn.disabled;

        if(lastDisabled){
            addBtn.disabled = true;
        }
        else{
            addBtn.disabled = false;
        }

        if(cards.length <= 1){
            addBtn.disabled = false;
        }

        e.preventDefault();
    }
}

// Local Store Object
class Store {
    static getPairs(){
        let pairs;
        if(localStorage.getItem("pairs") === null){
            pairs = [];
        }else{
            pairs = JSON.parse(localStorage.getItem("pairs"));
        }
        return pairs;
    }

    static displayPairs(){
        const pairs = Store.getPairs()
        pairs.forEach(function(pair, index){
            const ui = new UI;
            ui.addCard();
            addBtn.disabled = false;
            form.remove();
            let cards = document.querySelectorAll(".card");
            cards[index].id = pair.id;
            cards[cards.length - 1].children[1].style.display = "block";
            cards[cards.length - 1].children[1].children[0].children[2].setAttribute("href", `https://www.binance.com/en/trade/${pair.pairOne.toUpperCase()}_${pair.pairTwo.toUpperCase()}`);
            const firstPairs = document.querySelectorAll("#first-pair") 
            const lastPairs = document.querySelectorAll("#last-pair") 
            firstPairs[cards.length - 1].textContent = pair.pairOne.toUpperCase();
            lastPairs[cards.length - 1].textContent = pair.pairTwo.toUpperCase();

            const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${pair.pairOne.toLowerCase()}${pair.pairTwo.toLowerCase()}@trade`);
            const stockPriceElement = document.getElementById("stock-price");
            let lastPrice = null;

            ws.onmessage = (e) => {
                let stockObject = JSON.parse(e.data);
                let price = parseFloat(stockObject.p);
                if(price < 1){
                    price.toFixed(4);
                }else{
                    price.toFixed(2);
                }
                // console.log(stockObject);
                cards[cards.length - 1].children[1].children[0].children[1].textContent = price
                cards[cards.length - 1].children[1].children[0].children[1].style.color = !lastPrice || lastPrice === price ? "black" : price > lastPrice ? "green" : "red"
                lastPrice = price;
            }
        })
    }

    static addPair(pair){
        const pairs = Store.getPairs();
        pairs.push(pair);
        localStorage.setItem("pairs", JSON.stringify(pairs));
    }

    static removePair(id){
        const pairs = Store.getPairs();
        pairs.forEach(function(pair, index){
            if(pair.id === id){
                pairs.splice(index, 1);
            }
        })
        localStorage.setItem("pairs", JSON.stringify(pairs));
    }
}

document.addEventListener("DOMContentLoaded", Store.displayPairs);

addBtn.addEventListener("click", function(e){
    const ui = new UI;
    ui.addCard();
    ui.checkCards();

    e.preventDefault();
})







// const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");
// const stockPriceElement = document.getElementById("stock-price");
// let lastPrice = null;

// ws.onmessage = (e) => {
//     let stockObject = JSON.parse(e.data);
//     let price = parseFloat(stockObject.p).toFixed(2);
//     // console.log(stockObject);
//     stockPriceElement.textContent = price
//     stockPriceElement.style.color = !lastPrice || lastPrice === price ? "black" : price > lastPrice ? "green" : "red"
//     lastPrice = price;
// }