/**
            SOFTWARE DESIGN & ANALYSIS SEMESTER PROJECT
                    i190412, i190585, i190653
                ONLINE MOBILE STORE APPLICATION
- USE CASE I, Add to Cart, find getBagButtons() function in Controller class
- USE CASE II, Clear Cart, find cartLogic() function in Controller class
- USE CASE III, Remove from Cart, find cartLogic() function in Controller class
- USE CASE IV, Add to Wishlist, find getWishlistButtons() function in Controller class
- USE CASE V, Clear Wishlist, find wishlistLogic() function in Controller class
- USE CASE VI, Remove from Wishlist, find wishlistLogic() function in Controller class
- USE CASE VII, Add All to Cart, find wishlistLogic() function in Controller class
*/

// CONTENTFUL CLIENT CREATION
// Data is imported from online data bank, Contentful.com
const client = contentful.createClient({
    // This is the space ID. 
    // A space is like a project folder in Contentful terms
    space: "jb2xypj7kuwr",
    // This is the access token for this space. 
    // Normally you get both ID and the token in the Contentful web app
    accessToken: "ZAkwGCjwx3WwzVay1XH2NmYOVJ2lha2rBNl1iEeXRt0"
});

// Variables, mostly Document Object Model holders
const clearCartButton = document.querySelector(".clear-cart");
const clearWishlistButton = document.querySelector(".clear-wishlist");
const addAllToCartButton = document.querySelector(".add-all-to-cart");

const removeCartItemButton = document.querySelector(".remove-item-cart")
const removeWishlistItemButton = document.querySelector(".remove-item-wishlist")

const cartButton = document.querySelector(".cart-btn");
const wishlistButton = document.querySelector(".wishlist-btn");

const closeCartButton = document.querySelector(".close-cart");
const closeWishlistButton = document.querySelector(".close-wishlist");

const cartDOM = document.querySelector(".cart");
const wishlistDOM = document.querySelector(".wishlist");

const cartOverlay = document.querySelector(".cart-overlay"); //Counter that appears over cart icon
const wishlistOverlay = document.querySelector(".wishlist-overlay"); //Counter that appears over wishlist icon

const cartContent = document.querySelector(".cart-content");
const wishlistContent = document.querySelector(".wishlist-content");

const cartItems = document.querySelector(".cart-items");
const wishlistItems = document.querySelector(".wishlist-items");

const cartTotal = document.querySelector(".cart-total");
const wishlistTotal = document.querySelector(".wishlist-total");

let cart = []
let wishlist = []

let cartButtonsDOM = []
let wishlistButtonsDOM = []

const productsDOM = document.querySelector(".products-center");

class Products
{
    constructor ()
    {
    }

    async getProducts()
    {
        console.log("Asynchronous getProducts() function, in Products Class")
        try {
            // Getting data from Contentful plugin
            let contentful = await client.getEntries({
                content_type: "mobilePhoneProduct"
            })
            console.log(contentful)
            // Commenting out part of code that found products from JSON
            //let result = await fetch('products.json')
            //let data = await result.json()
            //let productsList = data.items
            let productsList = contentful.items
            // Code below is just to restructure Contentful data
            // into a more readable and code-accessible view
            productsList = productsList.map( item => {
                const {title, price} = item.fields
                const {id} = item.sys
                const image = item.fields.image.fields.file.url
                const amount = 0
                // Now we map all of this, by returning these fields to productsList array
                return {title, price, id, image}
            } )
            console.log("In getProducts() function, list of products:")
            console.log(productsList)
            // Our data is now formatted into a readable, code-accessible form
            return productsList
        } 
        catch (error) {
            console.log(error);
        }
    }
}

class Handler 
{
    displayProducts(products)
    {
        console.log("displayProducts() function, in UI Class")
        //console.log(productsList)
        let result = ''
        // Below, using Template Literals to write HTML for each item
        products.forEach(product => {
            // Using '+=' instead of '=' for appending items, not overwriting
            result += `
            <!-- Single Product -->
            <article class="product">
                <div class="img-container">
                    <img src=${product.image} 
                        alt="Product" 
                        class="product-img">
                    <button class="bag-btn" data-id=${product.id}>
                        <i class="fa fa-shopping-cart"></i>
                        Add to Cart
                    </button>
                    <button class="wish-btn" data-id=${product.id}>
                        <i class="far fa-heart"></i>
                        Add to Wishlist
                    </button>
                </div>
                <h3>${product.title}</h3>
                <h4>Rs. ${product.price}</h4>
            </article>
            <!-- end of Single Product -->
            `
        })
        productsDOM.innerHTML = result
    }

    getBagButtons()
    {
        console.log("getBagButtons() function, in UI Class")
        // [... ] creates an array out of a nodeList
        const buttons = [...document.querySelectorAll(".bag-btn")]
        cartButtonsDOM = buttons
        //console.log(buttons)
        // Now we iterate along this to get id (corresponding to products array)
        // of each object, for use in storing
        buttons.forEach(button => {
            let id = button.dataset.id
            //console.log(id)
            // Now we check if each of these buttons hosts an item that is in the cart
            let inCart = cart.find(item => item.id === id)
            // Creating logic for the clicking of 'Add To Cart' button
            // -------------- USE CASE I -- ADD TO CART --------------
            console.log("-- USE CASE I: ADD TO CART --")
            if(inCart)
            {
                // Show message, disable the button
                button.innerText = "Added to Cart"
                button.disabled = true
            }
            button.addEventListener('click', (event) => {
                // Show message, disable the button
                event.target.innerText = "Added to Cart"
                event.target.disabled = true
                // Find the relevant product in products array, set amount to 1
                let cartItem = {...Inventory.getProduct(id), amount:1}
                // Add it to the cart list, along with all previous values
                cart = [...cart, cartItem]
                // Save cart to local storage
                Inventory.saveCart(cart)
                // Set the cart values
                this.setCartValues(cart)
                // Display the cart items
                this.addCartItem(cartItem)
                // Display the cart window
                this.showCart()
            })
        })
    }

    refreshBagButtons()
    {
        console.log("refreshBagButtons() function, in UI Class")
        // This function is a clone of getBagButtons()
        // Used to redisplay 'Add To Cart' option on the product image
        // [... ] creates an array out of a nodeList
        const buttons = [...document.querySelectorAll(".bag-btn")]
        cartButtonsDOM = buttons
        //console.log(buttons)
        // Now we iterate along this to get id (corresponding to products array)
        // of each object, for use in storing
        buttons.forEach(button => {
            let id = button.dataset.id
            //console.log(id)
            // Now we check if each of these buttons hosts an item that is in the cart
            let inCart = cart.find(item => item.id === id)
            // Creating logic for the clicking of 'Add To Cart' button
            if(inCart)
            {
                // Show message, disable the button
                button.innerText = "Added to Cart"
                button.disabled = true
            }
            button.addEventListener('click', (event) => {
                // Show message, disable the button
                event.target.innerText = "Added to Cart"
                event.target.disabled = true
                // Display the cart window
                this.showCart()
            })
        })
    }

    getWishlistButtons()
    {
        console.log("getWishlistButtons() function, in UI Class")
        // [... ] creates an array out of a nodeList
        const buttons = [...document.querySelectorAll(".wish-btn")]
        wishlistButtonsDOM = buttons
        //console.log(buttons)
        // Now we iterate along this to get id (corresponding to products array)
        // of each object, for use in storing
        buttons.forEach(button => {
            let id = button.dataset.id
            //console.log(id)
            // Now we check if each of these buttons hosts an item that is in the wishlist
            let inWishlist = wishlist.find(item => item.id === id)
            // Creating logic for the clicking of 'Add To WISHLIST' button
            // -------------- USE CASE IV -- ADD TO WISHLIST --------------
            console.log("-- USE CASE IV: ADD TO WISHLIST --")
            if(inWishlist)
            {
                // Show message, disable the button
                button.innerText = "Added to Wishlist"
                button.disabled = true
            }
            button.addEventListener('click', (event) => {
                // Show message, disable the button
                event.target.innerText = "Added to Wishlist"
                event.target.disabled = true
                // Find the relevant product in products array, set amount to 1
                let wishlistItem = {...Inventory.getProduct(id), amount:1}
                // Add it to the cart list, along with all previous values
                wishlist = [...wishlist, wishlistItem]
                // Save wishlist to local storage
                Inventory.saveWishlist(wishlist)
                // Set the wishlist values
                this.setWishlistValues(wishlist)
                // Display the wishlist items
                this.addWishlistItem(wishlistItem)
                // Display the wishlist window
                //this.showWishlist()
            })
        })
    }

    setCartValues(cart) 
    {
        console.log("setCartValues() function, in UI Class")
        let tempTotal = 0
        let itemsTotal = 0
        cart.map(item => {
            tempTotal += item.price * item.amount
            itemsTotal += item.amount
        })
        // Storing itemsTotal & tempTotal in actual global variables
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2))
        cartItems.innerText = itemsTotal
        //console.log(cartTotal, cartItems)
    }

    setWishlistValues(wishlist)
    {
        console.log("setWishlistValues() function, in UI Class")
        let itemsTotal = 0
        wishlist.map(item => {
            itemsTotal += item.amount
        })
        // Storing itemsTotal & tempTotal in actual global variables
        wishlistItems.innerText = itemsTotal
        //console.log(wishlistTotal, wishlistItems)
    }

    addCartItem(cartItem)
    {
        console.log("addCartItem() function, in UI Class")
        // Displaying the items that are added to cart, in the cart-content div
        const div = document.createElement('div')
        div.classList.add('cart-item')
        div.innerHTML = `
            <img src=${cartItem.image} 
            alt="product">
            <div>
                <h4>${cartItem.title}</h4>
                <h5>Rs. ${cartItem.price}</h5>
                <span class="remove-item" data-id="${cartItem.id}">Remove Item</span>
            </div>
            <div>
                <i class="fas fa-chevron-up" data-id="${cartItem.id}"></i>
                <p class="item-amount">${cartItem.amount}</p>
                <i class="fas fa-chevron-down" data-id="${cartItem.id}"></i>
            </div>
        `
        // For further items added, append them into the same div
        cartContent.appendChild(div)
    }

    addWishlistItem(wishlistItem)
    {
        console.log("addWishlistItem() function, in UI Class")
        // Displaying the items that are added to wishlist, in the wishlist-content div
        const div = document.createElement('div')
        div.classList.add('wishlist-item')
        div.innerHTML = `
            <img src=${wishlistItem.image} 
            alt="product">
            <div>
                <h4>${wishlistItem.title}</h4>
                <h5>Rs. ${wishlistItem.price}</h5>
                <span class="remove-wishlist-item" data-id="${wishlistItem.id}">Remove Item</span>
            </div>
            <!--div>
                <i class="fas fa-chevron-up" data-id="${wishlistItem.id}"></i>
                <p class="item-amount">${wishlistItem.amount}</p>
                <i class="fas fa-chevron-down" data-id="${wishlistItem.id}"></i>
            </div-->
        `
        // For further items added, append them into the same div
        wishlistContent.appendChild(div)
    }

    showCart()
    {
        console.log("showCart() function, in UI Class")
        // Obtaining already created DOMs of the disappearing cart
        // By adding css classes, we trigger cart to display
        cartOverlay.classList.add("transparentBcg")
        cartDOM.classList.add("showCart")
        console.log("In showCart() function, cart:")
        console.log(cart)
    }

    showWishlist()
    {
        console.log("showWishlist() function, in UI Class")
        // Obtaining already created DOMs of the disappearing cart
        // By adding css classes, we trigger cart to display
        wishlistOverlay.classList.add("transparentBcg1")
        wishlistDOM.classList.add("showWishlist")
        console.log("In showWishlist() function, wishlist:")
        console.log(wishlist)
    }

    hideCart()
    {
        console.log("hideCart() function, in UI Class")
        // Obtaining already created DOMs of the disappearing cart
        // By removing css classes, we trigger cart to collapse
        cartOverlay.classList.remove("transparentBcg")
        cartDOM.classList.remove("showCart")
        console.log("In hideCart() function, cart:")
        console.log(cart)
    }

    hideWishlist()
    {
        console.log("hideWishlist() function, in UI Class")
        // Obtaining already created DOMs of the disappearing cart
        // By removing css classes, we trigger cart to collapse
        wishlistOverlay.classList.remove("transparentBcg1")
        wishlistDOM.classList.remove("showWishlist")
        console.log("In hideWishlist() function, wishlist:")
        console.log(wishlist)
    }

    populateCart()
    {
        console.log("populateCart() function, in UI Class")
        cart.forEach(cartItem => this.addCartItem(cartItem))
        console.log("In populateCart() function, cart:")
        console.log(cart)
    }

    populateWishlist()
    {
        console.log("populateWishlist() function, in UI Class")
        wishlist.forEach(wishlistItem => this.addWishlistItem(wishlistItem))
        console.log("In populateWishlist() function, wishlist:")
        console.log(wishlist)
    }

    getSingleButton(id)
    {
        console.log("getSingleButton() function, in UI Class")
        // Return the button for which the id matches in the cartButtonsDOM array 
        console.log("In getSingleButton() function, cartButtonsDOM:")
        console.log(cartButtonsDOM)
        return cartButtonsDOM.find(button => button.dataset.id === id)
    }

    getSingleButton1(id)
    {
        console.log("getSingleButton1() function, in UI Class")
        // Return the button for which the id matches in the wishlistButtonsDOM array 
        console.log("In getSingleButton1() function, wishlistButtonsDOM:")
        console.log(wishlistButtonsDOM)
        return wishlistButtonsDOM.find(button => button.dataset.id === id)
    }

    removeCartItem(id)
    {
        console.log("removeCartItem() function, in UI Class")
        // Filter out removed cart item id's
        cart = cart.filter(item => item.id !== id)
        // Update cart array
        this.setCartValues(cart)
        console.log("In function removeCartItem(), cart: ")
        console.log(cart)
        // Save new cart to local storage
        Inventory.saveCart(cart)
        // Make sure that once removed from wishlist, that product again 
        // shows 'Add to Wishlist'
        let button = this.getSingleButton(id)
        console.log("In function removeCartItem(), button: ")
        console.log(button)
        button.disabled = false
        button.innerHTML = `
        <i class="fa fa-shopping-cart"></i>
            Add to Cart
        `
    }

    removeWishlistItem(id)
    {
        console.log("removeWishlistItem() function, in UI Class")
        // Filter out removed cart item id's
        wishlist = wishlist.filter(item => item.id !== id)
        // Update cart array
        this.setWishlistValues(wishlist)
        console.log("In function removeWishlistItem(), wishlist: ")
        console.log(wishlist)
        // Save new cart to local storage
        Inventory.saveWishlist(wishlist)
        // Make sure that once removed from cart, that product again shows 'Add to Cart'
        let button = this.getSingleButton1(id)
        console.log("In function removeWishlistItem(), button: ")
        console.log(button)
        button.disabled = false
        button.innerHTML = `
        <i class="far fa-heart"></i>
            Add to Wishlist
        `
    }

    addAllToCart()
    {  
        console.log("addAllToCart() function, in UI Class")
        cart = cart.concat(wishlist)
        this.setCartValues(cart)
        this.populateCart()
        Inventory.saveCart(cart)
        this.showCart()
        this.refreshBagButtons()
        this.hideWishlist()
        this.clearWishlist()  
        Inventory.saveWishlist(wishlist)
    }

    clearCart()
    {
        console.log("clearCart() function, in UI Class")
        // Mapping selected cart items into cartItems array
        let cartItems = cart.map(item => item.id)
        // Remove each item from the HTML
        cartItems.forEach(id => this.removeCartItem(id))
        // Remove from the DOM array containing references
        while(cartContent.children.length > 0)
        {
            cartContent.removeChild(cartContent.children[0])
        }        
        this.hideCart()
        console.log("In clearCart() function, cart: ")
        console.log(cart)
    } 

    clearWishlist()
    {
        console.log("clearWishlist() function, in UI Class")
        // Mapping selected cart items into wishlistItems array
        let wishlistItems = wishlist.map(item => item.id)
        // Remove each item from the HTML
        wishlistItems.forEach(id => this.removeWishlistItem(id))
        // Remove from the DOM array containing references
        while(wishlistContent.children.length > 0)
        {
            wishlistContent.removeChild(wishlistContent.children[0])
        }        
        this.hideWishlist()
        console.log("In clearWishlist() function, wishlist: ")
        console.log(wishlist)
    }

    cartLogic()
    {
        console.log("cartLogic() function, in UI Class")
        // -------------- USE CASE II -- CLEAR CART --------------
        clearCartButton.addEventListener('click', () => {
            console.log("-- USE CASE II - CLEAR CART --")
            this.clearCart()
        })
        // -------------- USE CASE III -- REMOVE FROM CART --------------
        cartContent.addEventListener('click', event => {
            console.log("-- USE CASE III - REMOVE FROM CART --")
            if(event.target.classList.contains("remove-item"))
            {
                // Assigning the target and the ID of item to variables
                let removeCartItem = event.target
                let id = removeCartItem.dataset.id
                console.log("In cartlogic(), id of selected item:")
                console.log(removeCartItem.dataset.id)
                // Remove the item from the DOM
                cartContent.removeChild(removeCartItem.parentElement.parentElement)
                // Remove the item from the cart array
                this.removeCartItem(id)
            }
            else if(event.target.classList.contains("fa-chevron-up"))
            {
                // Assigning the target and the ID of item to variables
                let incrementAmount = event.target
                let id = incrementAmount.dataset.id
                // Find relevant item using ID, within cart array
                let tempItem = cart.find(item => item.id === id)
                // Increment
                tempItem.amount++
                // Save new cart values in local storage and in array
                Inventory.saveCart(cart)
                this.setCartValues(cart)
                // Display new count in DOM
                incrementAmount.nextElementSibling.innerText = tempItem.amount
            }
            else if(event.target.classList.contains("fa-chevron-down"))
            {
                // Assigning the target and the ID of item to variables
                let decrementAmount = event.target
                let id = decrementAmount.dataset.id
                // Find relevant item using ID, within cart array
                let tempItem = cart.find(item => item.id === id)
                // Decrement
                tempItem.amount--
                // If count goes to zero, remove item
                // Functionality for removing same as above
                if(tempItem.amount > 0)
                {
                    // Save new cart values in local storage and in array
                    Inventory.saveCart(cart)
                    this.setCartValues(cart)
                    // Display new count in DOM
                    decrementAmount.previousElementSibling.innerText = tempItem.amount
                }
                else
                {
                    // Remove the item from the DOM
                    cartContent.removeChild(decrementAmount.parentElement.parentElement)
                    // Remove the item from the cart array
                    this.removeCartItem(id)
                }
            }
        })
    }

    wishlistLogic()
    {
        console.log("wishlistLogic() function, in UI Class")
        // -------------- USE CASE V -- ADD ALL TO CART --------------
        addAllToCartButton.addEventListener('click', () => {
            console.log("-- USE CASE V - ADD ALL TO CART --")
            this.addAllToCart()
        })
        // -------------- USE CASE VI -- CLEAR WISHLIST --------------
        clearWishlistButton.addEventListener('click', () => {
            console.log("-- USE CASE VI - CLEAR WISHLIST --")
            this.clearWishlist()
        })
        // -------------- USE CASE VII -- REMOVE FROM WISHLIST --------------
        wishlistContent.addEventListener('click', event => {
            console.log("-- USE CASE VII - REMOVE FROM WISHLIST --")
            if(event.target.classList.contains("remove-wishlist-item"))
            {
                // Assigning the target and the ID of item to variables
                let removeWishlistItem = event.target
                let id = removeWishlistItem.dataset.id
                console.log("In wishlistlogic(), id of selected item:")
                console.log(removeWishlistItem.dataset.id)
                // Remove the item from the DOM
                wishlistContent.removeChild(removeWishlistItem.parentElement.parentElement)
                // Remove the item from the wishlist array
                this.removeWishlistItem(id)
            }
        })
    }

    setupApp()
    {
        console.log("setupApp() function, in UI Class")
        // This ftn ensures that we reload saved data from local storage
        cart = Inventory.getCart()
        wishlist = Inventory.getWishlist()

        this.setCartValues(cart)
        this.setWishlistValues(wishlist)

        this.populateCart(cart)
        this.populateWishlist(wishlist)

        cartButton.addEventListener('click', this.showCart)
        wishlistButton.addEventListener('click', this.showWishlist)

        closeCartButton.addEventListener('click', this.hideCart)
        closeWishlistButton.addEventListener('click', this.hideWishlist)
    }
}

class Inventory 
{
    static saveProducts(products)
    {
        console.log("saveProducts() function, in Inventory Class")
        localStorage.setItem("products", JSON.stringify(products))
    }

    static getProduct(id)
    {
        console.log("getProducts() function, in Inventory Class")
        // Creating products array via a JSON parse on the items in local storage
        // keeping in mind that any items in local storage are the cart items
        let products = JSON.parse(localStorage.getItem('products'))
        // Find the product we need from this local storage imported array
        return products.find(product => product.id === id)
    }

    static saveCart(cart)
    {
        console.log("saveCart() function, in Inventory Class")
        // Saving cart and cart values on local storage
        localStorage.setItem('cart', JSON.stringify(cart))
    }

    static getCart()
    {
        console.log("getCart() function, in Inventory Class")
        // For use upon loading/refreshing the website, checking if cart exists
        // if yes then load cart, else return empty array
        // done via a ternary operator
        return (
            localStorage.getItem('cart')?
            JSON.parse(localStorage.getItem('cart')):
            []
            )
    }

    static saveWishlist(wishlist)
    {
        console.log("saveWishlist() function, in Inventory Class")
        // Saving wishlist and wishlist values on local storage
        localStorage.setItem('wishlist', JSON.stringify(wishlist))
    }

    static getWishlist()
    {
        console.log("getWishlist() function, in Inventory Class")
        // For use upon loading/refreshing the website, checking if cart exists
        // if yes then load cart, else return empty array
        // done via a ternary operator
        return (
            localStorage.getItem('wishlist')?
            JSON.parse(localStorage.getItem('wishlist')):
            []
            )
    }
}

class Startup
{
    static startApp()
    {
        console.log("STARTING THE APPLICATION")
        console.log("startApp() function, in Controller class")
        document.addEventListener("DOMContentLoaded", () => {
            const mobileStore = new Handler()
            const products = new Products()
            //setup the application
            mobileStore.setupApp()
        
            // get all products from .json file
            products.getProducts().then( products =>   
                {
                    // Display items from storage
                    mobileStore.displayProducts(products) 
                    // Locally storing items in the cart
                    Inventory.saveProducts(products)
                }).then(() => {
                    mobileStore.getBagButtons()
                    mobileStore.cartLogic()
                    mobileStore.getWishlistButtons()
                    mobileStore.wishlistLogic()
                })
        })
    }
}

// Say the magic word
Startup.startApp()