class Cart {
  constructor(source, container = '#cart'){
      this.source = source;
      this.container = container;
      this.countGoods = 0; //Общее кол-во товаров в корзине
      this.amount = 0; // Общая сумма
      this.cartItems = []; //Все товары в корзине
      this.cartHref = /shopping-cart/;
      this._init(this.source);
  }

  _init(source){
      this._render();
      fetch(source)
            .then(result => result.json())
            .then(data => {
                for (let product of data.contents){
                    this.cartItems.push(product);
                    this._renderItem(product);
                    if(this.cartHref.test(window.location.href)) {
                        this._renderCartItem(product);
                    }
                }
                this.countGoods = data.countGoods;
                this.amount = data.amount;
                if(this.countGoods > 0) {
                    $('.cart-quantity').removeClass('hidden');
                }
                this._renderSum(data.amount, data.countGoods);
            })
  }


    _addProduct(element){
        let productId = +$(element).data('id');
        let find = this.cartItems.find(product => product.id_product === productId);
        if (find) {
            find.quantity++;
            this.countGoods++;
            this.amount += find.price;
            this._updateCart(find);
        } else {
            let product = {
                id_product: productId,
                price: +$(element).data('price'),
                product_name: $(element).data('name'),
                img_src: $(element).data('src'),
                quantity: 1
            };
            this.cartItems.push(product);
            this.amount += product.price;
            this.countGoods += product.quantity;
            this._renderItem(product);
            if($('.cart-quantity').hasClass('hidden')){
                $('.cart-quantity').removeClass('hidden');
            }
        }
        this._renderSum(this.amount, this.countGoods);
    }

    _renderCartItem(product) {
        let $container = $('<tr/>', {
            class: 'item_container',
            'data-product': product.id_product
        });

        let $tdImg = $('<td/>', {
            class: 'cart-item'
        });

        let $figure = $('<figure/>', {
            class: 'item-wrap',
        });

        let $divImg = $('<div/>', {
            class: 'item-img',
            html: `<img src=${product.img_src} alt="">`,
        });

        let $article = $('<article/>', {
            class: 'clarification'
        });

        let $itemTitle = $('<h4>', {
            class: 'item-title',
            text: product.product_name
        });

        let $chosenDiv = $('<div/>', {
            class: 'chosen-wrap',
            html: '<p class="chosen">Color: <span>Red</span></p><p class="chosen">Size: <span>Xll</span></p>'
        });

        let $tdPrice = $('<td/>', {
            class: 'data',
            text: `${product.price}`
        });
        
        let $tdQuantity = $('<td/>', {
            class: 'data',
            html: `<input type="number" name="quantity" value=${product.quantity}>`
        }); 

        let $tdTax = $('<td/>', {
            class: 'data',
            text: 'free'
        });
        
        let $tdTotalItemPrice = $('<td/>', {
            class: 'data',
            text: `${product.price * product.quantity}`
        }); 

        let $tdDel = $('<td/>', {
            class: 'data delBtn',
            html: '<a href="#"><i class="fas fa-times-circle"></i></a>'
        }); 

        $article.append($itemTitle);
        $article.append($chosenDiv);
        $figure.append($divImg);
        $figure.append($article);
        $tdImg.append($figure);
        $container.append($tdImg);
        $container.append($tdPrice);
        $container.append($tdQuantity);
        $container.append($tdTax);
        $container.append($tdTotalItemPrice);
        $container.append($tdDel);
        $('table.container').append($container);
        $tdDel.click(() => {
            this._remove(product.id_product);
        });
      }

    _remove(productId){
        let find = this.cartItems.find(product => product.id_product === productId);
        if (find.quantity > 1) {
            find.quantity--;
            this._updateCart(find);
        } else {
            let $container = $(`div[data-product="${productId}"]`);
            let $containerItem = $(`tr[data-product="${productId}"]`);
            this.cartItems.splice(this.cartItems.indexOf(find), 1);
            $container.remove();
            $containerItem.remove();
        }
        this.countGoods--;
        this.amount -= find.price;
        this._renderSum(this.amount, this.countGoods);
    }

    _render(){
        let $totalPrice = $('<p/>', {
            class: 'total_cart'
        });

        let $checkout = $('<a/>', {
            class: 'btn_cart-menu',
            href: 'checkout.html',
            text: 'Checkout'
        });

        let $toCart = $('<a/>', {
            class: 'btn_cart-menu',
            href: 'shopping-cart.html',
            text: 'Go to cart'
        });

        $totalPrice.appendTo($(this.container));
        $checkout.appendTo($(this.container));
        $toCart.appendTo($(this.container));
    }

    _renderSum(amount, countGoods){
        $('.total_cart').html(`TOTAL <span>${amount}</span>руб.`);
        $('.cart-quantity').text(`${countGoods}`);
        if($('.total-price')) {
            $('.price').text(`${amount}`);
            $('.price-total').text(`${amount}`)
        }
    }

    _renderItem(product){
        let $container = $('<div/>', {
            class: 'item_cart',
            'data-product': product.id_product
        });
        let $img = $('<img/>', {
                src: product.img_src
            }
        );

        let $delBtn = $('<a href="#" class="del delBtn"><i class="fas fa-times-circle"></i></a>');
        let $count = $('<p/>', {
            class: 'count',
            html: `<span class="cart-count">${product.quantity}</span> x <span class="cart-prize">${product.price}</span>`
        });
        $container.append($(`<h4 class="cart-menu-title">${product.product_name}</h4>`));
        $container.append($delBtn);
        $container.append($img);
        $container.append($count);
        $(this.container).prepend($container);
        $delBtn.click(() => {
            this._remove(product.id_product);
        });
    }

    _updateCart(product){
        let $container = $(`div[data-product="${product.id_product}"]`);
        $container.find('.cart-count').text(product.quantity);
        $container.find('.cart-prize').text(`${product.quantity * product.price} руб.`);
    }
}

