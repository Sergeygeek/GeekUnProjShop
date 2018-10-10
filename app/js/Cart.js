class Cart {
  constructor(source, container = '#cart'){
      this.source = source;
      this.container = container;
      this.countGoods = 0; //Общее кол-во товаров в корзине
      this.amount = 0; // Общая сумма
      this.cartItems = []; //Все товары в корзине
      this.cartUiHeader = new CartUiHeader(container);
      this.cartHref = /shopping-cart/;
      this._init(this.source);
  }

  _init(source){
      this.cartUiHeader._init();
      fetch(source)
            .then(result => result.json())
            .then(data => {
                for (let product of data.contents){
                    this.cartItems.push(product);
                    this.cartUiHeader._renderItem(product);
                    if(this.cartHref.test(window.location.href)) {
                        this._renderCartItem(product);
                    }
                    $('.delBtn').click(() => {
                        this._remove(product.id_product);
                    });
                }
                this.countGoods = data.countGoods;
                this.amount = data.amount;
                if(this.countGoods > 0) {
                    $('.cart-quantity').removeClass('hidden');
                }
                this.cartUiHeader._renderSum(data.amount, data.countGoods);
            })
  }


    _addProduct(element){
        let productId = +$(element).data('id');
        let find = this.cartItems.find(product => product.id_product === productId);
        if (find) {
            find.quantity++;
            this.countGoods++;
            this.amount += find.price;
            this.cartUiHeader._updateCart(find);
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
            this.cartUiHeader._renderItem(product);
            if($('.cart-quantity').hasClass('hidden')){
                $('.cart-quantity').removeClass('hidden');
            }
            $('.delBtn').click(() => {
                this._remove(product.id_product);
            });
        }
        this.cartUiHeader._renderSum(this.amount, this.countGoods);
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
      }

    _remove(productId){
        let find = this.cartItems.find(product => product.id_product === productId);
        if (find.quantity > 1) {
            find.quantity--;
            this.cartUiHeader._updateCart(find);
        } else {
            let $container = $(`div[data-product="${productId}"]`);
            let $containerItem = $(`tr[data-product="${productId}"]`);
            this.cartItems.splice(this.cartItems.indexOf(find), 1);
            $container.remove();
            $containerItem.remove();
        }
        this.countGoods--;
        this.amount -= find.price;
        this.cartUiHeader._renderSum(this.amount, this.countGoods);
    }
}

