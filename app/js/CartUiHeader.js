class CartUiHeader {
  constructor(container){
    this.container = container;
  }

  _init(){
    this._render();
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

    let $delBtn = $('<a href="#" class="del"><i class="fas fa-times-circle"></i></a>');
    let $count = $('<p/>', {
      class: 'count',
      html: `<span class="cart-count">${product.quantity}</span> x <span class="cart-prize">${product.price}</span>`
    });
    $container.append($(`<h4 class="cart-menu-title">${product.product_name}</h4>`));
    $container.append($delBtn);
    $container.append($img);
    $container.append($count);
    
    $(this.container).prepend($container);  
  }
  
  _updateCart(product){
    let $container = $(`div[data-product="${product.id_product}"]`);
    $container.find('.cart-count').text(product.quantity);
    $container.find('.cart-prize').text(`${product.quantity*product.price} руб.`);
  }
}
