class Cart {
  constructor(source, container = '#cart'){
      this.source = source;
      this.container = container;
      this.countGoods = 0; //Общее кол-во товаров в корзине
      this.amount = 0; // Общая сумма
      this.cartItems = []; //Все товары в корзине
      this.cartUiHeader = new CartUiHeader(container);
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
                  $('.del').click(() => {
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
          $('.del').click(() => {
            this._remove(product.id_product);
          });
      }
      this.cartUiHeader._renderSum(this.amount, this.countGoods);
  }

  _remove(productId){
      let find = this.cartItems.find(product => product.id_product === productId);
      if (find.quantity > 1) {
          find.quantity--;
          this.cartUiHeader._updateCart(find);
      } else {
          let $container = $(`div[data-product="${productId}"]`);
          this.cartItems.splice(this.cartItems.indexOf(find), 1);
          $container.remove();
      }
      this.countGoods--;
      this.amount -= find.price;
      this.cartUiHeader._renderSum(this.amount, this.countGoods);
  }
}

