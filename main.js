'use-strict';

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
        <div class="product">
            <div class="product-image">
                <a :href="link" target="_blank" rel="noopener noreferrer">
                    <img :src="image" alt="nice socks">
                </a>
            </div>

            <div class="product-info">
                <h1>{{ title }}</h1>
                <p v-if="inStock">In Stock</p>
                <p v-else :class="[ !!inStock === false ? lineThrough : '']">Out of Stock</p>
                <p>Shipping: {{ shipping }}</p>

                <product-details :details="details"></product-details>
                
                <h4>Colors:</h4>
                <br>
                <div v-for="(variant, index) in variants" :key="variant.variantId" @mouseover="updateProduct(index)">

                    <div class="color-box" :style="{ backgroundColor: variant.variantColor }"></div>
                    <span>{{ variant.variantColor }}</span>
                </div>
                <br>
                <h4>Sizes:</h4>
                <div class="left-right-list" v-for="size in sizes" :key="sizes.indexOf(size)">
                    <span>{{ size }}</span>
                </div>

                <br>

                <button @click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Add to
                    Cart</button>
                <button @click=removeFromCart > Remove</button>
                <br/>
                <br/>
                
                <div class="reviews">
                    <h2>Reviews</h2>
                    <p v-if="!reviews.length">There are no reviews yet. Be the first!</p>
                    <ul v-else class="review-list">
                        <li v-for="review in reviews">
                            <div>{{ review.name + " (" + review.rating + "/5)" }}</div>
                            <code>"{{ review.review }}"</code>
                        </li>
                    </ul>
                </div>
            </div>

            <product-review @review-submitted="addReview"></product-review>
        </div>
    `,
    data() {
        return {
            brand: 'Vue Mastery',
            product: 'Socks',
            selectedVariant: 0,
            link: 'https://www.vuemastery.com/',
            onSale: true,
            lineThrough: 'line-through',
            details: ["80% cotton", "20% polyester", "Gender-neutral"],
            variants: [
                {
                    variantId: 2234,
                    variantColor: "green",
                    variantImage: './assets/vmSocks-green-onWhite.jpg',
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: "darkblue",
                    variantImage: './assets/vmSocks-blue-onWhite.jpg',
                    variantQuantity: 100
                }
            ],
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            reviews: []
        };
    },
    methods: {
        addToCart() {
            this.$emit(
                'add-to-cart',
                this.variants[this.selectedVariant].variantId
            );
        },
        removeFromCart() {
            this.$emit(
                'remove-from-cart',
                this.variants[this.selectedVariant].variantId
            );
        },
        updateProduct(index) {
            this.selectedVariant = index;
        },
        addReview(productReview) {
            this.reviews.push(productReview);
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity;
        },
        shipping() {
            if (this.premium) {
                return `Free`;
            } else {
                return `$2.99`;
            }
        }
    }
});

Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
        <div class="product-details">
            <ul>
                <li v-for="detail in details">{{ detail }}</li>
            </ul>
        </div>
    `
});

Vue.component('product-review', {
    props: {

    },
    template: `
        <form class="review-form" @submit.prevent="onSubmit">
            <p v-if="errors.length">
                <b v-if="errors.length < 2">Please correct the following error:</b>
                <b v-else>Please correct the following errors:</b>
                <ul>
                    <li v-for="error in errors">{{ error }}</li>
                </ul>
            </p>
            <p>
                <label for="name">Name:</label>
                <input id="name" v-model="name">
            </p>
            <p>
                <label for="review">Review:</label>
                <textarea id="review" v-model="review"></textarea>
            </p>
            <p>
                <label for="rating">Rating:</label>
                <select id="rating" v-model.number="rating">
                    <option>5</option>
                    <option>4</option>
                    <option>3</option>
                    <option>2</option>
                    <option>1</option>
                </select>
            </p>
            <p>
                <p>Would you recommend this product?</p>
                <label for="recommend">Yes</label>
                <input type="radio" id="recommend" class="radios" name="recommend" value="yes" v-model="recommend">
                <br />
                <br />
                <label for="donotrecommend">No</label>
                <input type="radio" id="donotrecommend" class="radios" name="recommend" value="no" v-model="recommend">
            </p>
            <p>
                <input type="submit" value="Submit">  
            </p>   
        </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommend: null,
            errors: []
        };
    },
    methods: {
        onSubmit() {
            // clear previous attempt's errors and start fresh
            this.errors = [];
            if (this.name && this.review && this.rating && this.recommend) {
                let productReview = {
                    name: this.name.trim(),
                    review: this.review.trim(),
                    rating: this.rating,
                    recommend: this.recommend
                };
                // send up to parent product component
                this.$emit('review-submitted', productReview);
                // reset data:
                this.name = null;
                this.review = null;
                this.rating = null;
                this.recommend = null;
            } else {
                if (!this.name) {
                    this.errors.push("Name required.");
                }
                if (!this.rating) {
                    this.errors.push("Rating required.");
                }
                if (!this.review) {
                    this.errors.push("Review required.");
                }
                if (!this.recommend) {
                    this.errors.push("Recommendation required.");
                }
                // don't reset data so user doesn't have to retype what they did fill in so far
            }
        }
    }
});

var app = new Vue({
    el: '#app',
    data: {
        premium: false,
        cart: []
    },
    methods: {
        addCart(id) {
            this.cart.push(id);
        },
        removeCart(id) {
            this.cart = this.cart.filter(function (i) {
                return i !== id;
            });
        }
    }
});